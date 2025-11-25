// Track.js
import * as THREE from 'three';
import { resetCarPosition } from '../T1/Car.js';
import { createWalls } from '../T1/Walls.js';
import { createGroundPlane } from '../T1/Ground.js';
import { setDefaultMaterial, degreesToRadians } from "../libs/util/util.js";

// Material do asfalto
const materialPista = setDefaultMaterial('rgba(138, 138, 138, 1)');

let track1, track2;
let currentTrack = 1;

const START_POS_TRACK1 = new THREE.Vector3(-80, 0.5, -90);
const START_POS_TRACK2 = new THREE.Vector3(-10, 0.5, -90);

// ========================================================
// Função principal: cria as pistas na cena
// ========================================================
export function createTrack(scene, car) {
  track1 = new THREE.Group();
  createSquareTrackElements(track1, materialPista);

  const checkpoint1 = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 40),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  checkpoint1.rotation.x = degreesToRadians(-90);
  checkpoint1.position.set(START_POS_TRACK1.x, 0.05, START_POS_TRACK1.z);
  track1.add(checkpoint1);

  track2 = new THREE.Group();
  createLTrackElements(track2, materialPista);

  const checkpoint2 = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 40),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  checkpoint2.rotation.x = degreesToRadians(-90);
  checkpoint2.position.set(START_POS_TRACK2.x, 0.05, START_POS_TRACK2.z);
  track2.add(checkpoint2);

  scene.add(track1);
  scene.add(track2);

  // visibilidade inicial
  track1.visible = true;
  track2.visible = false;

  // reposiciona o carro
  if (car) resetCarPosition(currentTrack);

  // adiciona elementos adicionais
  //createGroundPlane(scene);
  //createWalls(scene);  

  const ground = createGroundPlane(scene);
  const { barreiras } = createWalls(scene, 1); // 1 = quadrada, 2 = L
  
  return { barreirasTrack1: barreiras, barreirasTrack2: [] };
}

// ========================================================
// Pista quadrada
// ========================================================
function createSquareTrackElements(trackGroup, material) {
  const trackWidth = 20;
  const planeGeometryX = new THREE.PlaneGeometry(200, trackWidth);
  const planeGeometryZ = new THREE.PlaneGeometry(trackWidth, 200);

  const mat4 = new THREE.Matrix4();

  const createPlane = (geom, tx, tz) => {
    const mesh = new THREE.Mesh(geom, material);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.matrix.identity()
      .multiply(mat4.makeTranslation(tx, -0.1, tz))
      .multiply(mat4.makeRotationX(degreesToRadians(-90)));
    trackGroup.add(mesh);
  };

  createPlane(planeGeometryX, 0, 90);
  createPlane(planeGeometryX, 0, -90);
  createPlane(planeGeometryZ, -90, 0);
  createPlane(planeGeometryZ, 90, 0);
}

// ========================================================
// Pista em formato L
// ========================================================
function createLTrackElements(trackGroup, material) {
  const trackWidth = 20;
  const mat4Rotation = new THREE.Matrix4().makeRotationX(degreesToRadians(-90));

  const segmentData = [
    { length: 200, isHorizontal: true, pos: new THREE.Vector3(0, -0.1, -90) },
    { length: 180, isHorizontal: false, pos: new THREE.Vector3(90, -0.1, 10) },
    { length: 100, isHorizontal: true, pos: new THREE.Vector3(30, -0.1, 90) },
    { length: 100, isHorizontal: false, pos: new THREE.Vector3(-10, -0.1, 30) },
    { length: 80, isHorizontal: true, pos: new THREE.Vector3(-60, -0.1, -10) },
    { length: 60, isHorizontal: false, pos: new THREE.Vector3(-90, -0.1, -50) },
  ];

  segmentData.forEach(item => {
    const geometry = item.isHorizontal
      ? new THREE.PlaneGeometry(item.length, trackWidth)
      : new THREE.PlaneGeometry(trackWidth, item.length);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;

    const mat4Translation = new THREE.Matrix4().makeTranslation(
      item.pos.x,
      item.pos.y,
      item.pos.z
    );

    mesh.matrix.identity().multiply(mat4Translation).multiply(mat4Rotation);
    trackGroup.add(mesh);
  });
}