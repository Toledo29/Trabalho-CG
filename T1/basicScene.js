import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        // initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        SecondaryBox,
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

let track1, track2; 
let currentTrack = 1;

// Definição das posições iniciais (Ajuste estes valores para o seu bloco laranja)
const START_POS_TRACK1 = new THREE.Vector3(-80, 0.5, -90); // Exemplo Pista Quadrada
const START_ROT_TRACK1 = degreesToRadians(0); // Virado para 'frente'

const START_POS_TRACK2 = new THREE.Vector3(-10, 0.5, -90); // Exemplo Pista em 'L'
const START_ROT_TRACK2 = degreesToRadians(0); // Virado para 'frente'

// ... (continue o resto do seu código)

let car = createCar();
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(car.position.x - 15, car.position.y + 4, car.position.z);
camera.up.set(0, 1, 0);
camera.lookAt(car.position);
scene.add(camera);
const speedBox = new SecondaryBox("");
speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));


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


let controls = new InfoBox();
controls.infoBox.style.bottom = "";
controls.infoBox.style.top = "0";
controls.add("Car Race");
controls.addParagraph();
controls.add("* Seta para a Esquerda/Direita para girar o carro.");
controls.add("* Seta para Cima/X para acelerar o carro.");
controls.add("* Seta para Baixo para frear o carro.");
controls.show();


// Create the track and the car

createTrack();
render();

// create the ground plane
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
  // Cria o grupo para a Pista 1 (Quadrada)
  track1 = new THREE.Group();
  createSquareTrackElements(track1, materialBranco);
  scene.add(track1);

  // Cria o grupo para a Pista 2 (Em "L")
  track2 = new THREE.Group();
  createLTrackElements(track2, materialBranco);
  scene.add(track2);

  // Inicia com a Pista 1 visível e a Pista 2 invisível
  track1.visible = true;
  track2.visible = false;
  
  // Posiciona o carro na pista inicial
  resetCarPosition(1);
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

function createSquareTrackElements(trackGroup, material) {
  
  const trackWidth = 20; // Ajuste baseado no tamanho do seu carro
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
  
  // Topo e Fundo (Horizontal)
  plane1.matrix.identity().multiply(mat4.makeTranslation(0, -0.1, 90)).multiply(mat4.makeRotationX(degreesToRadians(-90))); 
  plane2.matrix.identity().multiply(mat4.makeTranslation(0, -0.1, -90)).multiply(mat4.makeRotationX(degreesToRadians(-90))); 
  
  // Esquerda e Direita (Vertical)
  plane3.matrix.identity().multiply(mat4.makeTranslation(-90, -0.1, 0)).multiply(mat4.makeRotationX(degreesToRadians(-90)));
  plane4.matrix.identity().multiply(mat4.makeTranslation(90, -0.1, 0)).multiply(mat4.makeRotationX(degreesToRadians(-90)));

  trackGroup.add(plane1);
  trackGroup.add(plane2);
  trackGroup.add(plane3);
  trackGroup.add(plane4);
}


// --- PISTA 2: EM "L" (AJUSTADA CONFORME SUA DESCRIÇÃO) ---
function createLTrackElements(trackGroup, material) {
  const trackWidth = 20; // Largura da pista
  
  // Segmentos e suas dimensões/posições centrais
  const segmentData = [
    // 1. Reta de Baixo (Completa: 200) - De X=-100 a 100
    { length: 200, isHorizontal: true, pos: new THREE.Vector3(0, -0.1, -90) },
    
    // 2. Reta da Direita (Completa: 200) - De Z=-100 a 100
    { length: 180, isHorizontal: false, pos: new THREE.Vector3(90, -0.1, 10) },
    
    // 3. Reta Superior, Parte 1 (60% de 200 = 120) - De X=90 a X=-30. Centro em X=30
    // O carro vira à direita na parte de cima, vindo de X=90.
    { length: 100, isHorizontal: true, pos: new THREE.Vector3(30, -0.1, 90) },
    
    // 4. Reta Descendo (60% de 200 = 120) - De Z=90 a Z=-30. Centro em Z=30. X=-30.
    { length: 100, isHorizontal: false, pos: new THREE.Vector3(-10, -0.1, 30) },

    // 5. Reta Interna Esquerda (50% do restante de X = 50% de 80 = 40) - De X=-30 a X=-70. Centro em X=-50. Z=-30.
    { length: 80, isHorizontal: true, pos: new THREE.Vector3(-60, -0.1, -10) },
    
    
    // 6. Reta de Conexão (50% do restante de X = 50% de 80 = 40) - De X=-70 a X=-100. Centro em X=-85. Z=-70.
    { length: 60, isHorizontal: false, pos: new THREE.Vector3(-90, -0.1, -50) },

    

  ];

  let mat4Rotation = new THREE.Matrix4().makeRotationX(degreesToRadians(-90));

  segmentData.forEach(item => {
    let geometry;
    // Cria a geometria (Comprimento, Largura) ou (Largura, Comprimento)
    if (item.isHorizontal) {
      geometry = new THREE.PlaneGeometry(item.length, trackWidth, 10, 10);
    } else {
      geometry = new THREE.PlaneGeometry(trackWidth, item.length, 10, 10);
    }
    
    let mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.matrix.identity();
    
    // Aplica Translação e depois Rotação
    let mat4Translation = new THREE.Matrix4().makeTranslation(item.pos.x, item.pos.y, item.pos.z);
    mesh.matrix.multiply(mat4Translation); 
    mesh.matrix.multiply(mat4Rotation);

    trackGroup.add(mesh);
  });
}

// --- FUNÇÃO PARA REPOSICIONAR O CARRO ---
function resetCarPosition(trackNumber) {
    let newPos, newRot;

    if (trackNumber === 1) {
        newPos = START_POS_TRACK1;
        newRot = START_ROT_TRACK1;
    } else { // trackNumber === 2
        newPos = START_POS_TRACK2;
        newRot = START_ROT_TRACK2;
    }

    // Reposiciona o veículo no bloco inicial [cite: 13]
    car.position.copy(newPos);
    // Vira o veículo para a direção indicada com uma seta [cite: 13]
    car.rotation.y = newRot;
    
    // O veículo será posicionado  e sua velocidade deve ser zerada
    car.userData.speed = 0;
}


// --- MODIFICAÇÃO DE keyboardUpdate ---
function keyboardUpdate() 
{
  keyboard.update();

  
//mapeamento dos movimentos
   moveDirection.forward = keyboard.pressed("up") || keyboard.pressed("X");
   moveDirection.backward = keyboard.pressed("down");
   moveDirection.left = keyboard.pressed("left");
   moveDirection.right = keyboard.pressed("right");

  // Lógica de Troca de Pistas
  if (keyboard.down("1") && currentTrack !== 1) {
      currentTrack = 1;
      track1.visible = true;
      track2.visible = false;
      resetCarPosition(1);
  } 
  else if (keyboard.down("2") && currentTrack !== 2) {
      currentTrack = 2;
      track1.visible = false;
      track2.visible = true;
      resetCarPosition(2);
  }
}
// function createRedBlock() {

//   const trackBlock = new THREE.BoxGeometry(1, 1, 1);
//   const redBlock = new THREE.Mesh(trackBlock, materialVermelho);
//   scene.add(redBlock);
//   return redBlock;
// }



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

function updateCameraFollow() {
  // Offset no espaço local do carro: atrás (negativo em X), acima (Y)
  const localOffset = new THREE.Vector3(-15, 4, 0); // ajuste conforme necessário

  // Converte para coordenadas do mundo
  const worldPos = localOffset.clone();
  car.localToWorld(worldPos);

  // Interpola a posição da câmera para suavizar o movimento
  const smoothFactor = 0.03;
  const smoothFactorBackward = 0.1;
  if(moveDirection.backward){
    camera.position.lerp(worldPos, smoothFactorBackward);
  }
  else{
    camera.position.lerp(worldPos, smoothFactor);
  }
  // Fazer a câmera olhar para o carro
  camera.lookAt(car.position);
}


function render()
{
  keyboardUpdate();

  const delta = clock.getDelta();
  updateCar(delta);

  updateCameraFollow();

  speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}