// Track.js
import * as THREE from 'three';
import { degreesToRadians } from "../libs/util/util.js";
import { START_POS_TRACK1, START_POS_TRACK2 } from './Car.js';

export let track1 = null;
export let track2 = null;

export function createTrack(scene, materialPista) {
  track1 = new THREE.Group();
  createSquareTrackElements(track1, materialPista);
  const checkpoint1 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint1.rotation.x = degreesToRadians(-90);
  checkpoint1.position.set(START_POS_TRACK1.x, 0.05, START_POS_TRACK1.z);
  track1.add(checkpoint1);

  const checkpoint2 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint2.rotation.x = degreesToRadians(-90);
  checkpoint2.position.set(90, 0.05, START_POS_TRACK1.z);
  track1.add(checkpoint2);

  const checkpoint3 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint3.rotation.x = degreesToRadians(-90);
  checkpoint3.position.set(90, 0.05, 90);
  track1.add(checkpoint3);

  const checkpoint4 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint4.rotation.x = degreesToRadians(-90);
  checkpoint4.position.set(-90, 0.05, 90);
  track1.add(checkpoint4);

  track2 = new THREE.Group();
  createLTrackElements(track2, materialPista);
  const checkpoint5 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint5.rotation.x = degreesToRadians(-90);
  checkpoint5.position.set(START_POS_TRACK2.x, 0.05, START_POS_TRACK2.z);
  track2.add(checkpoint5);
  
  const checkpoint6 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint6.rotation.x = degreesToRadians(-90);
  checkpoint6.position.set(90, 0.05, START_POS_TRACK2.z);
  track2.add(checkpoint6);

  const checkpoint7 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint7.rotation.x = degreesToRadians(-90);
  checkpoint7.position.set(90, 0.05, 90);
  track2.add(checkpoint7);

  const checkpoint8 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint8.rotation.x = degreesToRadians(-90);
  checkpoint8.position.set(-5, 0.05, 90);
  track2.add(checkpoint8);

  const checkpoint9 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint9.rotation.x = degreesToRadians(-90);
  checkpoint9.position.set(-10, 0.05, 0);
  track2.add(checkpoint9);

  const checkpoint10 = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  checkpoint10.rotation.x = degreesToRadians(-90);
  checkpoint10.position.set(-90, 0.05, -10);
  track2.add(checkpoint10);


  track1.userData.checkpoint = checkpoint1;
  track2.userData.checkpoint = checkpoint5;

  scene.add(track1);
  scene.add(track2);

  track1.visible = true;
  track2.visible = false;
}

export function createSquareTrackElements(trackGroup, material) {
  const trackWidth = 20;
  let planeGeometryX = new THREE.PlaneGeometry(200, trackWidth, 10, 10);
  let planeGeometryZ = new THREE.PlaneGeometry(trackWidth, 200, 10, 10);
  let plane1 = new THREE.Mesh(planeGeometryX, material);
  let plane2 = new THREE.Mesh(planeGeometryX, material);
  let plane3 = new THREE.Mesh(planeGeometryZ, material);
  let plane4 = new THREE.Mesh(planeGeometryZ, material);
  plane1.receiveShadow = plane2.receiveShadow = plane3.receiveShadow = plane4.receiveShadow = true;
  plane1.matrixAutoUpdate = plane2.matrixAutoUpdate = plane3.matrixAutoUpdate = plane4.matrixAutoUpdate = false;
  let mat4 = new THREE.Matrix4();
  plane1.matrix.identity().multiply(mat4.makeTranslation(0, -0.1, 90)).multiply(mat4.makeRotationX(degreesToRadians(-90)));
  plane2.matrix.identity().multiply(mat4.makeTranslation(0, -0.1, -90)).multiply(mat4.makeRotationX(degreesToRadians(-90)));
  plane3.matrix.identity().multiply(mat4.makeTranslation(-90, -0.1, 0)).multiply(mat4.makeRotationX(degreesToRadians(-90)));
  plane4.matrix.identity().multiply(mat4.makeTranslation(90, -0.1, 0)).multiply(mat4.makeRotationX(degreesToRadians(-90)));
  trackGroup.add(plane1); trackGroup.add(plane2); trackGroup.add(plane3); trackGroup.add(plane4);
}

export function createLTrackElements(trackGroup, material) {
  const trackWidth = 20;
  const segmentData = [
    { length: 200, isHorizontal: true, pos: new THREE.Vector3(0, -0.1, -90) },
    { length: 180, isHorizontal: false, pos: new THREE.Vector3(90, -0.1, 10) },
    { length: 100, isHorizontal: true, pos: new THREE.Vector3(30, -0.1, 90) },
    { length: 100, isHorizontal: false, pos: new THREE.Vector3(-10, -0.1, 30) },
    { length: 80, isHorizontal: true, pos: new THREE.Vector3(-60, -0.1, -10) },
    { length: 60, isHorizontal: false, pos: new THREE.Vector3(-90, -0.1, -50) },
  ];
  let mat4Rotation = new THREE.Matrix4().makeRotationX(degreesToRadians(-90));
  segmentData.forEach(item => {
    let geometry = item.isHorizontal ? new THREE.PlaneGeometry(item.length, trackWidth, 10, 10) : new THREE.PlaneGeometry(trackWidth, item.length, 10, 10);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.matrix.identity();
    let mat4Translation = new THREE.Matrix4().makeTranslation(item.pos.x, item.pos.y, item.pos.z);
    mesh.matrix.multiply(mat4Translation);
    mesh.matrix.multiply(mat4Rotation);
    trackGroup.add(mesh);
  });
}
