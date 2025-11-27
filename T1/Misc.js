// Misc.js - estado das voltas (sem import circular)
import * as THREE from 'three';

export let currentLap = 0;
export const MAX_LAPS = 4;
export let passedFinishLine = false;
export let gameFinished = false;

export function resetLapSystem() {
  currentLap = 0;
  passedFinishLine = false;
  gameFinished = false;
}

/**
 * checkLapCount(car, currentTrack, track1, track2)
 * - Retorna string para exibir no lapDiv se houver mudança ("Volta: X / MAX" ou "FIM DE JOGO!")
 * - Retorna null se não alterar texto
 */
export function checkLapCount(car, currentTrack, track1, track2) {
  if (gameFinished) return null;
  const checkpoint = currentTrack === 1 ? (track1 && track1.userData && track1.userData.checkpoint) : (track2 && track2.userData && track2.userData.checkpoint);
  if (!checkpoint) return null;
  const carBB = new THREE.Box3().setFromObject(car);
  const cpBB = new THREE.Box3().setFromObject(checkpoint);
  if (carBB.intersectsBox(cpBB)) {
    if (!passedFinishLine) passedFinishLine = true;
    return null;
  } else {
    if (passedFinishLine) {
      passedFinishLine = false;
      currentLap++;
      if (currentLap >= MAX_LAPS) {
        gameFinished = true;
        return "FIM DE JOGO! 🏁";
      }
      return "Volta: " + currentLap + " / " + MAX_LAPS;
    }
  }
  return null;
}
