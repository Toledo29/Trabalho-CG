// Car.js
import * as THREE from 'three';
import { scene } from './Scene.js';
import { setDefaultMaterial, degreesToRadians } from "../libs/util/util.js";
import { currentLap, passedFinishLine, gameFinished } from './Misc.js';

const START_POS_TRACK1 = new THREE.Vector3(-80, 0.5, -90);
const START_ROT_TRACK1 = degreesToRadians(0);
const START_POS_TRACK2 = new THREE.Vector3(-10, 0.5, -90);
const START_ROT_TRACK2 = degreesToRadians(0);

export let car; // carro será criado uma vez

// ====================================================
// Função: Criação do carro (hovercraft estilizado)
// ====================================================
export function createCar() {
  car = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.25, 16, 32),
    setDefaultMaterial('rgb(255, 100, 100)')
  );
  base.rotation.x = Math.PI / 2;
  car.add(base);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16),
    setDefaultMaterial('rgb(255, 0, 0)')
  );
  body.position.y = 0.55;
  car.add(body);

  const cabine = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.5, 0.7),
    setDefaultMaterial('rgb(255, 255, 255)')
  );
  cabine.position.set(0, 1.0, 0);
  car.add(cabine);

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 1.0, 16),
    setDefaultMaterial('rgb(255, 0, 0)')
  );
  nose.rotation.z = Math.PI / 2;
  nose.position.set(1.7, 0.35, 0);
  car.add(nose);

  car.position.set(-100.0, 0, -100.0);
  car.userData = {
    speed: 0,
    accel: 17.0,
    brake: 17.0,
    drag: 15.0,
    maxSpeed: 30.0,
    maxReverseSpeed: -20.0,
    turnSpeed: THREE.MathUtils.degToRad(120),
  };
  base.castShadow = true;
  base.receiveShadow = true;
  body.castShadow = true;
  body.receiveShadow = true;
  cabine.castShadow = true;
  cabine.receiveShadow = true;
  nose.castShadow = true;
  nose.receiveShadow = true;
  car.castShadow = true;
  car.receiveShadow = true;
  scene.add(car);
  return car;
}

// ====================================================
// Função: Atualiza o movimento do carro
// ====================================================
export function updateCar(delta, moveDirection) {
  const carData = car.userData;

  // aceleração e frenagem
  if (moveDirection.forward) carData.speed += carData.accel * delta;
  else if ((carData.speed - carData.drag * delta) >= 0) carData.speed -= carData.drag * delta;

  if (moveDirection.backward) carData.speed -= carData.brake * delta;
  else if ((carData.speed + carData.drag * delta) <= 0) carData.speed += carData.drag * delta;

  // limita a velocidade
  carData.speed = THREE.MathUtils.clamp(carData.speed, carData.maxReverseSpeed, carData.maxSpeed);

  // rotação
  if (moveDirection.left) car.rotation.y += carData.turnSpeed * delta;
  else if (moveDirection.right) car.rotation.y -= carData.turnSpeed * delta;

  // movimento
  car.translateX(carData.speed * delta);
}

// ====================================================
// Função: Reposiciona o carro
// ====================================================
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

  currentLap.value = 0;
  passedFinishLine.value = false;
  gameFinished.value = false;
}
