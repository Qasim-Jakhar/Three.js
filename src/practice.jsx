import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const App = () => {
  const ref = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.backgroundBlurriness = 100
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // const aspect = window.innerWidth / window.innerHeight;
    // const size = 10; // half the visible vertical height, in world units
    // const camera = new THREE.OrthographicCamera(
    //   -size * aspect, size * aspect, // left, right
    //   size, -size,                   // top, bottom
    //   0.1, 100                       // near, far
    // );

    camera.lookAt(0, 0, 50)
    const geometry = new THREE.SphereGeometry(1, 30, 30)
    const cubeGeometry = new THREE.SphereGeometry(.5, 20, 10)
    const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16)
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: "red"
    })

    const marker = new THREE.Mesh(
      markerGeometry,
      markerMaterial
    )
    scene.add(marker)

    const material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true, side: THREE.DoubleSide })
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'orange', wireframe: false, side: THREE.DoubleSide })

    const sphere = new THREE.Mesh(geometry, material)
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    const group = new THREE.Group()
    group.add(sphere)
    group.add(cube)
    scene.add(group)
    // const m = new THREE.Matrix4();
    // m.set(11, 12, 13, 14,
    //   21, 22, 23, 24,
    //   31, 32, 33, 34,
    //   41, 42, 43, 44);

    // scene.add(m)


    camera.position.z = 5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let clicked = 0;
    const handleClick = (event) => {
      const rect = ref.current.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(sphere);

      clicked++;

      if (intersects.length > 0) {
        location.href = "/#javascript"
        if (clicked % 2 === 0) {
          sphere.material.color.set(0xa4d3a4e);
        } else {
          sphere.material.color.set(0xc40ef4c);
        }
      }
    };

    ref.current.addEventListener("click", handleClick);

    const handleMouseMove = (event) => {
      const rect = ref.current.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(sphere);

      if (intersects.length > 0) {
        ref.current.style.cursor = "pointer";
      } else {
        ref.current.style.cursor = "default";
      }
    };

    ref.current.addEventListener("mousemove", handleMouseMove);

    const renderer = new THREE.WebGLRenderer({ canvas: ref.current, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true; // turn on real-time shadows
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = .001
    controls.dollyIn(1)
    controls.listenToKeyEvents(window)
    controls.addEventListener("start", () => {
      group.children.forEach(ele => {
        ele.material.color.set(0x8e34a4c)
      });
    })

    // function placeOnGlobe(object, latitude, longitude, radius) {
    //   const phi = THREE.MathUtils.degToRad(90 - latitude)
    //   const theta = THREE.MathUtils.degToRad(longitude)

    //   object.position.setFromSphericalCoords(
    //     radius,
    //     phi,
    //     theta
    //   )
    // }

    // placeOnGlobe(marker, 30, 70, 5)

    const latitude = 30
    const longitude = 70

    const position = new THREE.Vector3()

    position.setFromSphericalCoords(
      5,                                      // radius
      THREE.MathUtils.degToRad(90 - latitude),
      THREE.MathUtils.degToRad(longitude)
    )

    marker.position.copy(position)

    let animationId;
    let angle = 0;
    const radius = 3;
    function animate(time) {
      animationId = window.requestAnimationFrame(animate)
      renderer.render(scene, camera)
      controls.update();

      angle += 0.01;

      sphere.position.x = Math.cos(angle) * radius;
      sphere.position.z = Math.sin(angle) * radius;

      sphere.rotation.y = time / 10000
      cube.rotation.y = time / 10000
    }

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    })

    if (raycaster.length > 0) {
      obj.object.material.color.set("blue")
    }


    animate()
    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
      });


      geometry.dispose();
      material.dispose();
      renderer.dispose();
      controls.dispose();
    }
  }, [])


  return (
    <div className='relative max-w-screen m-0 p-0 bg-slate-900'>
      <canvas className='m-0 w-full h-full absolute cursor-pointer top-0 left-0 box-border' ref={ref}></canvas>
      <div className="mt-125">
        <a href="#javascript"></a>
        This is JavaScript
        </div>
    </div>
  )
}

export default App