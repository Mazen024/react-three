import { useGLTF } from "@react-three/drei";

function ShopModel() {
  const { scene } = useGLTF("/Denvers/scene.gltf");
  return <primitive object={scene} scale={0.5} />;
}

function Roof() {
  return (
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[70, 30]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  );
}

export { ShopModel, Roof };
