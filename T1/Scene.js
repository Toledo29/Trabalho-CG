// Scene.js
import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createCar, updateCar } from './Car.js';
import { createTrack } from './Track.js';
import { updateCameraFollow } from './Camera.js';
import {
  initRenderer,
  initDefaultBasicLight,
  InfoBox,
  SecondaryBox,
  onWindowResize,
  degreesToRadians
} from "../libs/util/util.js";

// ------------------------------------------------------
// Variáveis principais
// ------------------------------------------------------
const MAX_LAPS = 2;
export let scene = new THREE.Scene();
const renderer = initRenderer();
const light = initDefaultBasicLight(scene);
scene.background = new THREE.Color(0x87CEEB); // céu azul

// ------------------------------------------------------
// Criação do carro e pista
// ------------------------------------------------------
const car = createCar();
const { barreirasTrack1, barreirasTrack2 } = createTrack(scene, car);

// ------------------------------------------------------
// Câmera e HUD
// ------------------------------------------------------
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(car.position.x - 15, car.position.y + 4, car.position.z);
camera.up.set(0, 1, 0);
camera.lookAt(car.position);
scene.add(camera);

window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

const speedBox = new SecondaryBox("");
speedBox.changeMessage(`Velocidade: ${car.userData.speed.toFixed(0)}`);

export const lapDiv = document.createElement("div");
lapDiv.id = "lap-counter";
lapDiv.style.cssText = `
  position: absolute; right: 20px; bottom: 20px;
  padding: 6px 10px; background: rgba(0,0,0,0.6);
  color: white; border-radius: 6px; z-index: 9999;
  font-family: Arial, sans-serif; font-size: 14px;
`;
lapDiv.innerText = `Volta: 0 / ${MAX_LAPS}`;
document.body.appendChild(lapDiv);

// ------------------------------------------------------
// Controles e variáveis de movimento
// ------------------------------------------------------
const keyboard = new KeyboardState();
const clock = new THREE.Clock();

const moveDirection = { forward: false, backward: false, left: false, right: false };

function keyboardUpdate() {
  keyboard.update();
  moveDirection.forward = keyboard.pressed("W") || keyboard.pressed("ArrowUp");
  moveDirection.backward = keyboard.pressed("S") || keyboard.pressed("ArrowDown");
  moveDirection.left = keyboard.pressed("A") || keyboard.pressed("ArrowLeft");
  moveDirection.right = keyboard.pressed("D") || keyboard.pressed("ArrowRight");
}

// ------------------------------------------------------
// InfoBox
// ------------------------------------------------------
let controls = new InfoBox();
controls.infoBox.style.bottom = "";
controls.infoBox.style.top = "0";
controls.add("Car Race");
controls.addParagraph();
controls.add("* Setas ou WASD para controlar o carro.");
controls.show();

// ------------------------------------------------------
// Função de colisão entre carro e barreiras
// ------------------------------------------------------
function checkCarCollision() {
  const carBB = new THREE.Box3().setFromObject(car);
  const carDir = new THREE.Vector3(Math.cos(car.rotation.y), 0, -Math.sin(car.rotation.y));
  const allWalls = [...barreirasTrack1, ...barreirasTrack2];

  for (const { mesh, bb } of allWalls) {
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
      let reductionFactor = angleDeg > 90 ? 1 - (angleDeg - 90) / 90 : 1;
      reductionFactor = Math.max(0, reductionFactor);

      const velocityDir = carDir.clone().multiplyScalar(car.userData.speed);
      const normalComp = normal.clone().multiplyScalar(velocityDir.dot(normal));
      const tangentComp = velocityDir.clone().sub(normalComp);

      if (velocityDir.dot(normal) < 0) velocityDir.sub(normalComp);
      const newSpeed = tangentComp.length() * reductionFactor;
      car.userData.speed = Math.sign(car.userData.speed) * newSpeed;

      if (angleDeg >= 170) car.userData.speed = 0;
      carBB.setFromObject(car);
      return true;
    }
  }
  return false;
}

// ------------------------------------------------------
// Render loop
// ------------------------------------------------------
function render() {
  keyboardUpdate();
  const delta = clock.getDelta();
  updateCar(delta, moveDirection);
  checkCarCollision();
  updateCameraFollow(camera, car, moveDirection);

  speedBox.changeMessage(`Velocidade: ${car.userData.speed.toFixed(0)}`);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
