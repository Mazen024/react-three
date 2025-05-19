import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three"; // Animation
import gsap from "gsap";
import "./welcome.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

Cube.propTypes = {
  onClick: PropTypes.func.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.string.isRequired,
};

function Cube({ onClick, position, label }) {
  const [hovered, setHovered] = useState(false);

  const materialRef = useRef();

  const colorTexture = useTexture("../../../Assets/textures/3/color.jpg");
  const dispTexture = useTexture("../../../Assets/textures/3/height.png");
  const normalsTexture = useTexture("../../../Assets/textures/3/normal.jpg");
  const aoTexture = useTexture("../../../Assets/textures/3/ao.jpg");
  const roughnessTexture = useTexture(
    "../../../Assets/textures/3/roughness.jpg"
  );
  const metallicTexture = useTexture("../../../Assets/textures/3/metallic.jpg");
  const emissiveTexture = useTexture("../../../Assets/textures/3/emissive.jpg");

  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 300, friction: 10 },
  });

  return (
    <a.group scale={scale}>
      <mesh
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial
          ref={materialRef}
          map={colorTexture}
          displacementScale={0.009}
          displacementMap={dispTexture}
          normalMap={normalsTexture}
          aoMap={aoTexture}
          aoMapIntensity={0.5}
          roughness={0.1}
          roughnessMap={roughnessTexture}
          metalness={1.0}
          metalnessMap={metallicTexture}
          emissiveMap={emissiveTexture}
          emissiveIntensity={1}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + 3, position[2] + 1]}
        fontSize={1.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.02}
      >
        {label}
      </Text>
    </a.group>
  );
}

export default function Welcome() {
  const cameraRef = useRef();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    animateCamera([-6, 0, -1]);
    setTimeout(() => navigate("/login", { replace: null }), 1000);
  };

  const handleSignUpClick = () => {
    animateCamera([6, 0, -1]);
    setTimeout(() => navigate("/signup", { replace: null }), 1000);
  };

  const animateCamera = (position) => {
    gsap.to(cameraRef.current.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 1.5,
      ease: "power3.inOut",
    });
  };

  return (
    <div className="welcome-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        onCreated={({ gl, camera }) => {
          cameraRef.current = camera;
          gl.setSize(window.innerWidth, window.innerHeight);
        }}
      >
        <ambientLight intensity={3.7} />
        <directionalLight position={[-5, 15, -5]} intensity={2} />
        <Cube onClick={handleLoginClick} position={[-6, 0, 0]} label="Login" />
        <Cube
          onClick={handleSignUpClick}
          position={[6, 0, 0]}
          label="Sign Up"
        />
      </Canvas>
    </div>
  );
}
