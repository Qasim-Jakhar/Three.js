# Three.js Learning Workspace

This repository is a small project built to learn and practice Three.js in a Vite + React environment. The app can be used as a playground for creating 3D scenes, animations, geometry, lighting, and camera interactions.

## What this project includes

- Vite setup for a fast frontend workflow
- React app structure
- Three.js integration for 3D rendering
- A space to experiment with scenes, meshes, lighting, and animation

## Getting started

```bash
npm install
npm run dev
```

Then open the local dev server URL in the browser to view the Three.js scene.

## Basic Three.js usage

```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
```

## Purpose

This project was created to practice and understand how Three.js works in a real browser-based app, and to keep the learning progress in GitHub for reference and future projects.
