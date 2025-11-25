import * as THREE from 'three';
import { setDefaultMaterial } from '../libs/util/util.js';


export function createWalls(scene, trackType = 1) {
  const wallMaterial = setDefaultMaterial('rgb(255, 255, 0)');
  const wallSize = 5; // tamanho de cada bloco cúbico da mureta
  const wallHeight = 5;

  const cubeGeometry = new THREE.BoxGeometry(wallSize, wallHeight, wallSize);
  const barreiras = [];

  let buildComplete = false;
  let colorSwitch = true; // alterna entre branco e preto

  while (!buildComplete) {
    if (trackType === 1) {
      // === PISTA QUADRADA ===
      // Cria blocos ao redor de um quadrado 200x200 (mesma escala da pista)
      const range = 100;
      const step = wallSize;
      const wallY = wallHeight / 2;

     // --- paredes horizontais (superior e inferior) ---
      for (let x = -range; x <= range; x += step) {
        const color = colorSwitch ? 'white' : 'black';
        const material = setDefaultMaterial(color);
        colorSwitch = !colorSwitch;

        const top = new THREE.Mesh(cubeGeometry, material);
        top.position.set(x, wallY, range + step / 2);
        scene.add(top);
        barreiras.push({ mesh: top, bb: new THREE.Box3().setFromObject(top) });

        const bottom = new THREE.Mesh(cubeGeometry, material);
        bottom.position.set(x, wallY, -range - step / 2);
        scene.add(bottom);
        barreiras.push({ mesh: bottom, bb: new THREE.Box3().setFromObject(bottom) });
      }

      // --- paredes verticais (direita e esquerda) ---
      for (let z = -range; z <= range; z += step) {
        const color = colorSwitch ? 'white' : 'black';
        const material = setDefaultMaterial(color);
        colorSwitch = !colorSwitch;

        const left = new THREE.Mesh(cubeGeometry, material);
        left.position.set(-range - step / 2, wallY, z);
        scene.add(left);
        barreiras.push({ mesh: left, bb: new THREE.Box3().setFromObject(left) });

        const right = new THREE.Mesh(cubeGeometry, material);
        right.position.set(range + step / 2, wallY, z);
        scene.add(right);
        barreiras.push({ mesh: right, bb: new THREE.Box3().setFromObject(right) });
      }

      buildComplete = true;
    }

    else if (trackType === 2) {
      // === PISTA EM L ===
      const step = wallSize;
      const wallY = wallHeight / 2;
      const range = 100;

       // Parte inferior (horizontal)
      for (let x = -range; x <= range; x += step) {
        const color = colorSwitch ? 'white' : 'black';
        const material = setDefaultMaterial(color);
        colorSwitch = !colorSwitch;

        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(x, wallY, -range - step / 2);
        scene.add(cube);
        barreiras.push({ mesh: cube, bb: new THREE.Box3().setFromObject(cube) });
      }

      // Lateral direita (vertical)
      for (let z = -range; z <= range; z += step) {
        const color = colorSwitch ? 'white' : 'black';
        const material = setDefaultMaterial(color);
        colorSwitch = !colorSwitch;

        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(range + step / 2, wallY, z);
        scene.add(cube);
        barreiras.push({ mesh: cube, bb: new THREE.Box3().setFromObject(cube) });
      }

     // Parte superior (horizontal, esquerda)
      for (let x = -range; x <= 0; x += step) {
        const color = colorSwitch ? 'white' : 'black';
        const material = setDefaultMaterial(color);
        colorSwitch = !colorSwitch;

        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(x, wallY, range + step / 2);
        scene.add(cube);
        barreiras.push({ mesh: cube, bb: new THREE.Box3().setFromObject(cube) });
      }

      // Lateral esquerda (vertical)
      for (let z = -20; z <= range; z += step) {
        const color = colorSwitch ? 'white' : 'black';
        const material = setDefaultMaterial(color);
        colorSwitch = !colorSwitch;

        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(-range - step / 2, wallY, z);
        scene.add(cube);
        barreiras.push({ mesh: cube, bb: new THREE.Box3().setFromObject(cube) });
      }

      buildComplete = true;
    }

    // Caso trackType inválido
    else {
      console.warn("⚠️ Tipo de pista inválido em createWalls(). Use 1 (quadrada) ou 2 (L).");
      buildComplete = true;
    }
  }

  return { barreiras };
}