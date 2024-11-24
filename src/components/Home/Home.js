// import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";
// import { useRef, useEffect, useState } from "react";
// import * as THREE from "three";
// import NavBar from "../NavBar/NavBar";
// import "./Home.css";

// function Box() {
//   const { scene, animations } = useGLTF("/models/horse_walk/scene.gltf");
//   const mixer = useRef();
//   const actions = useRef({});
//   const [isAnimating, setIsAnimating] = useState(true);

//   useEffect(() => {
//     mixer.current = new THREE.AnimationMixer(scene);
//     animations.forEach((clip) => {
//       actions.current[clip.name] = mixer.current.clipAction(clip);
//     });

//     Object.values(actions.current).forEach((action) => action.play());
//     return () => mixer.current?.stopAllAction();
//   }, [scene, animations]);

//   useFrame((_, delta) => {
//     if (isAnimating) {
//       mixer.current?.update(delta);
//     }
//   });

//   const handleClick = () => {
//     setIsAnimating((prev) => !prev); // 3shan lw true -> false aw el 3ks
//     if (isAnimating) {
//       Object.values(actions.current).forEach((action) => action.stop());
//     } else {
//       Object.values(actions.current).forEach((action) => action.play());
//     }
//   };

//   // const handlePointerEnter = () => {
//   //   setIsAnimating(true);
//   //   Object.values(actions.current).forEach((action) => action.play());
//   // };

//   // const handlePointerLeave = () => {
//   //   setIsAnimating(false);
//   //   Object.values(actions.current).forEach((action) => action.stop());
//   // };

//   return <primitive object={scene} scale={0.05} onClick={handleClick} />;
// }

// function Home() {
//   return (
//     <div className="App">
//       <NavBar />
//       <header className="App-header">
//         <div className="content">
//           <h1 className="main-heading">Welcome to My 3D Website</h1>
//           <p className="sub-heading">
//             Explore interactive 3D elements with React Three Fiber.
//           </p>
//         </div>
//         <div className="three-container">
//           <Canvas camera={{ position: [3, 1, 3], fov: 50 }}>
//             <ambientLight intensity={0.5} />
//             <pointLight position={[10, 10, 10]} />
//             <Box />
//             {/* <OrbitControls
//               // minPolarAngle={Math.PI / 2}
//               maxPolarAngle={Math.PI / 2}
//             /> */}
//           </Canvas>
//         </div>
//       </header>
//     </div>
//   );
// }

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import "./Home.css";
import React, { useRef, useEffect } from "react";
import { AnimationMixer } from "three";
import { Roof, ShopModel } from "./ShopModel";

const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div style={{ display: "grid", placeItems: "center", gap: "20px" }}>
        <div
          style={{
            color: "white",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          Loading... {Math.round(progress)}%
        </div>
        <div class="loader">
          <div style={{ width: `${Math.round(progress) + 10}%` }}></div>
        </div>
      </div>
    </Html>
  );
};

function ManModel() {
  const { scene, animations } = useGLTF("/man_standard_walk/scene.gltf");
  const mixer = useRef(null);
  const actionRef = useRef(null);

  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new AnimationMixer(scene);
      actionRef.current = mixer.current.clipAction(animations[0]);

      const handleKeyDown = (event) => {
        if (event.key === "w" || event.key === "s") {
          actionRef.current?.play();
        }
      };

      const handleKeyUp = (event) => {
        if (event.key === "w" || event.key === "s") {
          actionRef.current?.stop();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      const tick = () => {
        mixer.current?.update(0.019);
        requestAnimationFrame(tick);
      };
      tick();
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        if (mixer.current) mixer.current.stopAllAction();
      };
    }
  }, [scene, animations]);

  return (
    <primitive
      object={scene}
      scale={0.7}
      position={[-9, 0, 0]}
      rotation={[0, Math.PI / 1.9, 0]}
    />
  );
}

function Home() {
  const cameraRef = useRef();
  const manPosition = [-9, 0, 0];

  return (
    <Canvas
      camera={{
        position: [manPosition[0] - 2.5, manPosition[1] + 2.2, manPosition[2]],
        fov: 75,
      }}
      onCreated={({ gl, scene, camera }) => {
        cameraRef.current = camera;
        scene.background = "white";

        camera.lookAt(...manPosition);

        gl.setSize(window.innerWidth, window.innerHeight);
      }}
    >
      <React.Suspense fallback={<Loader />}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 5, 0]} intensity={2.5} />

        <ShopModel />
        <Roof />
        <ManModel />
        <OrbitControls />
      </React.Suspense>
    </Canvas>
  );
}

export default Home;
