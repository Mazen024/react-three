import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { TextureLoader } from "three";
export const Snow = () => {
  const texture = useLoader(TextureLoader, "/1.png");
  const snowRef = useRef();

  const snowflakes = useMemo(() => {
    const flakes = [];
    const count = window.innerWidth < 768 ? 500 : 800;

    for (let i = 0; i < count; i++) {
      flakes.push([
        (Math.random() - 0.5) * 100,
        Math.random() * 100,
        (Math.random() - 0.5) * 100,
      ]);
    }
    return flakes;
  }, []);

  useFrame(() => {
    if (snowRef.current) {
      const positions = snowRef.current.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.05 + Math.random() * 0.2;

        if (positions[i + 1] < -50) {
          positions[i + 1] = Math.random() * 100;
          positions[i] = (Math.random() - 0.5) * 100;
          positions[i + 2] = (Math.random() - 0.5) * 100;
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={snowflakes.length}
          array={new Float32Array(snowflakes.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        alphaMap={texture}
        size={1.5}
        transparent
        depthWrite={false}
        depthTest={true}
        opacity={0.7}
      />
    </points>
  );
};
