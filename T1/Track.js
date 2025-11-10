import * as THREE from 'three';
import { resetCarPosition } from '../T1/Car.js';
import { createWalls } from '../T1/Walls.js';
import { createGroundPlane } from '../T1/Ground.js'
import { scene,car } from '../T1/Scene.js'
import { setDefaultMaterial,degreesToRadians} from "../libs/util/util.js";

// Material para piso da pista (cinza claro)
const materialPista = setDefaultMaterial('rgba(138, 138, 138, 1)');

let track1, track2; 
let currentTrack = 1;

// ------------------------------------------------------
// Posições iniciais das pistas
// ------------------------------------------------------
const START_POS_TRACK1 = new THREE.Vector3(-80, 0.5, -90); 

const START_POS_TRACK2 = new THREE.Vector3(-10, 0.5, -90); 

export function createTrack() {
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

    track1.visible = true;
    track2.visible = false;
    
    resetCarPosition(currentTrack,car);

    track1.userData.checkpoint = checkpoint1;
    track2.userData.checkpoint = checkpoint2;

  createGroundPlane(); // plano principal/chão
  createWalls(); // barreiras invisíveis
  // createVisibleWalls(); // muretas visíveis - REMOVIDO
  }

function createSquareTrackElements(trackGroup, material) {
    const trackWidth = 20; 
    let planeGeometryX = new THREE.PlaneGeometry(200, trackWidth, 10, 10);
    let planeGeometryZ = new THREE.PlaneGeometry(trackWidth, 200, 10, 10);
    
    let plane1 = new THREE.Mesh(planeGeometryX, material);
    let plane2 = new THREE.Mesh(planeGeometryX, material);
    let plane3 = new THREE.Mesh(planeGeometryZ, material);
    let plane4 = new THREE.Mesh(planeGeometryZ, material);

    plane1.receiveShadow = true;
    plane2.receiveShadow = true;
    plane3.receiveShadow = true;
    plane4.receiveShadow = true;

    plane1.matrixAutoUpdate = false;
    plane2.matrixAutoUpdate = false;
    plane3.matrixAutoUpdate = false;
    plane4.matrixAutoUpdate = false;

    let mat4 = new THREE.Matrix4();
    
    plane1.matrix.identity().multiply(mat4.makeTranslation(0, -0.1, 90)).multiply(mat4.makeRotationX(degreesToRadians(-90))); 
    plane2.matrix.identity().multiply(mat4.makeTranslation(0, -0.1, -90)).multiply(mat4.makeRotationX(degreesToRadians(-90))); 
    plane3.matrix.identity().multiply(mat4.makeTranslation(-90, -0.1, 0)).multiply(mat4.makeRotationX(degreesToRadians(-90)));
    plane4.matrix.identity().multiply(mat4.makeTranslation(90, -0.1, 0)).multiply(mat4.makeRotationX(degreesToRadians(-90)));

    trackGroup.add(plane1);
    trackGroup.add(plane2);
    trackGroup.add(plane3);
    trackGroup.add(plane4);
}

function createLTrackElements(trackGroup, material) {
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
    let geometry = item.isHorizontal
        ? new THREE.PlaneGeometry(item.length, trackWidth, 10, 10)
        : new THREE.PlaneGeometry(trackWidth, item.length, 10, 10);
    
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