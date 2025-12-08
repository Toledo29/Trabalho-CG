import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";

let scene, renderer, camera, orbit;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
   renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(5, 5, 5);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = false;
scene.add( axesHelper );

let dirPosition = new THREE.Vector3(2, 2, 4)
const dirLight = new THREE.DirectionalLight('white', 0.2);
dirLight.position.copy(dirPosition);
 //mainLight.castShadow = true;
scene.add(dirLight);  

// Load default scene
loadLightPostScene(scene)

// REMOVA ESTA LINHA APÓS CONFIGURAR AS LUZES DESTE EXERCÍCIO
initDefaultBasicLight(scene);

//---------------------------------------------------------
// Load external objects
buildInterface();

let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); 

let cubeGeometry = new THREE.BoxGeometry(0.2, 1.0, 0.2);
let cube = new THREE.Mesh(cubeGeometry, material);
// position the cube
cube.position.set(2.0, 0.50, 1.0);
// add the cube to the scene
scene.add(cube);

let cubeGeometry2 = new THREE.BoxGeometry(0.2, 1.0, 0.2);
let cube2= new THREE.Mesh(cubeGeometry2, material);
// position the cube
cube2.position.set(2.0, 0.50, -1.0);
// add the cube to the scene
scene.add(cube2);

let position = new THREE. Vector3(1.0, 0.5, 0.2);
let lightColor = "rgb(255,255,255)";
let pointLight = new THREE. PointLight (lightColor, 15.0);
pointLight.position.copy (position);
pointLight.castShadow = true;
scene.add(pointLight);



render();

// ... código anterior

//---------------------------------------------------------
// Load external objects
// ... código posterior


function buildInterface()
{
  // GUI interface
  let gui = new GUI();
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
