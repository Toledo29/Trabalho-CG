import * as THREE from 'three';

export function initLight(scene, car) {

    // inicializa luz ambiente
    let lightColor = "rgb(255,255,255)";
    let ambientLight = new THREE.AmbientLight(lightColor, 0.2);
    scene.add(ambientLight);

    // inicializa luz direcional
    let lightPosition = new THREE.Vector3(car.position.x -10, car.position.y + 6, car.position.z);
    let dirLight = new THREE.DirectionalLight(lightColor, 1);
    dirLight.position.copy(lightPosition);
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 1000;  // default
    dirLight.shadow.mapSize.height = 1000; // default
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;

    scene.add(dirLight);
    return dirLight;
}

export function updateLightFollow(car, dirLight) {
  const localOffset = new THREE.Vector3(-10, 6, 0);
  const worldPos = localOffset.clone();
  car.localToWorld(worldPos);

  dirLight.position.copy(worldPos);
}