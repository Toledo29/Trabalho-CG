// Scene.js
import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { criaArvoresQuadrado, criaArvoresL, criaArvoresQuatroQuadrantes, criaTunel } from './Elements.js';
import { initRenderer } from './Renderer.js';
import { initLight, updateLightFollow } from './Light.js';
import {
  setDefaultMaterial,
  InfoBox,
  SecondaryBox,
  onWindowResize
} from "../libs/util/util.js";

// ADIÇÃO: importei createEnemyCar
import { createCar, createEnemyCar, resetCarPosition, updateCar } from './Car.js';
import { createTrack, track1, track2, track3 } from './Track.js';

import {
  createSquareWalls,
  createLWalls,
  createThirdWalls,
  groupSquareWalls,
  groupLWalls,
  groupThirdWalls,
  barreirasTrack1,
  barreirasTrack2,
  barreirasTrack3
} from './Walls.js';

import { createGroundPlane } from './Ground.js';
import { updateCameraFollow } from './Camera.js';
import { checkLapCount, resetLapSystem, MAX_LAPS } from './Misc.js';

// ------------------------------------------------------------
// SCENE
// ------------------------------------------------------------
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// ------------------------------------------------------------
// MATERIALS
// ------------------------------------------------------------
const materialPista = setDefaultMaterial('rgb(200,200,200)');
const materialChao = setDefaultMaterial('rgb(34,139,34)');

// ------------------------------------------------------------
// STATE
// ------------------------------------------------------------
export let currentTrack = 1;

// ------------------------------------------------------------
// CAR (PLAYER) e INIMIGO
// ------------------------------------------------------------
export const car = createCar(scene);
// enemyCar criado, mas sem IA por enquanto — só para existir na cena
export const enemyCar = createEnemyCar ? createEnemyCar(scene) : null;

// ------------------------------------------------------
// Criação da iluminação e renderer
// ------------------------------------------------------

const dirLight = initLight(scene, car);
export const renderer = initRenderer();

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
// HUD – Velocidade
// ------------------------------------------------------------
const speedBox = new SecondaryBox("");
speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

// ------------------------------------------------------------
// HUD – Voltas
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
lapDiv.style.fontFamily = "Arial";
lapDiv.style.fontSize = "14px";
lapDiv.style.textAlign = "right";
lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
document.body.appendChild(lapDiv);

// ------------------------------------------------------------
// KEYBOARD
// ------------------------------------------------------------
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);
const keyboard = new KeyboardState();
const clock = new THREE.Clock();
const moveDirection = { forward: false, backward: false, left: false, right: false };

// ------------------------------------------------------------
// INFOBOX
// ------------------------------------------------------------
const controls = new InfoBox();
controls.infoBox.style.top = "0px";
controls.add("Car Race");
controls.addParagraph();
controls.add("* Seta ← → para girar");
controls.add("* Seta ↑ / X para acelerar");
controls.add("* Seta ↓ para frear");
controls.add("* Tecla 1 = Pista Quadrada");
controls.add("* Tecla 2 = Pista L");
controls.add("* Tecla 3 = Pista Formato em 8");
controls.show();

// ------------------------------------------------------------
// CREATE WORLD
// ------------------------------------------------------------
createTrack(scene, materialPista);
createGroundPlane(scene, materialChao);

// Walls creation
createSquareWalls();
createLWalls();
createThirdWalls();

// Add groups to scene
scene.add(groupSquareWalls);
scene.add(groupLWalls);
scene.add(groupThirdWalls);

// Initial visibility
groupSquareWalls.visible = true;
groupLWalls.visible = false;
groupThirdWalls.visible = false;

track1.visible = true;
track2.visible = false;
track3.visible = false;

// ------------------------------------------------------------
// ARVORES EM VOLTA DAS PISTAS
// ------------------------------------------------------------
let arvoresAtuais = [];
function removeArvores() {
  for (const arvore of arvoresAtuais) {
    scene.remove(arvore);
  }
  arvoresAtuais = [];
}
// Cria árvores da pista quadrada inicialmente
arvoresAtuais = criaArvoresQuadrado(scene);

//cria tunel

const tunel = criaTunel(scene);
tunel.position.set(-90, -6, 0);
scene.add(tunel);

// ------------------------------------------------------------
// KEYBOARD UPDATE
// ------------------------------------------------------------
function keyboardUpdate() {
  keyboard.update();

  moveDirection.forward  = keyboard.pressed("up") || keyboard.pressed("X");
  moveDirection.backward = keyboard.pressed("down");
  moveDirection.left     = keyboard.pressed("left");
  moveDirection.right    = keyboard.pressed("right");


  // TRACK 1
  if (keyboard.down("1") && currentTrack !== 1) {
    currentTrack = 1;
    track1.visible = true;
    track2.visible = false;
    track3.visible = false;
    groupSquareWalls.visible = true;
    groupLWalls.visible = false;
    groupThirdWalls.visible = false;
    resetCarPosition(car,enemyCar, 1);
    resetLapSystem();
    lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
    removeArvores();
    arvoresAtuais = criaArvoresQuadrado(scene);
  }

  // TRACK 2
  if (keyboard.down("2") && currentTrack !== 2) {
    currentTrack = 2;
    track1.visible = false;
    track2.visible = true;
    track3.visible = false;
    groupSquareWalls.visible = false;
    groupLWalls.visible = true;
    groupThirdWalls.visible = false;
    resetCarPosition(car,enemyCar, 2);
    resetLapSystem();
    lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
    removeArvores();
    arvoresAtuais = criaArvoresL(scene);
    scene.remove(tunel);
    tunel.position.set(-90, -6, -50);
    scene.add(tunel);
  }

  // TRACK 3 (NOVA)
  if (keyboard.down("3") && currentTrack !== 3) {
    currentTrack = 3;
    track1.visible = false;
    track2.visible = false;
    track3.visible = true;
    groupSquareWalls.visible = false;
    groupLWalls.visible = false;
    groupThirdWalls.visible = true;
    resetCarPosition(car,enemyCar, 3);
    resetLapSystem();
    lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
    removeArvores();
    arvoresAtuais = criaArvoresQuatroQuadrantes(scene);
    scene.remove(tunel);
    tunel.position.set(-80, -6, -50);
    scene.add(tunel);
  }
}

// ------------------------------------------------------------
// COLLISIONS
// ------------------------------------------------------------
function checkCollision(track) {
  const carBB = new THREE.Box3().setFromObject(car);
  const carDir = new THREE.Vector3(Math.cos(car.rotation.y), 0, -Math.sin(car.rotation.y));

  const list = track === 1 ? barreirasTrack1 :
              track === 2 ? barreirasTrack2 :
                             barreirasTrack3; // para pista 3

  for (const { mesh, bb } of list) {
    bb.setFromObject(mesh);

    if (carBB.intersectsBox(bb)) {
      // ======= Detecção de penetração =======
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

      // Corrige posição para evitar penetração
      car.position.add(correction);

      // ======= Cálculo do ângulo e fator de desaceleração =======
      const movementDir = carDir.clone().multiplyScalar(Math.sign(car.userData.speed));
      const angleDeg = THREE.MathUtils.radToDeg(movementDir.angleTo(normal));

      // Quanto mais frontal o impacto (ângulo > 90), maior a perda
      let reductionRate = 0.02; // desaceleração base suave
      if (angleDeg > 90) {
        const factor = (angleDeg - 90) / 90; // 0 a 1
        reductionRate += factor * 0.08; // até 0.1 total
      }

      // ======= Redução gradual até zero =======
      const currentSpeed = Math.abs(car.userData.speed);
      const newSpeed = Math.max(0, currentSpeed - reductionRate * currentSpeed * 5);
      car.userData.speed = Math.sign(car.userData.speed) * newSpeed;

      // Parar totalmente se muito lento
      if (Math.abs(car.userData.speed) < 0.05) car.userData.speed = 0;

      return true;
    }
  }

  return false;
}


// ------------------------------------------------------------
// MAIN LOOP
// ------------------------------------------------------------
function render() {
  keyboardUpdate();

  const delta = clock.getDelta();
  updateCar(car, delta, moveDirection);
  // NOTE: por enquanto não há IA/controle do enemyCar — atualize depois se quiser
  updateCameraFollow(camera, car, moveDirection);
  updateLightFollow(car, dirLight);

  checkCollision(currentTrack);

  const lapText = checkLapCount(car, currentTrack);
  if (lapText !== null) lapDiv.innerText = lapText;

  speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
resetCarPosition(car, enemyCar, 1);
render();
