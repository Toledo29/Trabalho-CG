import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createCar } from '../T1/Car.js'
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

  // ------------------------------------------------------
  // Céu - cor de fundo da cena (azul céu)
  // ------------------------------------------------------
  scene.background = new THREE.Color(0x87CEEB); // Azul céu

  // ------------------------------------------------------
  // Materiais com cores diferentes
  // ------------------------------------------------------
  // Material para piso da pista (cinza claro)
  const materialPista = setDefaultMaterial('rgb(200, 200, 200)');

  // Material para muretas (vermelho/laranja)
  const materialMuretas = setDefaultMaterial('rgb(200, 50, 50)');

  // Material para plano principal/chão (verde grama)
  const materialChao = setDefaultMaterial('rgb(34, 139, 34)'); 

  let track1, track2; 
  let currentTrack = 1;
  let muretasTrack1, muretasTrack2; // Grupos de muretas para cada pista

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
  const MAX_LAPS = 2;
  let passedFinishLine = false;
  let gameFinished = false;

  // ------------------------------------------------------
  // Variáveis de colisão
  // ------------------------------------------------------
  const barreirasTrack1 = [];
  const barreirasTrack2 = [];

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

  // --- contador de voltas ---
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
  // Função para criar as pistas e checkpoint visível (amarelo)
  // ------------------------------------------------------
  function createTrack() {
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
    
    resetCarPosition(1);

    track1.userData.checkpoint = checkpoint1;
    track2.userData.checkpoint = checkpoint2;

  createGroundPlane(); // plano principal/chão
  createWalls(); // barreiras invisíveis
  // createVisibleWalls(); // muretas visíveis - REMOVIDO
  }

  // ------------------------------------------------------
  // Função para criar o plano principal (chão)
  // ------------------------------------------------------
  function createGroundPlane() {
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const ground = new THREE.Mesh(groundGeometry, materialChao);
    ground.rotation.x = degreesToRadians(-90);
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  // ------------------------------------------------------
  // Função para criar muretas visíveis
  // ------------------------------------------------------
  function createVisibleWalls() {
    // Criar muretas visíveis baseadas nas barreiras externas
    const wallHeight = 3;
    const wallThickness = 2;
    
    // Grupo de muretas da pista 1 (quadrada) - apenas externas
    muretasTrack1 = new THREE.Group();
    const squareWallPositions = [
      { width: 200, depth: wallThickness, x: -102.5, z: 0, rotY: 0 }, // Esquerda
      { width: 200, depth: wallThickness, x: 102.5, z: 0, rotY: 0 }, // Direita
      { width: wallThickness, depth: 200, x: 0, z: 102.5, rotY: 0 }, // Superior
      { width: wallThickness, depth: 200, x: 0, z: -102.5, rotY: 0 }, // Inferior
    ];
    
    squareWallPositions.forEach(pos => {
      const wallGeometry = new THREE.BoxGeometry(pos.width, wallHeight, pos.depth);
      const wall = new THREE.Mesh(wallGeometry, materialMuretas);
      wall.position.set(pos.x, wallHeight / 2, pos.z);
      wall.rotation.y = degreesToRadians(pos.rotY);
      wall.castShadow = true;
      muretasTrack1.add(wall);
    });
    
    // Grupo de muretas da pista 2 (L) - apenas externas
    muretasTrack2 = new THREE.Group();
    const lWallPositions = [
      { width: 180, depth: wallThickness, x: 102.5, z: 10, rotY: 0 }, // Direita
      { width: 60, depth: wallThickness, x: -102.5, z: -50, rotY: 0 }, // Esquerda inferior
      { width: 100, depth: wallThickness, x: -102.5, z: 30, rotY: 0 }, // Esquerda superior
      { width: wallThickness, depth: 100, x: 40, z: 102.5, rotY: 0 }, // Superior direita
      { width: wallThickness, depth: 20, x: -10, z: 102.5, rotY: 0 }, // Superior esquerda
      { width: wallThickness, depth: 200, x: 0, z: -102.5, rotY: 0 }, // Inferior
    ];
    
    lWallPositions.forEach(pos => {
      const wallGeometry = new THREE.BoxGeometry(pos.width, wallHeight, pos.depth);
      const wall = new THREE.Mesh(wallGeometry, materialMuretas);
      wall.position.set(pos.x, wallHeight / 2, pos.z);
      wall.rotation.y = degreesToRadians(pos.rotY);
      wall.castShadow = true;
      muretasTrack2.add(wall);
    });
    
    scene.add(muretasTrack1);
    scene.add(muretasTrack2);
    
    // Mostrar apenas as muretas da pista ativa inicialmente
    muretasTrack1.visible = true;
    muretasTrack2.visible = false;
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

function checkCarCollision2() {
  const carBB = new THREE.Box3().setFromObject(car);
  const carDir = new THREE.Vector3(Math.cos(car.rotation.y), 0, -Math.sin(car.rotation.y));
  const allWalls = [ ...barreirasTrack2];

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
    checkCarCollision2();
    checkLapCount();

    speedBox.changeMessage("Velocidade: " + Number(car.userData.speed).toFixed(0));

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
