// Car.js
import * as THREE from 'three';
import { setDefaultMaterial, degreesToRadians } from "../libs/util/util.js";

export const START_POS_TRACK1 = new THREE.Vector3(-40, 0.5, -90);
export const START_ROT_TRACK1 = degreesToRadians(0);

export const START_POS_TRACK2 = new THREE.Vector3(-40, 0.5, -90);
export const START_ROT_TRACK2 = degreesToRadians(0);

export function createCar(scene) {
  const hovercraft = new THREE.Group();

  const base = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.25, 16, 32), setDefaultMaterial('rgb(255,100,100)'));
  base.rotation.x = Math.PI / 2;
  hovercraft.add(base);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16), setDefaultMaterial('rgb(255,0,0)'));
  body.position.y = 0.55;
  hovercraft.add(body);

  const cabine = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.7), setDefaultMaterial('rgb(255,255,255)'));
  cabine.position.set(0, 1.0, 0);
  hovercraft.add(cabine);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.0, 16), setDefaultMaterial('rgb(255,0,0)'));
  nose.rotation.z = Math.PI / 2;
  nose.position.set(1.7, 0.35, 0);
  hovercraft.add(nose);

  hovercraft.position.set(-100.0, 0.5, -100.0);

  hovercraft.userData = {
    speed: 0,
    accel: 17.0,
    brake: 17.0,
    drag: 15,
    maxSpeed: 30,
    maxReverseSpeed: -30,
    turnSpeed: THREE.MathUtils.degToRad(120)
  };

  scene.add(hovercraft);
  return hovercraft;
}

export function resetCarPosition(car, trackNumber) {
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
}

export function updateCar(car, delta, moveDirection) {
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
