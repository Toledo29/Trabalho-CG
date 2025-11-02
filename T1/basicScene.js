import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        SecondaryBox,
        onWindowResize,
        degreesToRadians} from "../libs/util/util.js";

// ------------------------------------------------------
// Declaração de variáveis principais
// ------------------------------------------------------
let scene, renderer, camera, materialVermelho, materialBranco, light, orbit; 
scene = new THREE.Scene();    
renderer = initRenderer();    
materialVermelho = setDefaultMaterial(); 
materialBranco = setDefaultMaterial('rgb(255, 255, 255)'); 
light = initDefaultBasicLight(scene); 

let track1, track2; 
let currentTrack = 1;

// ------------------------------------------------------
// Posições iniciais das pistas
// ------------------------------------------------------
const START_POS_TRACK1 = new THREE.Vector3(-80, 0.5, -90); 
const START_ROT_TRACK1 = degreesToRadians(0); 

const START_POS_TRACK2 = new THREE.Vector3(-10, 0.5, -90); 
const START_ROT_TRACK2 = degreesToRadians(0); 

// ------------------------------------------------------
// Variáveis de voltas
// ------------------------------------------------------
let currentLap = 0;
const MAX_LAPS = 4;
let passedFinishLine = false;
let gameFinished = false;

// ------------------------------------------------------
// Variáveis de colisão
// ------------------------------------------------------
const barreiras = [];

// ------------------------------------------------------
// Criação do carro
// ------------------------------------------------------
let car = createCar();

// ------------------------------------------------------
// Câmera e interface
// ------------------------------------------------------
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(car.position.x - 15, car.position.y + 4, car.position.z);
camera.up.set(0, 1, 0);
camera.lookAt(car.position);
scene.add(camera);

const speedBox = new SecondaryBox("");
speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

// --- ADIÇÃO --- contador de voltas (com o estilo original no canto inferior direito)
const lapDiv = document.createElement("div");
lapDiv.id = "lap-counter";
lapDiv.style.position = "absolute";
lapDiv.style.right = "20px";
lapDiv.style.bottom = "20px";
lapDiv.style.padding = "6px 10px";
lapDiv.style.background = "rgba(0,0,0,0.6)";
lapDiv.style.color = "white";
lapDiv.style.borderRadius = "6px";
lapDiv.style.zIndex = "9999";
lapDiv.style.fontFamily = "Arial, sans-serif";
lapDiv.style.fontSize = "14px";
lapDiv.style.textAlign = "right";
lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
document.body.appendChild(lapDiv);

// ------------------------------------------------------
// Configuração da cena e controles
// ------------------------------------------------------
window.addEventListener('resize', function(){onWindowResize(camera, renderer)}, false);
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var keyboard = new KeyboardState();
const clock = new THREE.Clock();

const moveDirection = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

car.userData = {
    speed: 0,
    accel: 17.0,
    brake: 17.0,
    drag: 15,
    maxSpeed: 30,
    maxReverseSpeed: -30,
    turnSpeed: THREE.MathUtils.degToRad(120)
};

// ------------------------------------------------------
// Caixa de informações
// ------------------------------------------------------
let controls = new InfoBox();
controls.infoBox.style.bottom = "";
controls.infoBox.style.top = "0";
controls.add("Car Race");
controls.addParagraph();
controls.add("* Seta para a Esquerda/Direita para girar o carro.");
controls.add("* Seta para Cima/X para acelerar o carro.");
controls.add("* Seta para Baixo para frear o carro.");
controls.show();

createTrack();
render();

// ------------------------------------------------------
// Função para criar o carro
// ------------------------------------------------------
function createCar() {
  const boxGeometry = new THREE.BoxGeometry(4, 1, 2);
  let carbox = new THREE.Mesh(boxGeometry, materialVermelho);

  const baseGeometry = new THREE.CylinderGeometry(1, 1, 1, 32, 1, false, 0, Math.PI);
  let carfront = new THREE.Mesh(baseGeometry, materialVermelho);
  carfront.position.set(2.0, 0.0, 0);

  const cabinGeometry = new THREE.CylinderGeometry(0.5, 0.75, 0.6, 8);
  const cabin = new THREE.Mesh(cabinGeometry, materialVermelho);
  cabin.position.set(1, 0.6, 0);

  scene.add(carbox);
  carbox.add(cabin);
  carbox.add(carfront);
  carbox.position.set(-100.0, 0.5, -100.0);
  return carbox;
}

// ------------------------------------------------------
// Função para criar as pistas e checkpoint visível (amarelo)
// ------------------------------------------------------
function createTrack() {
  track1 = new THREE.Group();
  createSquareTrackElements(track1, materialBranco);

  // Checkpoint visível (amarelo)
  const checkpoint1 = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 40),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  checkpoint1.rotation.x = degreesToRadians(-90);
  checkpoint1.position.set(START_POS_TRACK1.x, 0.05, START_POS_TRACK1.z);
  track1.add(checkpoint1);

  track2 = new THREE.Group();
  createLTrackElements(track2, materialBranco);

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
  
  resetCarPosition(1);

  track1.userData.checkpoint = checkpoint1;
  track2.userData.checkpoint = checkpoint2;

  // Cria barreiras invisíveis
  createWalls();
}

// ------------------------------------------------------
// Funções das pistas
// ------------------------------------------------------
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

// ------------------------------------------------------
// Criação das barreiras invisíveis
// ------------------------------------------------------
function createWalls() {
  const invisMaterial = new THREE.MeshBasicMaterial({ visible: false });

  let pilar = new THREE.BoxGeometry(5, 5, 200);
  let pilarmenor = new THREE.BoxGeometry(5, 5, 160);
  let pilar2 = new THREE.BoxGeometry(200, 5, 5);
  let pilar2menor = new THREE.BoxGeometry(160, 5, 5);

  const todas = [
    new THREE.Mesh(pilar, invisMaterial),
    new THREE.Mesh(pilarmenor, invisMaterial),
    new THREE.Mesh(pilar, invisMaterial),
    new THREE.Mesh(pilarmenor, invisMaterial),
    new THREE.Mesh(pilar2, invisMaterial),
    new THREE.Mesh(pilar2menor, invisMaterial),
    new THREE.Mesh(pilar2, invisMaterial),
    new THREE.Mesh(pilar2menor, invisMaterial)
  ];

  todas[0].position.set(-102.5, 2.5, 0.0);
  todas[1].position.set(-77.5, 2.5, 0.0);
  todas[2].position.set(102.5, 2.5, 0.0);
  todas[3].position.set(77.5, 2.5, 0.0);
  todas[4].position.set(0.0, 2.5, 102.5);
  todas[5].position.set(0.0, 2.5, 77.5);
  todas[6].position.set(0.0, 2.5, -102.5);
  todas[7].position.set(0.0, 2.5, -77.5);

  todas.forEach(obj => {
    scene.add(obj);
    const bb = new THREE.Box3().setFromObject(obj);
    barreiras.push({ mesh: obj, bb });
  });
}

// ------------------------------------------------------
// Função para reposicionar o carro
// ------------------------------------------------------
function resetCarPosition(trackNumber) {
    let newPos, newRot;

    if (trackNumber === 1) {
        newPos = START_POS_TRACK1;
        newRot = START_ROT_TRACK1;
    } else { 
        newPos = START_POS_TRACK2;
        newRot = START_ROT_TRACK2;
    }

    car.position.copy(newPos);
    car.rotation.y = newRot;
    car.userData.speed = 0;

    currentLap = 0;
    lapDiv.innerText = "Volta: 0 / " + MAX_LAPS;
    passedFinishLine = false;
    gameFinished = false;
}

// ------------------------------------------------------
// Atualização do teclado e troca de pista
// ------------------------------------------------------
function keyboardUpdate() {
  keyboard.update();

  moveDirection.forward = keyboard.pressed("up") || keyboard.pressed("X");
  moveDirection.backward = keyboard.pressed("down");
  moveDirection.left = keyboard.pressed("left");
  moveDirection.right = keyboard.pressed("right");

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

// ------------------------------------------------------
// Atualização da posição do carro
// ------------------------------------------------------
function updateCar(delta) {
  const carData = car.userData;

  if (moveDirection.forward) carData.speed += carData.accel * delta;
  else if ((carData.speed - carData.drag * delta) >= 0) carData.speed -= carData.drag * delta;

  if (moveDirection.backward) carData.speed -= carData.brake * delta;
  else if ((carData.speed + carData.drag * delta) <= 0) carData.speed += carData.drag * delta;

  carData.speed = THREE.MathUtils.clamp(carData.speed, carData.maxReverseSpeed, carData.maxSpeed);

  if (moveDirection.left) car.rotation.y += carData.turnSpeed * delta;
  else if (moveDirection.right) car.rotation.y -= carData.turnSpeed * delta;

  car.translateX(carData.speed * delta);
}

// ------------------------------------------------------
// Função de colisão
// ------------------------------------------------------
function checkCarCollision() {
  const carBB = new THREE.Box3().setFromObject(car);
  const carDir = new THREE.Vector3(Math.cos(car.rotation.y), 0, -Math.sin(car.rotation.y));

  for (const barreira of barreiras) {
    barreira.bb.setFromObject(barreira.mesh);
    if (carBB.intersectsBox(barreira.bb)) {
      const normal = new THREE.Vector3();
      const size = new THREE.Vector3();
      barreira.bb.getSize(size);

      if (size.z > size.x) normal.set(Math.sign(barreira.mesh.position.x), 0, 0);
      else normal.set(0, 0, Math.sign(barreira.mesh.position.z));

      const angleRad = carDir.angleTo(normal);
      const angleDeg = THREE.MathUtils.radToDeg(angleRad);

      let reductionFactor = 1.0;
      if (angleDeg > 90) {
        reductionFactor = 1 - (angleDeg - 90) / 90;
        reductionFactor = Math.max(0, reductionFactor);
      }

      car.userData.speed *= reductionFactor;
      const pushBack = normal.clone().multiplyScalar(0.2 * (1 - reductionFactor));
      car.position.add(pushBack);

      return true;
    }
  }
  return false;
}

// ------------------------------------------------------
// Função de contagem de voltas
// ------------------------------------------------------
function checkLapCount() {
  if (gameFinished) return;

  const checkpoint = currentTrack === 1 ? track1.userData.checkpoint : track2.userData.checkpoint;
  if (!checkpoint) return;

  const carBox = new THREE.Box3().setFromObject(car);
  const checkpointBox = new THREE.Box3().setFromObject(checkpoint);

  if (carBox.intersectsBox(checkpointBox)) {
    if (!passedFinishLine) passedFinishLine = true;
  } else {
    if (passedFinishLine) {
      passedFinishLine = false;
      currentLap++;
      lapDiv.innerText = "Volta: " + currentLap + " / " + MAX_LAPS;
      if (currentLap >= MAX_LAPS) {
        gameFinished = true;
        lapDiv.innerText = "FIM DE JOGO! 🏁";
      }
    }
  }
}

// ------------------------------------------------------
// Câmera que segue o carro
// ------------------------------------------------------
function updateCameraFollow() {
  const localOffset = new THREE.Vector3(-15, 4, 0);
  const worldPos = localOffset.clone();
  car.localToWorld(worldPos);

  const smoothFactor = 0.03;
  const smoothFactorBackward = 0.1;
  if (moveDirection.backward)
    camera.position.lerp(worldPos, smoothFactorBackward);
  else
    camera.position.lerp(worldPos, smoothFactor);

  camera.lookAt(car.position);
}

// ------------------------------------------------------
// Loop principal de renderização
// ------------------------------------------------------
function render() {
  keyboardUpdate();
  const delta = clock.getDelta();
  updateCar(delta);
  updateCameraFollow();
  checkCarCollision();
  checkLapCount();

  speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
