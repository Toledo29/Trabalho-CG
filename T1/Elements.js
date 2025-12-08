import * as THREE from  'three';

import { CSG } from '../libs/other/CSGMesh.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneXZ} from "../libs/util/util.js";
import { barreirasTrack2, barreirasTrack3 } from './Walls.js';

let material ,material2 ,material3 //Initial variables
// scene = new THREE.Scene();    // Create main scene
// renderer = initRenderer();    // Init a basic renderer
material = setDefaultMaterial('rgba(189, 82, 32, 1)'); // create a basic material
material2 = setDefaultMaterial('rgba(23, 148, 39, 1)');
material3 = setDefaultMaterial('rgba(139, 139, 139, 1)');
// light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
// camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
// scene.add(camera); // Add camera to the scene
// orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// // Listen window size changes
// window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// // Show axes (parameter is size of each axis)
// let axesHelper = new THREE.AxesHelper( 12 );
// scene.add( axesHelper );

// // create the ground plane
// let plane = createGroundPlaneXZ(20, 20)
// scene.add(plane);


// let arvore = criaArvore2();
// let tunel = criaTunel();

// scene.add(tunel);

// // Use this to show information onscreen
// let controls = new InfoBox();
//   controls.add("Basic Scene");
//   controls.addParagraph();
//   controls.add("Use mouse to interact:");
//   controls.add("* Left button to rotate");
//   controls.add("* Right button to translate (pan)");
//   controls.add("* Scroll to zoom in/out.");
//   controls.show();

// render();
// function render()
// {
//   requestAnimationFrame(render);
//   renderer.render(scene, camera) // Render scene
// }

export function criaArvore1()
{
    const Geometry = new THREE.CylinderGeometry(0.1, 0.5, 10, 32);  // tronco principal
    const Geometry2 = new THREE.CylinderGeometry(0.1, 0.2, 2, 32);  // galho
    const Geometry3 = new THREE.DodecahedronGeometry(3, 0);         // copa principal
    const Geometry4 = new THREE.DodecahedronGeometry(1, 0); 

    const cylinder = new THREE.Mesh(Geometry, material);
    const cylinder2 = new THREE.Mesh(Geometry2, material);
    const folha = new THREE.Mesh(Geometry3, material2);
    const folha2 = new THREE.Mesh(Geometry4, material2);

    cylinder2.rotateX(THREE.MathUtils.degToRad(45));
    cylinder2.position.set(0.0, 4.5, 0.8);
    updateObject(cylinder2);
    cylinder.position.set(0.0, 5.0, 0.0);
    updateObject(cylinder);
    folha.position.set(0.0, 8.0, 0.0);
    updateObject(folha);
    folha2.position.set(0.0, 5.5, 2.0);
    updateObject(folha2);


    // === CSG para unir partes do tronco e das folhas separadamente ===
    const troncoCSG = CSG.fromMesh(cylinder).union(CSG.fromMesh(cylinder2));
    const folhasCSG = CSG.fromMesh(folha).union(CSG.fromMesh(folha2));

    // === Converter novamente para Mesh (mantendo materiais distintos) ===
    const troncoMesh = CSG.toMesh(troncoCSG, new THREE.Matrix4(), material);
    const folhasMesh = CSG.toMesh(folhasCSG, new THREE.Matrix4(), material2);

     // === Agrupar tronco + folhas ===
    const arvore = new THREE.Group();
    arvore.add(troncoMesh);
    arvore.add(folhasMesh);

    // === Ajustes finais ===
    arvore.position.set(0, 0, 0);
    arvore.castShadow = true;
    arvore.receiveShadow = true;

    return arvore;
}

export function criaArvore2()
{
    const Geometry = new THREE.CylinderGeometry(0.1, 0.5, 10, 32);  // tronco principal
    const Geometry2 = new THREE.CylinderGeometry(0.1, 0.08, 3, 32);  // galho
    const Geometry3 = new THREE.DodecahedronGeometry(2, 0);         // copa principal

    const cylinder = new THREE.Mesh(Geometry, material);
    const cylinder2 = new THREE.Mesh(Geometry2, material);
    const cylinder3 = new THREE.Mesh(Geometry2, material);
    const cylinder4 = new THREE.Mesh(Geometry, material);
    const folha = new THREE.Mesh(Geometry3, material2);
    const folha2 = new THREE.Mesh(Geometry3, material2);

    cylinder2.rotateX(THREE.MathUtils.degToRad(45));
    cylinder2.position.set(0.0, 11, 1.0);
    updateObject(cylinder2);
    cylinder3.rotateX(THREE.MathUtils.degToRad(315));
    cylinder3.position.set(0.0, 11, -1.0);
    updateObject(cylinder3);
    cylinder4.rotateY(THREE.MathUtils.degToRad(20));
    cylinder4.position.set(0.0, 5, 0.0);
    updateObject(cylinder4);
    cylinder.position.set(0.0, 5.0, 0.0);
    updateObject(cylinder);
    folha.position.set(0.0, 12.0, -2.0);
    updateObject(folha);
    folha2.position.set(0.0, 12.0, 2.0);
    updateObject(folha2);


    // === CSG para unir partes do tronco e das folhas separadamente ===
    const troncoCSGaux = CSG.fromMesh(cylinder2).union(CSG.fromMesh(cylinder3));
    const troncoCSG = CSG.fromMesh(cylinder).union(CSG.fromMesh(cylinder4),CSG.fromMesh(cylinder3));
    const folhasCSG = CSG.fromMesh(folha).union(CSG.fromMesh(folha2));

    // === Converter novamente para Mesh (mantendo materiais distintos) ===
    const troncoMeshaux = CSG.toMesh(troncoCSGaux, new THREE.Matrix4(), material);
    const troncoMesh = CSG.toMesh(troncoCSG, new THREE.Matrix4(), material);
    const folhasMesh = CSG.toMesh(folhasCSG, new THREE.Matrix4(), material2);

     // === Agrupar tronco + folhas ===
    const arvore = new THREE.Group();
    arvore.add(troncoMeshaux);
    arvore.add(troncoMesh);
    arvore.add(folhasMesh);

    // === Ajustes finais ===
    arvore.position.set(0, 0, 0);
    arvore.castShadow = true;
    arvore.receiveShadow = true;

    return arvore;
}

export function criaTunel()
{
    const Geometry = new THREE.CylinderGeometry(5, 5, 50, 32); 
    const Geometry2 = new THREE.CylinderGeometry(4.5, 4.5, 50, 32);
    const Geometry3 = new THREE. TorusKnotGeometry(17, 2.5, 100, 16);

    const cylinder = new THREE.Mesh(Geometry, material3);
    const cylinder2 = new THREE.Mesh(Geometry2 , material3);
    const furos1 = new THREE.Mesh(Geometry3 , material3);
    const furos2 = new THREE.Mesh(Geometry3 , material3);
    const furos3 = new THREE.Mesh(Geometry3 , material3);

    cylinder.rotateX(THREE.MathUtils.degToRad(90));
    cylinder.position.set(0.0, 5, 0.0);
    updateObject(cylinder);
    cylinder2.rotateX(THREE.MathUtils.degToRad(90));
    cylinder2.position.set(0.0, 5, 0.0);
    updateObject(cylinder2);
    furos1.rotateY(THREE.MathUtils.degToRad(45));
    furos1.rotateX(THREE.MathUtils.degToRad(25));
    furos1.position.set(0.0, 2.0, 15.0);
    updateObject(furos1);
    furos2.rotateY(THREE.MathUtils.degToRad(75));
    furos2.rotateX(THREE.MathUtils.degToRad(215));
    furos2.position.set(0.0, 2.0, -10.0);
    updateObject(furos2);
    furos3.rotateY(THREE.MathUtils.degToRad(75));
    furos3.rotateX(THREE.MathUtils.degToRad(215));
    furos3.position.set(0.0, 2.0, 0.0);
    updateObject(furos3);

    
    let tunelCSG = CSG.fromMesh(cylinder);
    tunelCSG = tunelCSG.subtract(CSG.fromMesh(cylinder2));
    tunelCSG = tunelCSG.subtract(CSG.fromMesh(furos1));
    tunelCSG = tunelCSG.subtract(CSG.fromMesh(furos2));
    tunelCSG = tunelCSG.subtract(CSG.fromMesh(furos3));


    const tunelMesh = CSG.toMesh(tunelCSG, new THREE.Matrix4(), material3);

    
    // === Ajustes finais ===
    tunelMesh.position.set(0, 0, 0);
    tunelMesh.castShadow = true;
    tunelMesh.receiveShadow = true;

    return tunelMesh;
}

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}

export function criaArvoresQuadrado(scene) {
    const totalArvoresPorLado = 15;
    const offset = 10; // distância lateral da borda da pista
    const pistaMin = -100, pistaMax = 100, pistaZmin = -100, pistaZmax = 100;
    const arvores = [];
    // Lado superior (z = pistaZmax + offset)
    for (let i = 0; i < totalArvoresPorLado; i++) {
        const x = pistaMin + (pistaMax - pistaMin) * i / (totalArvoresPorLado - 1);
        const z = pistaZmax + offset;
        const arvore = (i % 2 === 0) ? criaArvore1() : criaArvore2();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    // Lado inferior (z = pistaZmin - offset)
    for (let i = 0; i < totalArvoresPorLado; i++) {
        const x = pistaMin + (pistaMax - pistaMin) * i / (totalArvoresPorLado - 1);
        const z = pistaZmin - offset;
        const arvore = (i % 2 === 0) ? criaArvore2() : criaArvore1();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    // Lado esquerdo (x = pistaMin - offset)
    for (let i = 1; i < totalArvoresPorLado - 1; i++) { // evita duplicar cantos
        const z = pistaZmin + (pistaZmax - pistaZmin) * i / (totalArvoresPorLado - 1);
        const x = pistaMin - offset;
        const arvore = (i % 2 === 0) ? criaArvore1() : criaArvore2();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    // Lado direito (x = pistaMax + offset)
    for (let i = 1; i < totalArvoresPorLado - 1; i++) {
        const z = pistaZmin + (pistaZmax - pistaZmin) * i / (totalArvoresPorLado - 1);
        const x = pistaMax + offset;
        const arvore = (i % 2 === 0) ? criaArvore2() : criaArvore1();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    arvores.castShadow = true;
    return arvores;
}

export function criaArvoresL(scene) {
    const totalArvoresPorLado = 15;
    const offset = 10; // distância lateral da borda da pista
    const pistaMin = -100, pistaMax = 100, pistaZmin = -100, pistaZmax = 100;
    const arvores = [];
    // Lado inferior (z = pistaZmin - offset)
    for (let i = 0; i < totalArvoresPorLado; i++) {
        const x = pistaMin + (pistaMax - pistaMin) * i / (totalArvoresPorLado - 1);
        const z = pistaZmin - offset;
        const arvore = (i % 2 === 0) ? criaArvore2() : criaArvore1();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    // Lado direito (x = pistaMax + offset)
    for (let i = 1; i < totalArvoresPorLado - 1; i++) {
        const z = pistaZmin + (pistaZmax - pistaZmin) * i / (totalArvoresPorLado - 1);
        const x = pistaMax + offset;
        const arvore = (i % 2 === 0) ? criaArvore2() : criaArvore1();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    arvores.castShadow = true;
    return arvores;
}

export function criaArvoresQuatroQuadrantes(scene) {
  const totalArvoresPorLado = 15;
    const offset = 10; // distância lateral da borda da pista
    const pistaMin = -100, pistaMax = 100, pistaZmin = -100, pistaZmax = 100;
    const arvores = [];
    // Lado superior (z = pistaZmax + offset)
    for (let i = 0; i < (totalArvoresPorLado)/2; i++) {
        const x = 100 + (pistaMin + (pistaMax - pistaMin) * i / (totalArvoresPorLado - 1));
        const z = pistaZmax + offset;
        const arvore = (i % 2 === 0) ? criaArvore1() : criaArvore2();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    // Lado inferior (z = pistaZmin - offset)
    for (let i = 0; i < (totalArvoresPorLado)/2; i++) {
        const x = pistaMin + (pistaMax - pistaMin) * i / (totalArvoresPorLado - 1);
        const z = pistaZmin - offset;
        const arvore = (i % 2 === 0) ? criaArvore2() : criaArvore1();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    // Lado esquerdo (x = pistaMin - offset)
    for (let i = 1; i < (totalArvoresPorLado - 1)/2; i++) { // evita duplicar cantos
        const z = pistaZmin + (pistaZmax - pistaZmin) * i / (totalArvoresPorLado - 1);
        const x = pistaMin - offset;
        const arvore = (i % 2 === 0) ? criaArvore1() : criaArvore2();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    // Lado direito (x = pistaMax + offset)
    for (let i = 1; i < (totalArvoresPorLado - 1)/2; i++) {
        const z = 100 + (pistaZmin + (pistaZmax - pistaZmin) * i / (totalArvoresPorLado - 1));
        const x = pistaMax + offset;
        const arvore = (i % 2 === 0) ? criaArvore2() : criaArvore1();
        arvore.position.set(x, 0, z);
        scene.add(arvore);
        arvores.push(arvore);
    }
    arvores.castShadow = true;
    return arvores;
}