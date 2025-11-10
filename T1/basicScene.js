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
  const MAX_LAPS = 4;
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
  // Função para criar o carro
  // ------------------------------------------------------
  function createCar() {
  const hovercraft = new THREE.Group();

  // Base inflável (anel inferior mais fino)
  const baseGeometry = new THREE.TorusGeometry(1.3, 0.25, 16, 32);
  const base = new THREE.Mesh(baseGeometry, setDefaultMaterial('rgb(255, 100, 100)')); // vermelho claro
  base.rotation.x = Math.PI / 2;
  hovercraft.add(base);

  // Corpo central (cilindro mais fino e mais leve)
  const bodyGeometry = new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16);
  const body = new THREE.Mesh(bodyGeometry, setDefaultMaterial('rgb(255, 0, 0)')); // vermelho principal
  body.position.y = 0.55;
  hovercraft.add(body);

  // Cabine superior (menor e mais fina)
  const cabineGeometry = new THREE.BoxGeometry(1.0, 0.5, 0.7);
  const cabine = new THREE.Mesh(cabineGeometry, setDefaultMaterial('rgb(255, 255, 255)')); // branca
  cabine.position.set(0, 1.0, 0);
  hovercraft.add(cabine);

  // Cone frontal (proa mais afilada)
  const noseGeometry = new THREE.ConeGeometry(0.4, 1.0, 16);
  const nose = new THREE.Mesh(noseGeometry, setDefaultMaterial('rgb(255, 0, 0)'));
  nose.rotation.z = Math.PI / 2;
  nose.position.set(1.7, 0.35, 0);
  hovercraft.add(nose);

  // Ajuste de posição inicial (como no seu código)
  hovercraft.position.set(-100.0, 0.5, -100.0);

  // Adiciona na cena
  scene.add(hovercraft);
  return hovercraft;
}

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
  createLWalls(); // barreiras invisíveis
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
  // Criação das barreiras invisíveis (pista quadrada + pista L)
  // ------------------------------------------------------
  function createWalls() {

    const squareWalls = [
      // { geom: new THREE.BoxGeometry(5, 5, 200), pos: new THREE.Vector3(-102.5, 2.5, 0.0) },
      // { geom: new THREE.BoxGeometry(5, 5, 160), pos: new THREE.Vector3(-77.5, 2.5, 0.0) },
      // { geom: new THREE.BoxGeometry(5, 5, 200), pos: new THREE.Vector3(102.5, 2.5, 0.0) },
      // { geom: new THREE.BoxGeometry(5, 5, 160), pos: new THREE.Vector3(77.5, 2.5, 0.0) },
      // { geom: new THREE.BoxGeometry(200, 5, 5), pos: new THREE.Vector3(0.0, 2.5, 102.5) },
      // { geom: new THREE.BoxGeometry(160, 5, 5), pos: new THREE.Vector3(0.0, 2.5, 77.5) },
      // { geom: new THREE.BoxGeometry(200, 5, 5), pos: new THREE.Vector3(0.0, 2.5, -102.5) },
      // { geom: new THREE.BoxGeometry(160, 5, 5), pos: new THREE.Vector3(0.0, 2.5, -77.5) },
    ];
    // Barreiras da pista L - calculadas baseadas nos segmentos reais
    // Cada segmento: trackWidth = 20, então se estende ±10 do centro
    // Pontos de transição devem ter aberturas nas barreiras internas
    // 1. Horizontal 200 em (0, -0.1, -90): X: -100 a 100, Z: -100 (ext) a -80 (int)
    //    Transição com segmento 2 em x=80-100, z=-80
    //    Transição com segmento 6 em x=-100--80, z=-80
    // 2. Vertical 180 em (90, -0.1, 10): X: 80 (int) a 100 (ext), Z: -80 a 100
    //    Transição com segmento 3 em x=80, z=80-100
    // 3. Horizontal 100 em (30, -0.1, 90): X: -20 a 80, Z: 80 (int) a 100 (ext)
    //    Transição com segmento 4 em x=-20-0, z=80
    // 4. Vertical 100 em (-10, -0.1, 30): X: -20 (ext) a 0 (int), Z: -20 a 80
    //    Transição com segmento 5 em x=-20, z=-20-0
    // 5. Horizontal 80 em (-60, -0.1, -10): X: -100 a -20, Z: -20 (int) a 0 (ext)
    //    Transição com segmento 6 em x=-100--80, z=-20
    // 6. Vertical 60 em (-90, -0.1, -50): X: -100 (ext) a -80 (int), Z: -80 a -20
    
    // Barreiras da pista L - trackWidth = 20, então pista se estende ±10 do centro
    // Segmentos:
    // 1. Horizontal: x=-100 a 100, z=-100(ext) a -80(int)
    // 2. Vertical: x=80(int) a 100(ext), z=-80 a 100
    // 3. Horizontal: x=-20 a 80, z=80(int) a 100(ext)
    // 4. Vertical: x=-20(ext) a 0(int), z=-20 a 80
    // 5. Horizontal: x=-100 a -20, z=-20(int) a 0(ext)
    // 6. Vertical: x=-100(ext) a -80(int), z=-80 a -20
    
    const lWalls = [
      // // Barreiras EXTERNAS - bordas da pista
      // // Direita (x=100, externa do segmento 2)
      // { geom: new THREE.BoxGeometry(5, 5, 180), pos: new THREE.Vector3(102.5, 2.5, 10) },
      
      // // Esquerda (x=-100, externa dos segmentos 6 e 4)
      // { geom: new THREE.BoxGeometry(5, 5, 60), pos: new THREE.Vector3(-102.5, 2.5, -50) }, // Parte inferior (segmento 6)
      // { geom: new THREE.BoxGeometry(5, 5, 100), pos: new THREE.Vector3(-102.5, 2.5, 30) }, // Parte superior (segmento 4)
      
      // // Superior (z=100, externa do segmento 3)
      // { geom: new THREE.BoxGeometry(100, 5, 5), pos: new THREE.Vector3(40, 2.5, 102.5) }, // Parte direita (x=-20 a 80)
      // { geom: new THREE.BoxGeometry(20, 5, 5), pos: new THREE.Vector3(-10, 2.5, 102.5) }, // Parte esquerda (x=-20 a 0)
      
      // // Inferior (z=-100, externa do segmento 1)
      // { geom: new THREE.BoxGeometry(200, 5, 5), pos: new THREE.Vector3(0, 2.5, -102.5) },
      
      // // Barreiras INTERNAS - bordas internas dos segmentos (áreas pretas)
      // // Bloqueiam as bordas internas mas deixam aberturas AMPLAS nas zonas de curva
      
      // // CURVA 1: Segmento 1 ↔ Segmento 2 (primeira curva)
      // // Segmento 1 (horizontal inferior): barreira interna com aberturas nas curvas
      // { geom: new THREE.BoxGeometry(40, 5, 5), pos: new THREE.Vector3(-60, 2.5, -77.5) }, // Parte esquerda (x=-80 a -40, deixando abertura x=-100 a -80 para segmento 6 - AMPLIADA)
      // { geom: new THREE.BoxGeometry(50, 5, 5), pos: new THREE.Vector3(-5, 2.5, -77.5) }, // Parte central (x=-30 a 20)
      // { geom: new THREE.BoxGeometry(40, 5, 5), pos: new THREE.Vector3(40, 2.5, -77.5) }, // Parte direita (x=20 a 60)
      // // Aberturas ampliadas: x=-100 a -80 (segmento 6 - AINDA MAIS AMPLIADA) e x=60 a 100 (segmento 2) - SEM barreira em x=60-100
      
      // // Segmento 2 (vertical direita): barreira interna com abertura ampla na parte inferior
      // { geom: new THREE.BoxGeometry(5, 5, 120), pos: new THREE.Vector3(77.5, 2.5, 10) }, // Parte central (z=-50 a 70)
      // // Abertura ampla em z=-90 a -50 para entrada do segmento 1
      // // Abertura em z=70-100 para curva com segmento 3
      
      // // CURVA 3: Segmento 3 ↔ Segmento 4 (terceira curva)
      // // Segmento 3 (horizontal superior): barreira interna com aberturas amplas
      // { geom: new THREE.BoxGeometry(60, 5, 5), pos: new THREE.Vector3(35, 2.5, 77.5) }, // Parte direita (x=10 a 80, deixando abertura x=-20 a 10 para segmento 4)
      // // Abertura ampliada: x=-20 a 10 (segmento 4) e também x=70-80 para curva com segmento 2
      
      // // Segmento 4 (vertical esquerda central): barreira interna com abertura ampla na parte superior
      // { geom: new THREE.BoxGeometry(5, 5, 50), pos: new THREE.Vector3(2.5, 2.5, 55) }, // Parte superior (z=30 a 80)
      // { geom: new THREE.BoxGeometry(5, 5, 10), pos: new THREE.Vector3(2.5, 2.5, -25) }, // Parte inferior (z=-30 a -20)
      // // Abertura ampla em z=-20 a 30 para entrada do segmento 3 (PERMITE ATRAVESSAR TODA A TERCEIRA RETA)
      // // Abertura em z=-20-0 para curva com segmento 5
      
      // // CURVA 5: Segmento 5 ↔ Segmento 6 (quinta curva)
      // // Segmento 5 (horizontal superior esquerda): barreira interna MUITO REDUZIDA para permitir passagem completa
      // { geom: new THREE.BoxGeometry(30, 5, 5), pos: new THREE.Vector3(-35, 2.5, -22.5) }, // Parte direita (x=-50 a -20, deixando abertura x=-100 a -50 para segmento 6 - MUITO AMPLIADA)
      // // Abertura muito ampliada: x=-100 a -50 (segmento 6 - PERMITE ATRAVESSAR TODA A QUINTA RETA) e x=-20-0 (segmento 4)
      
      // // CURVA 6: Segmento 6 ↔ Segmento 1 (sexta curva)
      // // Segmento 6 (vertical esquerda inferior): barreira interna REMOVIDA na parte superior para permitir entrada livre do segmento 5
      // // SEM barreira na parte superior - abertura COMPLETA de z=-30 a -10 para entrada do segmento 5
      // { geom: new THREE.BoxGeometry(5, 5, 5), pos: new THREE.Vector3(-77.5, 2.5, -12.5) }, // Apenas parte superior muito pequena (z=-15 a -10)
      // // Abertura COMPLETA em z=-30 a -10 para entrada do segmento 5 (PERMITE ATRAVESSAR TODA A QUINTA RETA)
      // // Abertura COMPLETA em z=-90 a -30 para entrada do segmento 1 (PERMITE ATRAVESSAR TODA A SEXTA RETA)
    ];
  }

  function createSquareWalls(){
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const squareWalls = [];
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: redMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: redMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: redMaterial }); // m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 100.5), mesh: redMaterial });
      }
      else {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: whiteMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: whiteMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: whiteMaterial }); // m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 100.5), mesh: whiteMaterial });
      }
    }
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: redMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: redMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: redMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, 80.5), mesh: redMaterial });
      }
      else {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: whiteMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: whiteMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, 80.5), mesh: whiteMaterial });
      }
    }

    squareWalls.forEach(item => {
      const mesh = new THREE.Mesh(item.geom, item.mesh);
      mesh.position.copy(item.pos);
      scene.add(mesh);
      const bb = new THREE.Box3().setFromObject(mesh);
      barreirasTrack1.push({ mesh, bb });
    });
  };

  function createLWalls(){
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const LWalls = [];
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: redMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: redMaterial }); // m
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: whiteMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: whiteMaterial }); // m
      }
    }
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: redMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: redMaterial }); //m
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: whiteMaterial }); //m
        
      }
    }
    for( let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-20.5, 1, 95-(i*10)), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-0.5, 1, 75-(i*10)), mesh: redMaterial }); 
        
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-20.5, 1, 95-(i*10)), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-0.5, 1, 75-(i*10)), mesh: whiteMaterial }); 
      }
    }
    for( let i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(95-(i*10), 1, 100.5), mesh: redMaterial });
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(95-(i*10), 1, 100.5), mesh: whiteMaterial });
      }
    }
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: redMaterial });
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
      }
    }
    for(let i = 0; i < 8; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(75-(i*10), 1, 80.5), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 0.5), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -20.5), mesh: redMaterial }); //
        
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(75-(i*10), 1, 80.5), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 0.5), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -20.5), mesh: whiteMaterial }); //
      }
    }
    LWalls.forEach(item => {
      const mesh = new THREE.Mesh(item.geom, item.mesh);
      mesh.position.copy(item.pos);
      scene.add(mesh);
      const bb = new THREE.Box3().setFromObject(mesh);
      barreirasTrack2.push({ mesh, bb });
    });

  };

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
