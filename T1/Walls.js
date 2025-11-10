
let muretasTrack1, muretasTrack2; // Grupos de muretas para cada pista

export function createWalls() {
    const Material = new THREE.MeshBasicMaterial('rgba(208, 255, 0, 1)');

    let caixa = new THREE.BoxGeometry(5, 5, 5);

    let cube = new THREE.Mesh(caixa, Material);

    cube.position.set(0.0, 0.0, 0.0);
    
    scene.add(cube);
    
}