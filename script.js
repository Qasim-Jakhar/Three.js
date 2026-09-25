import * as THREE from './node_modules/three/build/three.module.js';

const canvas = document.getElementById("draw3d")

let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, .1, 100)
scene.add(camera)

camera.position.z = 5
camera.position.x = 2
camera.position.y = -1


let box = new THREE.BoxGeometry(1, 1, 1)
let material = new THREE.MeshBasicMaterial({ color: 0x007A64 })

let mesh = new THREE.Mesh(box, material)
// let angle = THREE.degToRad()

mesh.rotation.y = Math.PI/6

mesh.scale.z = 2
mesh.scale.y = 2
mesh.scale.x = 2

scene.add(mesh)
let renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(scene, camera)

let clock = new THREE.Clock()
function animate() {
    window.requestAnimationFrame(animate)
    renderer.render(scene, camera)
    mesh.rotation.x = clock.getElapsedTime()*2
    mesh.rotation.y += .01
}
animate()






// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;


// const renderer = new THREE.WebGLRenderer({ canvas });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// function animate(time) {
//     window.requestAnimationFrame(animate)
//     renderer.render(scene, camera);
//     cube.rotation.x = time / 2000;
//     cube.rotation.y = time / 1000;
// }
// animate()

