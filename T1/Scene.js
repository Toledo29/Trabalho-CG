// Scene.js
import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
  initRenderer,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  SecondaryBox,
  onWindowResize,
  degreesToRadians
} from "../libs/util/util.js";

import { createCar, resetCarPosition, updateCar } from './Car.js';
import { createTrack, track1, track2 } from './Track.js';
import {
  createSquareWalls,
  createLWalls,
  groupSquareWalls,
  groupLWalls,
  barreirasTrack1,
  barreirasTrack2
} from './Walls.js';

import { createGroundPlane } from './Ground.js';
import { updateCameraFollow } from './Camera.js';
import { checkLapCount, resetLapSystem, MAX_LAPS } from './Misc.js';

// ------------------------------------------------------------
// SCENE / RENDERER / LIGHT
// ------------------------------------------------------------
export const scene = new THREE.Scene();
export const renderer = initRenderer();
initDefaultBasicLight(scene);
scene.background = new THREE.Color(0x87CEEB);

// ------------------------------------------------------------
// MATERIAIS DA PISTA E CHÃO
// ------------------------------------------------------------
const materialPista = setDefaultMaterial('rgb(200,200,200)');
const materialChao = setDefaultMaterial('rgb(34,139,34)');

// ------------------------------------------------------------
// VARIÁVEIS DE CONTROLE
// ------------------------------------------------------------
export let currentTrack = 1;

// ------------------------------------------------------------
// CARRO
// ------------------------------------------------------------
export const car = createCar(scene);

// ------------------------------------------------------------
// CAMERA
// ------------------------------------------------------------
export const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(car.position.x - 15, car.position.y + 4, car.position.z);
camera.up.set(0, 1, 0);
camera.lookAt(car.position);
scene.add(camera);

// ------------------------------------------------------------
// HUD – VELOCIDADE
// ------------------------------------------------------------
const speedBox = new SecondaryBox("");
speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

// ------------------------------------------------------------
// HUD – VOLTAS
// ------------------------------------------------------------
const lapDiv = document.createElement("div");
lapDiv.id = "lap-counter";
lapDiv.style.position = "absolute";
lapDiv.style.right = "20px";
lapDiv.style.bottom = "20px";
lapDiv.style.padding = "6px 10px";
lapDiv.style.background = "rgba(0,0,0,0.6)";
lapDiv.style.color = "white";
lapDiv.style.borderRadius = "6px";
lapDiv.style.zIndex = "9999";
lapDiv.style.fontFamily = "Arial, sans-serif";
lapDiv.style.fontSize = "14px";
lapDiv.style.textAlign = "right";
lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
document.body.appendChild(lapDiv);

// ------------------------------------------------------------
// TECLADO / CLOCK
// ------------------------------------------------------------
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);
const keyboard = new KeyboardState();
const clock = new THREE.Clock();
const moveDirection = { forward: false, backward: false, left: false, right: false };

// ------------------------------------------------------------
// INFOBOX
// ------------------------------------------------------------
const controls = new InfoBox();
controls.infoBox.style.top = "0";
controls.add("Car Race");
controls.addParagraph();
controls.add("* Seta para a Esquerda/Direita para girar o carro.");
controls.add("* Seta para Cima/X para acelerar o carro.");
controls.add("* Seta para Baixo para frear o carro.");
controls.show();

// ------------------------------------------------------------
// CRIAÇÃO DE MUNDO
// ------------------------------------------------------------
createTrack(scene, materialPista);
createGroundPlane(scene, materialChao);

// paredes internas — sem adicionar ao scene ainda
createSquareWalls();
createLWalls();

// adiciona os grupos ao scene
scene.add(groupSquareWalls);
scene.add(groupLWalls);

// visibilidade inicial
groupSquareWalls.visible = true;
groupLWalls.visible = false;

// ------------------------------------------------------------
// TECLAS – TROCA DE PISTA
// ------------------------------------------------------------
function keyboardUpdate() {
  keyboard.update();

  // Movimentação
  moveDirection.forward = keyboard.pressed("up") || keyboard.pressed("X");
  moveDirection.backward = keyboard.pressed("down");
  moveDirection.left = keyboard.pressed("left");
  moveDirection.right = keyboard.pressed("right");

  // -------- Trocar para pista quadrada --------
  if (keyboard.down("1") && currentTrack !== 1) {
    currentTrack = 1;

    track1.visible = true;
    track2.visible = false;

    groupSquareWalls.visible = true;
    groupLWalls.visible = false;

    resetCarPosition(car, 1);
    resetLapSystem();
    lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
  }

  // -------- Trocar para pista L --------
  else if (keyboard.down("2") && currentTrack !== 2) {
    currentTrack = 2;

    track1.visible = false;
    track2.visible = true;

    groupSquareWalls.visible = false;
    groupLWalls.visible = true;

    resetCarPosition(car, 2);
    resetLapSystem();
    lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
  }
}

// ------------------------------------------------------------
// COLISÕES (pista 1)
// ------------------------------------------------------------
function checkCarCollision() {
  const carBB = new THREE.Box3().setFromObject(car);
  const carDir = new THREE.Vector3(Math.cos(car.rotation.y), 0, -Math.sin(car.rotation.y));

  for (const { mesh, bb } of barreirasTrack1) {
    bb.setFromObject(mesh);

    if (carBB.intersectsBox(bb)) {
      const overlapX = Math.min(carBB.max.x, bb.max.x) - Math.max(carBB.min.x, bb.min.x);
      const overlapZ = Math.min(carBB.max.z, bb.max.z) - Math.max(carBB.min.z, bb.min.z);

      let normal = new THREE.Vector3();
      let correction = new THREE.Vector3();

      if (overlapX < overlapZ) {
        normal.set(car.position.x > mesh.position.x ? 1 : -1, 0, 0);
        correction.copy(normal).multiplyScalar(overlapX + 0.05);
      } else {
        normal.set(0, 0, car.position.z > mesh.position.z ? 1 : -1);
        correction.copy(normal).multiplyScalar(overlapZ + 0.05);
      }

      car.position.add(correction);

      const movementDir = carDir.clone().multiplyScalar(Math.sign(car.userData.speed));
      const angleDeg = THREE.MathUtils.radToDeg(movementDir.angleTo(normal));

      let reductionFactor = 1.0;
      if (angleDeg > 90) {
        reductionFactor = 1.0 - (angleDeg - 90) / 90;
        reductionFactor = Math.max(0, reductionFactor);
      }

      const velocityDir = carDir.clone().multiplyScalar(car.userData.speed);
      const normalComponent = normal.clone().multiplyScalar(velocityDir.dot(normal));
      const tangentialComponent = velocityDir.clone().sub(normalComponent);

      if (velocityDir.dot(normal) < 0) velocityDir.sub(normalComponent);

      const newSpeed = tangentialComponent.length() * reductionFactor;
      car.userData.speed = Math.sign(car.userData.speed) * newSpeed;

      if (angleDeg >= 170) car.userData.speed = 0;

      return true;
    }
  }
  return false;
}

// ------------------------------------------------------------
// COLISÕES (pista L)
// ------------------------------------------------------------
function checkCarCollision2() {
  const carBB = new THREE.Box3().setFromObject(car);
  const carDir = new THREE.Vector3(Math.cos(car.rotation.y), 0, -Math.sin(car.rotation.y));

  for (const { mesh, bb } of barreirasTrack2) {
    bb.setFromObject(mesh);

    if (carBB.intersectsBox(bb)) {
      const overlapX = Math.min(carBB.max.x, bb.max.x) - Math.max(carBB.min.x, bb.min.x);
      const overlapZ = Math.min(carBB.max.z, bb.max.z) - Math.max(carBB.min.z, bb.min.z);

      let normal = new THREE.Vector3();
      let correction = new THREE.Vector3();

      if (overlapX < overlapZ) {
        normal.set(car.position.x > mesh.position.x ? 1 : -1, 0, 0);
        correction.copy(normal).multiplyScalar(overlapX + 0.05);
      } else {
        normal.set(0, 0, car.position.z > mesh.position.z ? 1 : -1);
        correction.copy(normal).multiplyScalar(overlapZ + 0.05);
      }

      car.position.add(correction);

      const movementDir = carDir.clone().multiplyScalar(Math.sign(car.userData.speed));
      const angleDeg = THREE.MathUtils.radToDeg(movementDir.angleTo(normal));

      let reductionFactor = 1.0;
      if (angleDeg > 90) {
        reductionFactor = 1.0 - (angleDeg - 90) / 90;
        reductionFactor = Math.max(0, reductionFactor);
      }

      const velocityDir = carDir.clone().multiplyScalar(car.userData.speed);
      const normalComponent = normal.clone().multiplyScalar(velocityDir.dot(normal));
      const tangentialComponent = velocityDir.clone().sub(normalComponent);

      if (velocityDir.dot(normal) < 0) velocityDir.sub(normalComponent);

      const newSpeed = tangentialComponent.length() * reductionFactor;
      car.userData.speed = Math.sign(car.userData.speed) * newSpeed;

      if (angleDeg >= 170) car.userData.speed = 0;

      return true;
    }
  }
  return false;
}

// ------------------------------------------------------------
// LOOP PRINCIPAL
// ------------------------------------------------------------
function render() {
  keyboardUpdate();

  const delta = clock.getDelta();
  updateCar(car, delta, moveDirection);
  updateCameraFollow(camera, car, moveDirection);

  if (currentTrack === 1)
    checkCarCollision();
  else
    checkCarCollision2();

  const lapText = checkLapCount(car, currentTrack, track1, track2);
  if (lapText !== null)
    lapDiv.innerText = lapText;

  speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// ------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------
resetCarPosition(car, 1);
render();
