// Misc.js
import * as THREE from 'three';

// contador de voltas e limite
export let lapCount = 0;
export const MAX_LAPS = 4;

// -------------------------------------------------------------
// PISTA 1  (já FUNCIONAVA — mantida 100% igual)
// -------------------------------------------------------------
export const checkpointsTrack1 = [
  { pos: new THREE.Vector3(-40, 1, -90), radius: 20 }, // CP1
  { pos: new THREE.Vector3(90, 1, -90), radius: 20 },  // CP2
  { pos: new THREE.Vector3(90, 1, 90), radius: 20 },   // CP3
  { pos: new THREE.Vector3(-40, 1, 90), radius: 20 }   // CP4
];

let expectedIndex1 = 0;
let sequenceComplete1 = false;
const checkpointInside1 = [false, false, false, false];

// -------------------------------------------------------------
// PISTA 2 (L) — agora com a mesma lógica da pista 1
// -------------------------------------------------------------
export const checkpointsTrack2 = [
  { pos: new THREE.Vector3(-40, 1, -90), radius: 20 }, // CP5 - início
  { pos: new THREE.Vector3(90, 1, -90), radius: 20 },  // CP6
  { pos: new THREE.Vector3(90, 1, 90), radius: 20 },   // CP7
  { pos: new THREE.Vector3(-5, 1, 90), radius: 20 },   // CP8
  { pos: new THREE.Vector3(-10, 1, 0), radius: 20 },   // CP9
  { pos: new THREE.Vector3(-90, 1, -10), radius: 20 }, // CP10
];

let expectedIndex2 = 0;
let sequenceComplete2 = false;
const checkpointInside2 = [false, false, false, false, false, false];

// -------------------------------------------------------------
// RESET GERAL
// -------------------------------------------------------------
export function resetLapSystem() {
  lapCount = 0;

  // pista 1
  expectedIndex1 = 0;
  sequenceComplete1 = false;
  for (let i = 0; i < checkpointInside1.length; i++) checkpointInside1[i] = false;

  // pista 2
  expectedIndex2 = 0;
  sequenceComplete2 = false;
  for (let i = 0; i < checkpointInside2.length; i++) checkpointInside2[i] = false;
}

// -------------------------------------------------------------
// Função genérica que ambas as pistas usam — mesmo algoritmo
// -------------------------------------------------------------
function processLap(car, checkpoints, expectedIndex, sequenceComplete, insideFlags) {

  const idxToCheck = sequenceComplete ? 0 : expectedIndex;
  const cp = checkpoints[idxToCheck];

  const dist = car.position.distanceTo(cp.pos);
  const isInside = dist < cp.radius;

  // ENTER
  if (isInside && !insideFlags[idxToCheck]) {
    insideFlags[idxToCheck] = true;

    // ainda acumulando sequência
    if (!sequenceComplete) {
      expectedIndex++;

      // completou todos → agora precisa voltar ao CP inicial
      if (expectedIndex >= checkpoints.length) {
        sequenceComplete = true;
        expectedIndex = checkpoints.length - 1;
      }

      return { expectedIndex, sequenceComplete, lapText: null };
    }

    // já completou sequência e entrou novamente no CP inicial
    lapCount++;

    sequenceComplete = false;
    expectedIndex = 1;

    return { expectedIndex, sequenceComplete, lapText: `Volta: ${lapCount} / ${MAX_LAPS}` };
  }

  // EXIT
  if (!isInside && insideFlags[idxToCheck]) {
    insideFlags[idxToCheck] = false;
  }

  return { expectedIndex, sequenceComplete, lapText: null };
}

// -------------------------------------------------------------
// Função principal chamada no render()
// -------------------------------------------------------------
export function checkLapCount(car, currentTrack) {
  if (currentTrack === 1) {
    // roda lógica da pista 1
    const res = processLap(
      car,
      checkpointsTrack1,
      expectedIndex1,
      sequenceComplete1,
      checkpointInside1
    );

    expectedIndex1 = res.expectedIndex;
    sequenceComplete1 = res.sequenceComplete;
    return res.lapText;
  }

  if (currentTrack === 2) {
    // roda lógica da pista 2
    const res = processLap(
      car,
      checkpointsTrack2,
      expectedIndex2,
      sequenceComplete2,
      checkpointInside2
    );

    expectedIndex2 = res.expectedIndex;
    sequenceComplete2 = res.sequenceComplete;
    return res.lapText;
  }

  return null;
}
