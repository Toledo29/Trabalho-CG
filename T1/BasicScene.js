import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
//import { criaCurva } from '../T1/objetos/curvapista.js';
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
materialA = setDefaultMaterial('yellow');
materialB = setDefaultMaterial('black');
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

let pilar = new THREE.BoxGeometry(20, 20, 20);

let Ebarreira = new THREE.Mesh(pilar, materialA);
let Ebarreira2 = new THREE.Mesh(pilar, materialB);
let Dbarreira = new THREE.Mesh(pilar, materialA);
let Dbarreira2 = new THREE.Mesh(pilar, materialB);

Ebarreira.add(Ebarreira2);
Ebarreira.add(Ebarreira2);
Ebarreira.add(Dbarreira);
Ebarreira.add(Dbarreira2);

barreira.position.set(0.0, 10.0, 0.0);
barreira2.position.set(20.0, 0.0, 0.0);

scene.add(barreira);

//clona(asfalto,10,scene);

//const curva1 = criaCurva(10, 10, 1);
//scene.add(curva1);

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