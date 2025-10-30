import * as THREE from 'three';
import { setDefaultMaterial } from '../libs/util/util.js';

const materialA = setDefaultMaterial('yellow');
const materialC = setDefaultMaterial('white');

// Exporta a função para uso externo
export function criaCurva(x, z, turn) {
  const pista = new THREE.BoxGeometry(20, 1, 20);
  const linha = new THREE.BoxGeometry(1, 0.05, 5);
  const linha2 = new THREE.BoxGeometry(1, 0.05, 5);

  const curva = new THREE.Mesh(pista, materialA);
  const faixa = new THREE.Mesh(linha, materialC);
  const faixa2 = new THREE.Mesh(linha2, materialC);

  faixa2.rotateY(0.90);

  curva.add(faixa);
  curva.add(faixa2);

  faixa.position.set(0.0, 0.5, -5.0);

  if (turn === 1) {
    faixa2.position.set(2.5, 0.5, 5.0);
  } else if (turn === -1) {
    faixa2.position.set(-2.5, 0.5, 5.0);
  }

  curva.position.set(x * 20, 0.5, z * 20);

  // Retorna o objeto pronto para ser adicionado à cena
  return curva;
}