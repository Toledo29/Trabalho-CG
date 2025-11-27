// Walls.js
import * as THREE from 'three';

export const barreirasTrack1 = [];
export const barreirasTrack2 = [];

// Exportar grupos para Scene.js poder ligar/desligar visualmente
export const groupSquareWalls = new THREE.Group();
export const groupLWalls = new THREE.Group();

/**
 * Helper: cria um bloco alternado (red/white) e retorna {mesh, bb}
 */
function makeBlock(geom, pos, isRed) {
  const mat = isRed ? new THREE.MeshBasicMaterial({ color: 0xff0000 }) : new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(pos);
  mesh.castShadow = true;
  const bb = new THREE.Box3().setFromObject(mesh);
  return { mesh, bb };
}

/**
 * createSquareWalls(scene)
 * Pista quadrada — cria grupos de blocos seguindo o padrão do seu código.
 */
export function createSquareWalls(scene) {
  // limpa grupos/arrays caso já existam (para permitir hot-reload)
  groupSquareWalls.clear();
  barreirasTrack1.length = 0;

  // externas grandes: 20 blocos verticais e horizontais (alternado)
  for (let i = 0; i < 20; i++) {
    const isRed = (i % 2 === 0);

    // lateral esquerda (x = -100.5) vertical blocks z=-95 .. 95
    {
      const geom = new THREE.BoxGeometry(1, 2.5, 10);
      const pos = new THREE.Vector3(-100.5, 1, -95 + (i * 10));
      const { mesh, bb } = makeBlock(geom, pos, isRed);
      groupSquareWalls.add(mesh);
      barreirasTrack1.push({ mesh, bb });
    }

    // lateral direita (x = +100.5)
    {
      const geom = new THREE.BoxGeometry(1, 2.5, 10);
      const pos = new THREE.Vector3(100.5, 1, -95 + (i * 10));
      const { mesh, bb } = makeBlock(geom, pos, isRed);
      groupSquareWalls.add(mesh);
      barreirasTrack1.push({ mesh, bb });
    }

    // topo/inferior horizontais (z = -100.5 / +100.5), blocos x = -95 .. 95
    {
      const geom = new THREE.BoxGeometry(10, 2.5, 1);
      const posA = new THREE.Vector3(-95 + (i * 10), 1, -100.5);
      const posB = new THREE.Vector3(-95 + (i * 10), 1, 100.5);

      const bA = makeBlock(geom, posA, isRed);
      const bB = makeBlock(geom, posB, isRed);

      groupSquareWalls.add(bA.mesh);
      groupSquareWalls.add(bB.mesh);
      barreirasTrack1.push({ mesh: bA.mesh, bb: bA.bb });
      barreirasTrack1.push({ mesh: bB.mesh, bb: bB.bb });
    }
  }

  // internas (160 x 160) - 16 blocos por lado
  for (let i = 0; i < 16; i++) {
    const isRed = (i % 2 === 0);

    // laterais internas: x = -80.5 and x = +80.5, z from -75 .. 75
    {
      const geom = new THREE.BoxGeometry(1, 2.5, 10);
      const posL = new THREE.Vector3(-80.5, 1, -75 + (i * 10));
      const posR = new THREE.Vector3(80.5, 1, -75 + (i * 10));
      const bL = makeBlock(geom, posL, isRed);
      const bR = makeBlock(geom, posR, isRed);
      groupSquareWalls.add(bL.mesh); groupSquareWalls.add(bR.mesh);
      barreirasTrack1.push({ mesh: bL.mesh, bb: bL.bb });
      barreirasTrack1.push({ mesh: bR.mesh, bb: bR.bb });
    }

    // topo/inferior internas: z = -80.5 and z = +80.5, x from -75 .. 75
    {
      const geom = new THREE.BoxGeometry(10, 2.5, 1);
      const posA = new THREE.Vector3(-75 + (i * 10), 1, -80.5);
      const posB = new THREE.Vector3(-75 + (i * 10), 1, 80.5);
      const bA = makeBlock(geom, posA, isRed);
      const bB = makeBlock(geom, posB, isRed);
      groupSquareWalls.add(bA.mesh); groupSquareWalls.add(bB.mesh);
      barreirasTrack1.push({ mesh: bA.mesh, bb: bA.bb });
      barreirasTrack1.push({ mesh: bB.mesh, bb: bB.bb });
    }
  }

  // finalmente adicionar o grupo ao scene (se fornecido)
  if (scene && scene.add) scene.add(groupSquareWalls);
}

/**
 * createLWalls(scene)
 * Pista em L — recriado com segmentos explícitos e trecho final corrigido.
 */
export function createLWalls(scene) {
  groupLWalls.clear();
  barreirasTrack2.length = 0;

  const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  function addBlockToGroup(geom, pos, isRed) {
    const mat = isRed ? redMaterial : whiteMaterial;
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(pos);
    mesh.castShadow = true;
    groupLWalls.add(mesh);
    const bb = new THREE.Box3().setFromObject(mesh);
    barreirasTrack2.push({ mesh, bb });
  }

  // Segmento 1: horizontal inferior (x from -100 to 100) at z ≈ -100 border (vertical blocks)
  for (let i = 0; i < 20; i++) {
    const isRed = (i % 2 === 0);
    const geom = new THREE.BoxGeometry(1, 2.5, 10);
    const pos = new THREE.Vector3(100.5, 1, -95 + (i * 10)); // direita externa
    addBlockToGroup(geom, pos, isRed);

    // inferior horizontal bottom (z = -100.5)
    const geomH = new THREE.BoxGeometry(10, 2.5, 1);
    const posH = new THREE.Vector3(-95 + (i * 10), 1, -100.5);
    addBlockToGroup(geomH, posH, isRed);
  }

  // Segmento 2: lateral direita interna (x ~ 80.5), z range -75..85 (16 blocks)
  for (let i = 0; i < 16; i++) {
    const isRed = (i % 2 === 0);
    const geom = new THREE.BoxGeometry(1, 2.5, 10);
    const pos = new THREE.Vector3(80.5, 1, -75 + (i * 10));
    addBlockToGroup(geom, pos, isRed);

    // matching small horizontal inner at z = -80.5 (to keep pattern consistent)
    const geomH = new THREE.BoxGeometry(10, 2.5, 1);
    const posH = new THREE.Vector3(-75 + (i * 10), 1, -80.5);
    addBlockToGroup(geomH, posH, isRed);
  }

  // Segmento 3: subida esquerda / retorno (varios conjuntos)
  for (let i = 0; i < 10; i++) {
    const isRed = (i % 2 === 0);
    // left-most vertical
    addBlockToGroup(new THREE.BoxGeometry(1, 2.5, 10), new THREE.Vector3(-100.5, 1, -95 + (i * 10)), isRed);

    // parede mais para dentro (x = -20.5) subindo
    addBlockToGroup(new THREE.BoxGeometry(1, 2.5, 10), new THREE.Vector3(-20.5, 1, 95 - (i * 10)), isRed);

    // parede interna (x = -0.5) parte superior
    addBlockToGroup(new THREE.BoxGeometry(1, 2.5, 10), new THREE.Vector3(-0.5, 1, 75 - (i * 10)), isRed);
  }

  // Segmento 4: topo horizontal (z ~ 100.5) x from 95 downwards
  for (let i = 0; i < 12; i++) {
    const isRed = (i % 2 === 0);
    addBlockToGroup(new THREE.BoxGeometry(10, 2.5, 1), new THREE.Vector3(95 - (i * 10), 1, 100.5), isRed);
  }

  // Segmento 5: pequenos blocos internos (6)
  for (let i = 0; i < 6; i++) {
    const isRed = (i % 2 === 0);
    addBlockToGroup(new THREE.BoxGeometry(1, 2.5, 10), new THREE.Vector3(-80.5, 1, -75 + (i * 10)), isRed);
  }

  // Segmento 6: meio da L (8 x horizontais de topo/interiores)
  for (let i = 0; i < 8; i++) {
    const isRed = (i % 2 === 0);
    addBlockToGroup(new THREE.BoxGeometry(10, 2.5, 1), new THREE.Vector3(75 - (i * 10), 1, 80.5), isRed);
    addBlockToGroup(new THREE.BoxGeometry(10, 2.5, 1), new THREE.Vector3(-95 + (i * 10), 1, 0.5), isRed);
    addBlockToGroup(new THREE.BoxGeometry(10, 2.5, 1), new THREE.Vector3(-75 + (i * 10), 1, -20.5), isRed);
  }

  // ---------------------------
  // TRECHO FINAL CORRIGIDO (direita externa do topo → conecta com a primeira parede da reta direita)
  // x = 100.5, z = 95 down to 15 inclusive (95,85,...,15) => 9 blocos
  // ---------------------------
  for (let i = 0; i < 9; i++) {
    const isRed = (i % 2 === 1);
    const z = 95 - (i * 10);
    addBlockToGroup(new THREE.BoxGeometry(1, 2.5, 10), new THREE.Vector3(100.5, 1, z), isRed);
  }

  // adicionar grupo ao scene
  if (scene && scene.add) scene.add(groupLWalls);
}
