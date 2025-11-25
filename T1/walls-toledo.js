import * as THREE from 'three';
import { setDefaultMaterial } from '../libs/util/util.js';

function createSquareWalls(){
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const squareWalls = [];
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: redMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: redMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: redMaterial }); // m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 100.5), mesh: redMaterial });
      }
      else {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: whiteMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: whiteMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: whiteMaterial }); // m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 100.5), mesh: whiteMaterial });
      }
    }
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: redMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: redMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: redMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, 80.5), mesh: redMaterial });
      }
      else {
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: whiteMaterial });
        squareWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: whiteMaterial }); //m
        squareWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, 80.5), mesh: whiteMaterial });
      }
    }

    squareWalls.forEach(item => {
      const mesh = new THREE.Mesh(item.geom, item.mesh);
      mesh.position.copy(item.pos);
      scene.add(mesh);
      const bb = new THREE.Box3().setFromObject(mesh);
      barreirasTrack1.push({ mesh, bb });
    });
  };

  function createLWalls(){
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const LWalls = [];
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: redMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: redMaterial }); // m
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: whiteMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: whiteMaterial }); // m
      }
    }
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: redMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: redMaterial }); //m
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: whiteMaterial }); //m
        
      }
    }
    for( let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-20.5, 1, 95-(i*10)), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-0.5, 1, 75-(i*10)), mesh: redMaterial }); 
        
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-20.5, 1, 95-(i*10)), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-0.5, 1, 75-(i*10)), mesh: whiteMaterial }); 
      }
    }
    for( let i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(95-(i*10), 1, 100.5), mesh: redMaterial });
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(95-(i*10), 1, 100.5), mesh: whiteMaterial });
      }
    }
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: redMaterial });
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
      }
    }
    for(let i = 0; i < 8; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(75-(i*10), 1, 80.5), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 0.5), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -20.5), mesh: redMaterial }); //
        
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(75-(i*10), 1, 80.5), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 0.5), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -20.5), mesh: whiteMaterial }); //
      }
    }
    LWalls.forEach(item => {
      const mesh = new THREE.Mesh(item.geom, item.mesh);
      mesh.position.copy(item.pos);
      scene.add(mesh);
      const bb = new THREE.Box3().setFromObject(mesh);
      barreirasTrack2.push({ mesh, bb });
    });

  };

function createLWalls(){
    const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const LWalls = [];
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: redMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: redMaterial }); // m
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(100.5, 1, -95+(i*10)), mesh: whiteMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, -100.5), mesh: whiteMaterial }); // m
      }
    }
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: redMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: redMaterial }); //m
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -80.5), mesh: whiteMaterial }); //m
        
      }
    }
    for( let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-20.5, 1, 95-(i*10)), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-0.5, 1, 75-(i*10)), mesh: redMaterial }); 
        
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-100.5, 1, -95+(i*10)), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-20.5, 1, 95-(i*10)), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-0.5, 1, 75-(i*10)), mesh: whiteMaterial }); 
      }
    }
    for( let i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(95-(i*10), 1, 100.5), mesh: redMaterial });
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(95-(i*10), 1, 100.5), mesh: whiteMaterial });
      }
    }
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: redMaterial });
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(1, 2.5, 10), pos: new THREE.Vector3(-80.5, 1, -75+(i*10)), mesh: whiteMaterial }); //m
      }
    }
    for(let i = 0; i < 8; i++) {
      if (i % 2 === 0) {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(75-(i*10), 1, 80.5), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 0.5), mesh: redMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -20.5), mesh: redMaterial }); //
        
      }
      else {
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(75-(i*10), 1, 80.5), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-95+(i*10), 1, 0.5), mesh: whiteMaterial });
        LWalls.push({ geom: new THREE.BoxGeometry(10, 2.5, 1), pos: new THREE.Vector3(-75+(i*10), 1, -20.5), mesh: whiteMaterial }); //
      }
    }
    LWalls.forEach(item => {
      const mesh = new THREE.Mesh(item.geom, item.mesh);
      mesh.position.copy(item.pos);
      scene.add(mesh);
      const bb = new THREE.Box3().setFromObject(mesh);
      barreirasTrack2.push({ mesh, bb });
    });

  };
