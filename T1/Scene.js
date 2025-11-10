import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createCar,updateCar } from '../T1/Car.js';
import { createTrack } from '../T1/Track.js';
import { updateCameraFollow } from '../T1/Camera.js';
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
  const MAX_LAPS = 2;

  export let scene;
  let renderer, camera, light; 
  scene = new THREE.Scene();    
  renderer = initRenderer();
  light = initDefaultBasicLight(scene);

  // ------------------------------------------------------
  // Céu - cor de fundo da cena (azul céu)
  // ------------------------------------------------------
  scene.background = new THREE.Color(0x87CEEB); // Azul céu

let muretasTrack1, muretasTrack2; // Grupos de muretas para cada pista

  // ------------------------------------------------------
  // Variáveis de colisão
  // ------------------------------------------------------
  const barreirasTrack1 = [];
  const barreirasTrack2 = [];

  // ------------------------------------------------------
  // Criação do carro
  // ------------------------------------------------------
  export let car = createCar(scene);

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

  // --- contador de voltas ---
  export const lapDiv = document.createElement("div");
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

  createTrack(scene);
  render();
// ===========================================================
// Função de colisão com barreiras (para pistas 1 e 2)
// ===========================================================
function checkCarCollision() {
  const carBB = new THREE.Box3().setFromObject(car);
  const carDir = new THREE.Vector3(Math.cos(car.rotation.y), 0, -Math.sin(car.rotation.y));
  const allWalls = [...barreirasTrack1];

  for (const { mesh, bb } of allWalls) {
    bb.setFromObject(mesh);

    if (carBB.intersectsBox(bb)) {
      // --- 1. Calcular profundidade de interseção (overlaps) ---
      const overlapX = Math.min(carBB.max.x, bb.max.x) - Math.max(carBB.min.x, bb.min.x);
      const overlapZ = Math.min(carBB.max.z, bb.max.z) - Math.max(carBB.min.z, bb.min.z);

      // --- 2. Determinar direção da correção ---
      let normal = new THREE.Vector3();
      let correction = new THREE.Vector3();

      if (overlapX < overlapZ) {
        if (car.position.x > mesh.position.x) normal.set(1, 0, 0);
        else normal.set(-1, 0, 0);
        correction.copy(normal).multiplyScalar(overlapX + 0.05); // leve margem de segurança
      } else {
        if (car.position.z > mesh.position.z) normal.set(0, 0, 1);
        else normal.set(0, 0, -1);
        correction.copy(normal).multiplyScalar(overlapZ + 0.05);
      }

      // --- 3. Corrigir posição imediatamente (sem penetração) ---
      car.position.add(correction);

      // --- 4. Calcular ângulo entre direção e normal ---
      const movementDir = carDir.clone().multiplyScalar(Math.sign(car.userData.speed));
      const angleRad = movementDir.angleTo(normal);
      const angleDeg = THREE.MathUtils.radToDeg(angleRad);

      // --- 5. Redução gradativa da velocidade ---
      let reductionFactor = 1.0;
      if (angleDeg > 90) {
        // Linear de 90° (sem perda) a 180° (parado)
        reductionFactor = 1.0 - (angleDeg - 90) / 90;
        reductionFactor = Math.max(0, reductionFactor);
      }

      // --- 6. Remover componente de velocidade normal à parede ---
      const velocityDir = carDir.clone().multiplyScalar(car.userData.speed);
      const normalComponent = normal.clone().multiplyScalar(velocityDir.dot(normal));
      const tangentialComponent = velocityDir.clone().sub(normalComponent);

      // Se o carro estiver empurrando a parede (de frente ou ré)
      if (velocityDir.dot(normal) < 0) {
        // Impede movimento na direção da parede
        velocityDir.sub(normalComponent);
      }

      // --- 7. Atualiza velocidade (magnitude) considerando redução angular ---
      const newSpeed = tangentialComponent.length() * reductionFactor;
      car.userData.speed = Math.sign(car.userData.speed) * newSpeed;

      // --- 8. Se o ângulo for quase frontal, parar completamente ---
      if (angleDeg >= 170) car.userData.speed = 0;

      // --- 9. Atualizar bounding box após correção ---
      carBB.setFromObject(car);

      return true;
    }
  }
  return false;
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
    checkLapCount(MAX_LAPS);

    speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
