import * as THREE from 'three';
import {initRenderer, 
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  SecondaryBox,
  onWindowResize,
  degreesToRadians} from "../libs/util/util.js";
// Material para plano principal/chão (verde grama)
const materialChao = setDefaultMaterial('rgb(34, 139, 34)');

// ------------------------------------------------------
// Função para criar o plano principal (chão)
// ------------------------------------------------------
export function createGroundPlane(scene) {
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const ground = new THREE.Mesh(groundGeometry, materialChao);
    ground.rotation.x = degreesToRadians(-90);
    ground.position.y = -0.2;
    ground.receiveShadow = true;

    if(scene) scene.add(ground);

    return ground;
}