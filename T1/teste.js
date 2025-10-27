import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, materialA, materialB, materialC, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
materialA = setDefaultMaterial('darkgray');
materialB = setDefaultMaterial('green');
materialC = setDefaultMaterial('white');
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
scene.add(camera); // Add camera to the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(1000, 1000);
scene.add(plane);

let pista = new THREE.BoxGeometry(20, 1, 20);
let linha = new THREE.BoxGeometry(1, 0.05, 5);
let linha2 = new THREE.BoxGeometry(1, 0.05, 5);
let asfalto = new THREE.Mesh(pista, materialA);
let faixa = new THREE.Mesh(linha, materialC);
let faixa2 = new THREE.Mesh(linha2, materialC);

asfalto.add(faixa);
asfalto.add(faixa2);

asfalto.position.set(0.0, 0.5, 0.0);
faixa.position.set(0.0, 0.5, 5.0);
faixa2.position.set(0.0, 0.5, -5.0);

scene.add(asfalto);

clona(asfalto,10,scene);

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

function clona(objeto,count,scene)
{
    const clonecount = count;
    const espacamento = 20;

    for(let i = 0; i < clonecount; i++)
    {
        const clone = objeto.clone();
        clone.position.set( 0, 0.5,i * espacamento - (clonecount * espacamento)/ 2);
        scene.add(clone);
    }
}