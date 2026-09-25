import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import GUI from 'lil-gui';
import './App.css'
import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function App() {

  const ref = useRef()
  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const highDirectionalLight = new THREE.DirectionalLight(0xedf393, 2);
    highDirectionalLight.position.set(10, 20, 15)
    scene.add(highDirectionalLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, -7.5)
    scene.add(directionalLight);

    const light = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add(light);

    const pointLight = new THREE.PointLight(0xbd936f, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    const loader3D = new GLTFLoader();
    loader3D.load('./earth_globe.glb', function (gltf) {
      gltf.scene.position.y = -2
      scene.add(gltf.scene)
    })



    const loader = new THREE.TextureLoader()
    const color = loader.load("./text/color.jpg")
    const roughness = loader.load("./text/roughness.jpg")
    const normalOpenGL = loader.load("./text/normal_opengl.png")
    const height = loader.load("./text/height.png")

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const geometry = new THREE.CylinderGeometry(1, 1, 2, 30, 1, false);
    const geometry = new THREE.SphereGeometry(1, 50, 50);

    const material = new THREE.MeshStandardMaterial({ map: color, roughnessMap: roughness, normalMap: normalOpenGL, displacementMap: height })
    // const material = new THREE.MeshStandardMaterial({ color: 0xb362d9, wireframe: true, side: THREE.DoubleSide, roughness:2, metalness: .3, emissive: 0xd64d27, emissiveIntensity: .1, fog: true, wireframeLinecap: 'bevel', wireframeLinejoin: 'miter' });
    // const material = new THREE.MeshBasicMaterial({ color: 0x0fff00, wireframe: false, side: THREE.DoubleSide });
    const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    const gui = new GUI({ title: 'Sphere settings' });
    const materialSettings = {
      color: material.color.getHex(),
      roughness: material.roughness,
      metalness: material.metalness,
      opacity: material.opacity,
      transparent: material.transparent,
      wireframe: material.wireframe,
      flatShading: material.flatShading,
      displacementScale: material.displacementScale,
      displacementBias: material.displacementBias,
    };
    const meshSettings = {
      visible: cube.visible,
      castShadow: cube.castShadow,
      receiveShadow: cube.receiveShadow,
      positionX: cube.position.x,
      positionY: cube.position.y,
      positionZ: cube.position.z,
      scale: cube.scale.x,
    };

    const materialFolder = gui.addFolder('Material');
      materialFolder.addColor(materialSettings, 'color').onChange((value) => material.color.set(value));
      materialFolder.add(materialSettings, 'roughness', 0, 1, 0.01).onChange((value) => { material.roughness = value; });
      materialFolder.add(materialSettings, 'metalness', 0, 1, 0.01).onChange((value) => { material.metalness = value; });
      materialFolder.add(materialSettings, 'opacity', 0, 1, 0.01).onChange((value) => { material.opacity = value; });
      materialFolder.add(materialSettings, 'transparent').onChange((value) => { material.transparent = value; });
      materialFolder.add(materialSettings, 'wireframe').onChange((value) => { material.wireframe = value; });
      materialFolder.add(materialSettings, 'flatShading').onChange((value) => {
      material.flatShading = value;
      material.needsUpdate = true;
    });
      materialFolder.add(materialSettings, 'displacementScale', -1, 1, 0.01).onChange((value) => { material.displacementScale = value; });
      materialFolder.add(materialSettings, 'displacementBias', -1, 1, 0.01).onChange((value) => { material.displacementBias = value; });

    const meshFolder = gui.addFolder('Mesh');
      meshFolder.add(meshSettings, 'visible').onChange((value) => { cube.visible = value; });
      meshFolder.add(meshSettings, 'castShadow').onChange((value) => { cube.castShadow = value; });
      meshFolder.add(meshSettings, 'receiveShadow').onChange((value) => { cube.receiveShadow = value; });
      meshFolder.add(meshSettings, 'positionX', -10, 10, 0.1).onChange((value) => { cube.position.x = value; });
      meshFolder.add(meshSettings, 'positionY', -10, 10, 0.1).onChange((value) => { cube.position.y = value; });
      meshFolder.add(meshSettings, 'positionZ', -10, 10, 0.1).onChange((value) => { cube.position.z = value; });
      meshFolder.add(meshSettings, 'scale', 0.1, 5, 0.1).onChange((value) => { cube.scale.setScalar(value); });

    const lightsSettings = {
      ambientVisible: light.visible,
      ambientIntensity: light.intensity,
      directionalVisible: directionalLight.visible,
      directionalIntensity: directionalLight.intensity,
      highDirectionalVisible: highDirectionalLight.visible,
      highDirectionalIntensity: highDirectionalLight.intensity,
      pointVisible: pointLight.visible,
      pointIntensity: pointLight.intensity,
    };

    const lightsFolder = gui.addFolder('Lights');
      lightsFolder.add(lightsSettings, 'ambientVisible').name('Ambient light').onChange((value) => { light.visible = value; });
      lightsFolder.add(lightsSettings, 'ambientIntensity', 0, 3, 0.01).name('Ambient intensity').onChange((value) => { light.intensity = value; });
      lightsFolder.add(lightsSettings, 'directionalVisible').name('Main directional').onChange((value) => { directionalLight.visible = value; });
      lightsFolder.add(lightsSettings, 'directionalIntensity', 0, 3, 0.01).name('Main directional intensity').onChange((value) => { directionalLight.intensity = value; });
      lightsFolder.add(lightsSettings, 'highDirectionalVisible').name('High directional').onChange((value) => { highDirectionalLight.visible = value; });
      lightsFolder.add(lightsSettings, 'highDirectionalIntensity', 0, 4, 0.01).name('High directional intensity').onChange((value) => { highDirectionalLight.intensity = value; });
      lightsFolder.add(lightsSettings, 'pointVisible').name('Point light').onChange((value) => { pointLight.visible = value; });
      lightsFolder.add(lightsSettings, 'pointIntensity', 0, 3, 0.01).name('Point intensity').onChange((value) => { pointLight.intensity = value; });

    camera.position.z = -10;
    camera.position.y = -100


    const canvas = ref.current


    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const hdriLoader = new RGBELoader();
    let hdriEnvironment;
    hdriLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rosendal_plains_2_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      hdriEnvironment = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = hdriEnvironment;
      texture.dispose();
      scene.background = texture
      pmremGenerator.dispose();
    });

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.5
    controls.autoRotate = false
    controls.autoRotateSpeed = 5.0
    // controls.enableZoom = false

    


    let animationId
    function animate(time) {
      animationId = window.requestAnimationFrame(animate)
      renderer.render(scene, camera);
      controls.update()
      cube.rotation.x = time / 5000;
      // cube.rotation.y = time / 5000;
      // cube.rotation.z = time / 5000;
    }

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    })



    animate()
    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
      });

      controls.dispose();

      geometry.dispose();
      material.dispose();
      hdriEnvironment?.dispose();
      pmremGenerator.dispose();

      renderer.dispose();
    }
  }, [])

  return (
    <>
      <div className="bg-slate-800 p-2 px-5 flex justify-around text-xl text-white">
        <h1>Three.js</h1>
        <ul className="flex gap-5 text-lg">
          <li><a className='decoration-0' href="/">Home</a></li>
          <li><a className='decoration-0' href="/about">About</a></li>
          <li><a className='decoration-0' href="/">Contact</a></li>
        </ul>
      </div>
      <div className="relative max-w-screen">
        <canvas className='absolute cursor-pointer top-0 left-0 box-border' ref={ref}></canvas>
      </div>
    </>
  )
}

export default App
