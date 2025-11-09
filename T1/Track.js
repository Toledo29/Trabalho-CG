import * as THREE from 'three';

export function createSquareTrackElements(trackGroup, material) {
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

export function createLTrackElements(trackGroup, material) {
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