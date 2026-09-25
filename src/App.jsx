import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

const App = () => {
  const ref = useRef(null)
  const button = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e12);

    const camera = new THREE.PerspectiveCamera(90, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(6, 5, 8);
    camera.lookAt(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: ref.current, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x24242c, transparent: true, opacity: .9 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const octaHadron = new THREE.Mesh(
      new THREE.OctahedronGeometry(.8, 0),
      new THREE.MeshStandardMaterial({ color: 0x4d44d4 })
    )

    octaHadron.position.set(5.51, 3.15)

    scene.add(octaHadron)

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1, .3, 20, 100),
      new THREE.MeshStandardMaterial({ color: 0x4d44d4 })
    )

    torus.position.set(3.51, 1.5)

    scene.add(torus)

    // ---- the core technique: place `top` directly on top of `base` ----
    function stackOn(base, top) {
      const baseBox = new THREE.Box3().setFromObject(base);
      const topBox = new THREE.Box3().setFromObject(top);
      const topHalfHeight = (topBox.max.y - topBox.min.y) / 2;

      top.position.set(
        base.position.x,
        baseBox.max.y + topHalfHeight,
        base.position.z
      );
    }

    const group = new THREE.Group();
    scene.add(group);

    // base: box, resting on the ground
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.5, 2),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
    );
    box.position.set(0, 0.75, 0); // half its own height above y=0
    group.add(box);

    // middle: sphere, stacked on the box
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 60, 60),
      new THREE.MeshStandardMaterial({ color: 0xd6caa3, wireframe: false })
    );

    const leye = new THREE.Mesh(
      new THREE.SphereGeometry(.1, 50, 70),
      new THREE.MeshStandardMaterial({ color: 0x3e55f })
    )
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, .5, 150),
      new THREE.MeshStandardMaterial({ color: 0xfffcd45, wireframe: true })
    );
    group.add(nose)
    const reye = new THREE.Mesh(
      new THREE.SphereGeometry(.1, 50, 70),
      new THREE.MeshStandardMaterial({ color: 0x3e55f })
    )
    group.add(leye)
    group.add(reye)
    group.add(sphere);
    stackOn(box, sphere);

    const sphereRadius = 0.9;


    // without using .setFromSphericalCoords

    // function positionOnSphere(radius, thetaDeg, phiDeg) {
    //   const theta = THREE.MathUtils.degToRad(thetaDeg); // around Y axis
    //   const phi = THREE.MathUtils.degToRad(phiDeg);      // down from top
    //   return  new THREE.Vector3(
    //     radius * Math.sin(phi) * Math.sin(theta),
    //     radius * Math.cos(phi),
    //     radius * Math.sin(phi) * Math.cos(theta)
    //   );
    // }

    // sphere.add(leye);
    // leye.position.copy(positionOnSphere(sphereRadius, -20, 80));

    // sphere.add(reye);
    // reye.position.copy(positionOnSphere(sphereRadius, 20, 80));

    // sphere.add(nose);
    // nose.position.copy(positionOnSphere(sphereRadius * 0.9, 0, 90));


    // By Using .setFromSphericalCoords

    function positionOnSphere(radius, phiDeg, thetaDeg) {
      return new THREE.Vector3().setFromSphericalCoords(
        radius,
        THREE.MathUtils.degToRad(phiDeg),
        THREE.MathUtils.degToRad(thetaDeg)
      );
    }

    sphere.add(leye);
    leye.position.copy(positionOnSphere(sphereRadius, 75, 75));

    sphere.add(reye);
    reye.position.copy(positionOnSphere(sphereRadius, 75, 105));

    sphere.add(nose);
    nose.position.copy(positionOnSphere(sphereRadius * 0.9, 90, 90));


    const gui = new GUI({ title: 'Change Positions', });
    gui.domElement.style.position = 'absolute'
    gui.domElement.style.right = 0
    gui.domElement.style.top = "25px"
    gui.domElement.style.display = "none"
    button.current.addEventListener("click", () => {
      if (gui.domElement.style.display === "none") {
        gui.domElement.style.display = ""
        button.current.innerHTML = "Hide Controls"
      }
      else {
        gui.domElement.style.display = "none"
        button.current.innerHTML = "Show Controls"
      }
    })

    const positionFolder = gui.addFolder('Positions');
    [
      ['Box', box],
      ['Sphere', sphere],
      ['Left Eye', leye],
      ['Right Eye', reye],
      ['Nose', nose],
      ['Octahadron', octaHadron],
      ['Torus', torus],

    ].forEach(([name, element]) => {
      const folder = positionFolder.addFolder(name);
      folder.add(element.position, 'x', -10, 10, 0.01);
      folder.add(element.position, 'y', -10, 10, 0.01);
      folder.add(element.position, 'z', -10, 10, 0.01);
      folder.close()
    });

    // top: cone, stacked on the sphere
    let coneGeometry = new THREE.ConeGeometry(0.6, 1.2, 150)
    const cone = new THREE.Mesh(
      coneGeometry,
      new THREE.MeshStandardMaterial({ color: 0xef4444, wireframe: true })
    );
    group.add(cone);
    stackOn(sphere, cone);

    const coneFolder = positionFolder.addFolder('Cone');
    coneFolder.add(cone.position, 'x', -10, 10, 0.01);
    coneFolder.add(cone.position, 'y', -10, 10, 0.01);
    coneFolder.add(cone.position, 'z', -10, 10, 0.01);
    coneFolder.close()

    const curve = new THREE.EllipseCurve(
      0, 0,
      10, 10,
      0, 2 * Math.PI,
      false,
      0
    );
    const points1 = curve.getPoints(50);
    const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
    const material1 = new THREE.LineBasicMaterial({ color: 0x0ffcfc });
    // Create the final object to add to the scene
    const ellipse = new THREE.Line(geometry1, material1);

    group.add(ellipse)

    let point1 = curve.getPoint(0.1)
    let point2 = curve.getPoint(0.5)

    const points = [
      cone.position,
      point2
    ]

    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff
    })

    const line = new THREE.Line(geometry, material)

    group.add(line)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    sphere.name = "Sphere"
    cone.name = "Cone"
    torus.name = "Torus"
    octaHadron.name = "Octahadron"
    box.name = "Box"
    leye.name = "Left eye"
    reye.name = "Right eye"
    nose.name = "Nose"
    ground.name = "Ground"
    ellipse.name = "Ellipse"
    line.name = "Line"

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handlePointerDown = (event) => {
      isDragging = false;
      startX = event.clientX;
      startY = event.clientY;
    };

    const handlePointerMove = (event) => {
      const distance = Math.hypot(
        event.clientX - startX,
        event.clientY - startY
      );

      if (distance > 5) {
        isDragging = true;
      }
    };

    
    const handleClick = (event) => {
      if (isDragging) return
      const rect = ref.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);


      const allObjects = [sphere, cone, torus, octaHadron, box, ground, ellipse, line]
      const intersects = raycaster.intersectObjects(allObjects, true)
      console.log(intersects)
      if (intersects.length > 0) {
        alert(`${intersects[0].object.name} clicked`)
      }
    }
    
    ref.current.addEventListener("pointerdown", handlePointerDown);
    ref.current.addEventListener("pointermove", handlePointerMove);
    ref.current.addEventListener("click", handleClick);
    ref.current.addEventListener("click", handleClick)

    const handleMouseMove = (event) => {
      const rect = ref.current.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const allObjects = [sphere, cone, torus, octaHadron, box, ellipse, line]
      const intersects = raycaster.intersectObjects(allObjects, true)

      if (intersects.length > 0) {
        ref.current.style.cursor = "pointer";
      } else {
        ref.current.style.cursor = "default";
      }
    };

    ref.current.addEventListener("mousemove", handleMouseMove);

    const controls = new OrbitControls(camera, renderer.domElement)
    let animationId
    function animate() {
      animationId = requestAnimationFrame(animate);
      group.rotation.y += 0.006;
      // sphere.rotation.y += 0.009;
      renderer.render(scene, camera);
      controls.update();
    }
    animate();

    const handleResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      gui.destroy()

      ref.current.removeEventListener("click", handleClick)
      ref.current.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize);
      ref.current.removeEventListener("pointerdown", handlePointerDown);
      ref.current.removeEventListener("pointermove", handlePointerMove);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });

      renderer.dispose();
      controls.dispose();
    }
  }, [])

  return (
    <>
      <canvas className='block' ref={ref}></canvas>
      <button className='bg-[#111111] absolute right-0 top-0 px-0.5 py-0.5 text-sm text-slate-300 rounded-xs cursor-pointer w-30 text-center border border-gray-800' ref={button}>Show Controls</button>
    </>
  )
}

export default App