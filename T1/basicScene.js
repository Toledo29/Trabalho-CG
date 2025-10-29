import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        // initCamera,
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
// camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
// scene.add(camera); // Add camera to the scene

let car = createCar();
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(car.position.x - 15, car.position.y + 6, car.position.z);
camera.up.set(0, 1, 0);
camera.lookAt(car.position);
scene.add(camera);
// orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// To use the keyboard
var keyboard = new KeyboardState();
// Clock for the keyboard pressing time
const clock = new THREE.Clock();

// Direções de movimento do carro
const moveDirection = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

car.userData = {
    speed: 0,                 // velocidade atual
    accel: 17.0,               // aceleração ao pressionar
    brake: 17.0,              // desaceleração ao frear
    drag: 15,                // desaceleração natural
    maxSpeed: 30,            // velocidade máxima
    maxReverseSpeed: -30,         // velocidade reversa máxima
    turnSpeed: THREE.MathUtils.degToRad(120) // velocidade de giro máxima
};

// Create the track and the car

createTrack();
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
  //mapeamento dos movimentos
   moveDirection.forward = keyboard.pressed("W") || keyboard.pressed("X");
   moveDirection.backward = keyboard.pressed("S");
   moveDirection.left = keyboard.pressed("A");
   moveDirection.right = keyboard.pressed("D");
}

function updateCar(delta) {
  const carData = car.userData;

  // Aceleração
  if (moveDirection.forward) {
    carData.speed += carData.accel * delta;
  }
  //desaceleração natural
  else {
    if ((carData.speed - carData.drag * delta) >= 0) {
      carData.speed -= carData.drag * delta;
    }
  }
  // Ré
  if (moveDirection.backward) {
    carData.speed -= carData.brake * delta;
  }
  // desaceleração natural ao ir para trás
  else{
    if ((carData.speed + carData.drag * delta) <= 0) {
      carData.speed += carData.drag * delta;
    }
  }

  // Limitar a velocidade
  carData.speed = THREE.MathUtils.clamp(carData.speed, carData.maxReverseSpeed, carData.maxSpeed);

  // Giro do carro
  if (moveDirection.left) {
    car.rotation.y += carData.turnSpeed * delta;
  } else if (moveDirection.right) {
    car.rotation.y -= carData.turnSpeed * delta;
  }

  // Atualizar a posição do carro
  car.translateX( carData.speed * delta );
}

function updateCameraFollow(delta) {
  // Offset no espaço local do carro: atrás (negativo em X), acima (Y)
  const localOffset = new THREE.Vector3(-15, 6, 0); // ajuste conforme necessário

  // Converte para coordenadas do mundo
  const worldPos = localOffset.clone();
  car.localToWorld(worldPos);

  // Interpola a posição da câmera para suavizar o movimento
  const smoothFactor = 0.03;
  camera.position.lerp(worldPos, smoothFactor);

  // Fazer a câmera olhar para o carro
  camera.lookAt(car.position);
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

  const delta = clock.getDelta();
  updateCar(delta);

  updateCameraFollow(delta);

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}