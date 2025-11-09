import * as THREE from 'three';


export function createCar() {
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