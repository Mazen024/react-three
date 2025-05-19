import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import PropTypes from "prop-types";
import styles from "./welcome.module.css";

DoorModel.propTypes = {
  modelPath: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  onClick: PropTypes.func.isRequired,
  scale: PropTypes.arrayOf(PropTypes.number).isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function DoorModel({ modelPath, position, onClick, scale, rotation }) {
  const { scene, animations } = useGLTF(modelPath);
  const doorRef = useRef();
  const mixer = useRef();
  const actionRef = useRef();

  useEffect(() => {
    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.enabled = true;
      action.paused = false;

      actionRef.current = action;
      doorRef.current.action = action;
    }
  }, [animations, scene]);

  useFrame((_, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  const handleDoorClick = () => {
    if (actionRef.current) {
      actionRef.current.reset().play();
      actionRef.current.onFinish = () => {
        actionRef.current.stop();
        actionRef.current.reset();
      };
    }
    onClick();
  };

  return (
    <group
      ref={doorRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={handleDoorClick}
    >
      <primitive object={scene} />
    </group>
  );
}
// import '../../../Assets/3D_Models/Door1/scene.gltf'
function ResponsiveLabels() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 10;

  return (
    <>
      <Html position={[isMobile ? -4 : -9, 1, 1]} center>
        <div className={styles.cloudBubbleLeft}>Welcome Back</div>
      </Html>
      <Html position={[isMobile ? 4 : 9, 1, 1]} center>
        <div className={styles.cloudBubbleRight}>
          New here? Discover the mall
        </div>
      </Html>
    </>
  );
}

export default function Welcome() {
  const cameraRef = useRef();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    animateCamera([-7, -3, -1]);
    setTimeout(() => navigate("/login"), 3500);
  };

  const handleSignUpClick = () => {
    animateCamera([7, -3, -1]);
    setTimeout(() => navigate("/signup"), 3500);
  };

  const animateCamera = (position) => {
    gsap.to(cameraRef.current.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 5,
      ease: "power3.inOut",
    });
  };

  return (
    <div className={styles.welcomeContainer}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 75 }}
        onCreated={({ gl, camera }) => {
          cameraRef.current = camera;
          gl.setSize(window.innerWidth, window.innerHeight);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[-10, 10, 10]} intensity={1} />
        <pointLight position={[0, 5, 5]} intensity={1.5} color="#fff8dc" />
        <spotLight position={[0, 15, 10]} intensity={2} />

        <DoorModel
          modelPath="../../../Assets/3D_Models/Door1/scene.gltf"
          onClick={handleLoginClick}
          position={[-9, -8, 0]}
          scale={[2.3, 4, 1]}
          rotation={[0, 0, 0]}
        />
        <DoorModel
          modelPath="../../../Assets/3D_Models/Door2/scene.gltf"
          onClick={handleSignUpClick}
          position={[9, -8, 0]}
          scale={[2.2, 4, 1]}
          rotation={[0, 0, 0]}
        />
        <DoorModel
          modelPath="../../../Assets/3D_Models/robot1/scene.gltf"
          onClick={handleLoginClick}
          position={[-11, -3.5, 1]}
          scale={[4, 4, 4]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <DoorModel
          modelPath="../../../Assets/3D_Models/robot2/scene.gltf"
          onClick={handleLoginClick}
          position={[11, -3.5, 1]}
          scale={[4, 4, 4]}
          rotation={[0, -Math.PI / 4, 0]}
        />
        <ResponsiveLabels />
      </Canvas>
    </div>
  );
}
