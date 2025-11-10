// ------------------------------------------------------
// Variáveis de voltas
// ------------------------------------------------------
export let currentLap = 0;
export let passedFinishLine = false;
export let gameFinished = false;


// ------------------------------------------------------
// Atualização do teclado e troca de pista
// ------------------------------------------------------
export function keyboardUpdate() {
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
// Função de contagem de voltas
// ------------------------------------------------------
export function checkLapCount(lap) {
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
        lapDiv.innerText = "Volta: " + currentLap + " / " + lap;
        if (currentLap >= lap) {
            gameFinished = true;
            lapDiv.innerText = "FIM DE JOGO! 🏁";
        }
        }
    }
}