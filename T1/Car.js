import * as THREE from 'three';
import { currentLap,passedFinishLine,gameFinished } from '../T1/Misc.js';
import {lapDiv,car,scene} from '../T1/Scene.js';
import { setDefaultMaterial, degreesToRadians} from "../libs/util/util.js";

const START_POS_TRACK1 = new THREE.Vector3(-80, 0.5, -90); 
const START_ROT_TRACK1 = degreesToRadians(0); 

const START_POS_TRACK2 = new THREE.Vector3(-10, 0.5, -90); 
const START_ROT_TRACK2 = degreesToRadians(0);


export function createCar() {
  let hovercraft = new THREE.Group();

  // Base inflável (anel inferior mais fino)
  const baseGeometry = new THREE.TorusGeometry(1.3, 0.25, 16, 32);
  const base = new THREE.Mesh(baseGeometry, setDefaultMaterial('rgb(255, 100, 100)')); // vermelho claro
  base.rotation.x = Math.PI / 2;
  hovercraft.add(base);

  // Corpo central (cilindro mais fino e mais leve)
  const bodyGeometry = new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16);
  const body = new THREE.Mesh(bodyGeometry, setDefaultMaterial('rgb(255, 0, 0)')); // vermelho principal
  body.position.y = 0.55;
  hovercraft.add(body);

  // Cabine superior (menor e mais fina)
  const cabineGeometry = new THREE.BoxGeometry(1.0, 0.5, 0.7);
  const cabine = new THREE.Mesh(cabineGeometry, setDefaultMaterial('rgb(255, 255, 255)')); // branca
  cabine.position.set(0, 1.0, 0);
  hovercraft.add(cabine);

  // Cone frontal (proa mais afilada)
  const noseGeometry = new THREE.ConeGeometry(0.4, 1.0, 16);
  const nose = new THREE.Mesh(noseGeometry, setDefaultMaterial('rgb(255, 0, 0)'));
  nose.rotation.z = Math.PI / 2;
  nose.position.set(1.7, 0.35, 0);
  hovercraft.add(nose);

  // Ajuste de posição inicial (como no seu código)
  hovercraft.position.set(-100.0, 0.5, -100.0);

  // Adiciona na cena
  scene.add(hovercraft);
  return hovercraft;
}

  // ------------------------------------------------------
  // Atualização da posição do carro
  // ------------------------------------------------------
export function updateCar(delta) {
    const carData = car.userData;

    if (moveDirection.forward) carData.speed += carData.accel * delta;
    else if ((carData.speed - carData.drag * delta) >= 0) carData.speed -= carData.drag * delta;

    if (moveDirection.backward) carData.speed -= carData.brake * delta;
    else if ((carData.speed + carData.drag * delta) <= 0) carData.speed += carData.drag * delta;

    carData.speed = THREE.MathUtils.clamp(carData.speed, carData.maxReverseSpeed, carData.maxSpeed);

    if (moveDirection.left) car.rotation.y += carData.turnSpeed * delta;
    else if (moveDirection.right) car.rotation.y -= carData.turnSpeed * delta;

    car.translateX(carData.speed * delta);
}

// ------------------------------------------------------
// Função para reposicionar o carro
// ------------------------------------------------------
export function resetCarPosition(trackNumber) {
    let newPos, newRot;

    if (trackNumber === 1) {
        newPos = START_POS_TRACK1;
        newRot = START_ROT_TRACK1;
    } else { 
        newPos = START_POS_TRACK2;
        newRot = START_ROT_TRACK2;
    }

    car.position.copy(newPos);
    car.rotation.y = newRot;
    car.userData.speed = 0;

    currentLap = 0;
    lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
    passedFinishLine = false;
    gameFinished = false;
}