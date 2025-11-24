import * as THREE from 'three';
import { setDefaultMaterial } from '../libs/util/util.js';

let muretasTrack1, muretasTrack2; // Grupos de muretas para cada pista

/*export function createWalls(scene) {
    const Material = new THREE.MeshBasicMaterial('rgba(208, 255, 0, 1)');

    let caixa = new THREE.BoxGeometry(5, 5, 5);

    let cube = new THREE.Mesh(caixa, Material);

    cube.position.set(0.0, 0.0, 0.0);
    
    scene.add(cube);
    
}*/

export function createWalls(scene, trackType = 1) {
  const wallMaterial = setDefaultMaterial('rgb(255, 255, 0)');
  const wallSize = 5; // tamanho de cada bloco cúbico da mureta
  const wallHeight = 5;

  const cubeGeometry = new THREE.BoxGeometry(wallSize, wallHeight, wallSize);
  const barreiras = [];

  let buildComplete = false;

  while (!buildComplete) {
    if (trackType === 1) {
      // === PISTA QUADRADA ===
      // Cria blocos ao redor de um quadrado 200x200 (mesma escala da pista)
      const range = 100;
      const step = wallSize;

      // --- paredes horizontais (Z fixo) ---
      for (let x = -range; x <= range; x += step) {
        const top = new THREE.Mesh(cubeGeometry, wallMaterial);
        top.position.set(x, wallHeight / 2, range + step / 2);
        scene.add(top);
        barreiras.push({ mesh: top, bb: new THREE.Box3().setFromObject(top) });

        const bottom = new THREE.Mesh(cubeGeometry, wallMaterial);
        bottom.position.set(x, wallHeight / 2, -range - step / 2);
        scene.add(bottom);
        barreiras.push({ mesh: bottom, bb: new THREE.Box3().setFromObject(bottom) });
      }

      // --- paredes verticais (X fixo) ---
      for (let z = -range; z <= range; z += step) {
        const left = new THREE.Mesh(cubeGeometry, wallMaterial);
        left.position.set(-range - step / 2, wallHeight / 2, z);
        scene.add(left);
        barreiras.push({ mesh: left, bb: new THREE.Box3().setFromObject(left) });

        const right = new THREE.Mesh(cubeGeometry, wallMaterial);
        right.position.set(range + step / 2, wallHeight / 2, z);
        scene.add(right);
        barreiras.push({ mesh: right, bb: new THREE.Box3().setFromObject(right) });
      }

      buildComplete = true;
    }

    else if (trackType === 2) {
      // === PISTA EM L ===
      const step = wallSize;
      const wallY = wallHeight / 2;

      // segmento horizontal inferior
      for (let x = -100; x <= 100; x += step) {
        const cube = new THREE.Mesh(cubeGeometry, wallMaterial);
        cube.position.set(x, wallY, -100);
        scene.add(cube);
        barreiras.push({ mesh: cube, bb: new THREE.Box3().setFromObject(cube) });
      }

      // segmento vertical direito
      for (let z = -100; z <= 100; z += step) {
        const cube = new THREE.Mesh(cubeGeometry, wallMaterial);
        cube.position.set(100, wallY, z);
        scene.add(cube);
        barreiras.push({ mesh: cube, bb: new THREE.Box3().setFromObject(cube) });
      }

      // segmento superior esquerdo (L)
      for (let x = -100; x <= 0; x += step) {
        const cube = new THREE.Mesh(cubeGeometry, wallMaterial);
        cube.position.set(x, wallY, 100);
        scene.add(cube);
        barreiras.push({ mesh: cube, bb: new THREE.Box3().setFromObject(cube) });
      }

      // segmento vertical esquerdo
      for (let z = -20; z <= 100; z += step) {
        const cube = new THREE.Mesh(cubeGeometry, wallMaterial);
        cube.position.set(-100, wallY, z);
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