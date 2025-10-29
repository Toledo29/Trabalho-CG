import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        degreesToRadians,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, materialVermelho, materialBranco, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
materialVermelho = setDefaultMaterial(); // create a basic material
materialBranco = setDefaultMaterial('rgb(255, 255, 255)'); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
scene.add(camera); // Add camera to the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

let velMax = 0.4;

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// To use the keyboard
var keyboard = new KeyboardState();

createTrack();
let car = createCar();
render();

// // create the ground plane
// let plane = createGroundPlaneXZ(200, 200);
// plane.position.set(10, 100, 10);
// scene.add(plane);

// Função para criar o carro
function createCar() {
  // Cria a caixa principal do carro
  const boxGeometry = new THREE.BoxGeometry(4, 1, 2);
  let carbox = new THREE.Mesh(boxGeometry, materialVermelho);

  // Cria a frente do carro
  const baseGeometry = new THREE.CylinderGeometry(1, 1, 1, 32, 1, false, 0, Math.PI);
  let carfront = new THREE.Mesh(baseGeometry, materialVermelho);

  carfront.position.set(2.0, 0.0, 0);
  // Cria a cabine do carro
  const cabinGeometry = new THREE.CylinderGeometry(0.5, 0.75, 0.6, 8);
  const cabin = new THREE.Mesh(cabinGeometry, materialVermelho);
  cabin.position.set(1, 0.6, 0);

  //Monta o carro e adiciona ele na cena 
  scene.add(carbox);
  carbox.add(cabin);
  carbox.add(carfront);
  carbox.position.set(-100.0, 0.5, -100.0);
  return carbox;
}

function createTrack() {
  createTrackGroundPlane();
}

// // Criando um por um bloco de chão da pista
// function createTrackGroundPlane(){
//   let planeGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
//   let minCordPlane = -80;
//   let maxCordPlane = 80;
//   // for(let i=0; i<10; i++){
//   //   
//   //   }
//   //}
//   for(let i=0; i<10 ; i++){

//     let plane = new THREE.Mesh(planeGeometry, materialBranco);
//     let mat4 = new THREE.Matrix4(); // Aux mat4 matrix
//     plane.receiveShadow = true;
//     // Rotate 90 in X and perform a small translation in Y
//     plane.matrixAutoUpdate = false;
//     plane.matrix.identity();    // resetting matrices
//     // Will execute R1 and then T1
//     plane.matrix.multiply(mat4.makeTranslation(-80+(i*20), -0.1, maxCordPlane)); // T1
//     plane.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R1
//     scene.add(plane);
//   }
//   for(let i=0; i<10 ; i++){

//     let plane = new THREE.Mesh(planeGeometry, materialBranco);
//     let mat4 = new THREE.Matrix4(); // Aux mat4 matrix
//     plane.receiveShadow = true;
//     // Rotate 90 in X and perform a small translation in Y
//     plane.matrixAutoUpdate = false;
//     plane.matrix.identity();    // resetting matrices
//     // Will execute R1 and then T1
//     plane.matrix.multiply(mat4.makeTranslation(-80+(i*20), -0.1, minCordPlane)); // T1
//     plane.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R1
//     scene.add(plane);
//   }
//   for(let i=0; i<10 ; i++){

//     let plane = new THREE.Mesh(planeGeometry, materialBranco);
//     let mat4 = new THREE.Matrix4(); // Aux mat4 matrix
//     plane.receiveShadow = true;
//     // Rotate 90 in X and perform a small translation in Y
//     plane.matrixAutoUpdate = false;
//     plane.matrix.identity();    // resetting matrices
//     // Will execute R1 and then T1
//     plane.matrix.multiply(mat4.makeTranslation(minCordPlane, -0.1, -80+(i*20))); // T1
//     plane.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R1
//     scene.add(plane);
//   }
//   for(let i=0; i<10 ; i++){

//     let plane = new THREE.Mesh(planeGeometry, materialBranco);
//     let mat4 = new THREE.Matrix4(); // Aux mat4 matrix
//     plane.receiveShadow = true;
//     // Rotate 90 in X and perform a small translation in Y
//     plane.matrixAutoUpdate = false;
//     plane.matrix.identity();    // resetting matrices
//     // Will execute R1 and then T1
//     plane.matrix.multiply(mat4.makeTranslation(maxCordPlane, -0.1, -80+(i*20))); // T1
//     plane.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R1
//     scene.add(plane);
//   }
// }

// Criando 4 partes da pista

function createTrackGroundPlane(){
  let planeGeometryX = new THREE.PlaneGeometry(200, 20, 10, 10);
  let planeGeometryZ = new THREE.PlaneGeometry(20, 200, 10, 10);
  let plane1 = new THREE.Mesh(planeGeometryX, materialBranco);
  let plane2 = new THREE.Mesh(planeGeometryX, materialBranco);
  let plane3 = new THREE.Mesh(planeGeometryZ, materialBranco);
  let plane4 = new THREE.Mesh(planeGeometryZ, materialBranco);

  let mat4Plane1 = new THREE.Matrix4(); // Aux mat4 matrix
  let mat4Plane2 = new THREE.Matrix4(); // Aux mat4 matrix
  let mat4Plane3 = new THREE.Matrix4(); // Aux mat4 matrix
  let mat4Plane4 = new THREE.Matrix4(); // Aux mat4 matrix

  plane1.receiveShadow = true;
  plane2.receiveShadow = true;
  plane3.receiveShadow = true;
  plane4.receiveShadow = true;

  plane1.matrixAutoUpdate = false;
  plane2.matrixAutoUpdate = false;
  plane3.matrixAutoUpdate = false;
  plane4.matrixAutoUpdate = false;

  plane1.matrix.identity();    // resetting matrices
  plane2.matrix.identity();    // resetting matrices
  plane3.matrix.identity();    // resetting matrices
  plane4.matrix.identity();    // resetting matrices
  // Will execute R1 and then T1

  plane1.matrix.multiply(mat4Plane1.makeTranslation(0, -0.1, 90)); // T1
  plane1.matrix.multiply(mat4Plane1.makeRotationX(degreesToRadians(-90))); // R1
  plane2.matrix.multiply(mat4Plane2.makeTranslation(0, -0.1, -90)); // T1
  plane2.matrix.multiply(mat4Plane2.makeRotationX(degreesToRadians(-90))); // R1
  plane3.matrix.multiply(mat4Plane3.makeTranslation(-90, -0.1, 0));
  plane3.matrix.multiply(mat4Plane3.makeRotationX(degreesToRadians(-90))); // R1
  plane4.matrix.multiply(mat4Plane4.makeTranslation(90, -0.1, 0));
  plane4.matrix.multiply(mat4Plane4.makeRotationX(degreesToRadians(-90))); // R1

  scene.add(plane1);
  scene.add(plane2);
  scene.add(plane3);
  scene.add(plane4);
}

// function createRedBlock() {

//   const trackBlock = new THREE.BoxGeometry(1, 1, 1);
//   const redBlock = new THREE.Mesh(trackBlock, materialVermelho);
//   scene.add(redBlock);
//   return redBlock;
// }

function keyboardUpdate() 
{
   keyboard.update();
   if ( keyboard.pressed("W") )     car.translateX( 0.4 );
   if ( keyboard.pressed("X") )     car.translateX( 0.1 );
   if ( keyboard.pressed("S") )    car.translateX(  -0.1 );

   let angle = THREE.MathUtils.degToRad(1); 
   if ( keyboard.pressed("A") )  car.rotateY(  angle );
   if ( keyboard.pressed("D") )  car.rotateY( -angle );
  //  updatePositionMessage();
}

// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

function render()
{
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}