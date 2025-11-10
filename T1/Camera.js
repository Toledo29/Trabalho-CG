

export function updateCameraFollow() {
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
