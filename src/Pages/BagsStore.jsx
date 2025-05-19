/* eslint-disable react/prop-types */
import { OrbitControls, useGLTF } from "@react-three/drei";
import { createXRStore } from "@react-three/xr";
import {
  PATH_TO_BAGSSTORE_MODEL,
  BAGSSTORE_SHOP_POSITION,
  BAGSSTORE_SHOP_ROTATION,
  AMBIENT_LIGHT_INTENSITY,
  BAGSSTORE_SHOP_SCALE,
  FLOOR_SIZE,
  FLOOR_COLOR,
  BAGS_ITEMS_CONFIG,
} from "../Constants/BagsStore";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { MathUtils } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import ProductInfoPanel, {
  ControlsPanel,
  PriceTag,
} from "../Utils/ProductClick/handleProductClick";
import Loader from "../Utils/Loader/Loader";
import Navbar from "./Navbar";

const BagItem = ({
  path,
  position,
  rotation,
  scale,
  index,
  onBagClick,
  productInfo,
}) => {
  const { scene } = useGLTF(path);
  const [hovered, setHovered] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const meshRef = useRef();
  const initialY = position[1];

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.name = `shoe-${index}-${child.name}`;
      }
    });
    return clone;
  }, [scene, index]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Float animation
    if (hovered) {
      meshRef.current.position.y = MathUtils.lerp(
        meshRef.current.position.y,
        initialY + 0.1,
        0.1
      );

      // Gentle rotation when hovered
      meshRef.current.rotation.y += delta * 0.5;
    } else {
      meshRef.current.position.y = MathUtils.lerp(
        meshRef.current.position.y,
        initialY,
        0.1
      );
    }
  });

  useEffect(() => {
    if (hovered) {
      const timer = setTimeout(() => setShowLabel(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowLabel(false);
    }
  }, [hovered]);

  const newScale = hovered
    ? [scale[0] * 1.1, scale[1] * 1.1, scale[2] * 1.1]
    : scale;

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={newScale}
      onClick={(e) => {
        e.stopPropagation();
        onBagClick(index, { ...productInfo, path, position, rotation, scale });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <PriceTag
        price={productInfo.price}
        name={productInfo.name}
        visible={showLabel}
      />
      <primitive object={clonedScene} />
    </group>
  );
};

const BagsItemsDisplay = ({ onBagClick }) => {
  // const uniquePaths = [...new Set(BAGS_ITEMS_CONFIG.map((item) => item.path))];
  // uniquePaths.forEach((path) => useGLTF.preload(path));
  // useGLTF.preload(PATH_TO_BAGSSTORE_MODEL);

  const shoesWithInfo = useMemo(() => {
    return BAGS_ITEMS_CONFIG.map((bag, idx) => ({
      ...bag,
      productInfo: {
        name: `Premium Bag ${idx + 1}`,
        price: (79.99 + idx * 10).toFixed(2),
        description: `High-quality premium footwear designed for comfort and style. Perfect for any occasion.`,
        colors: ["Black", "White", "Red", "Blue"],
        sizes: [7, 8, 9, 10, 11, 12],
        rating: 4 + Math.random(),
        reviews: Math.floor(Math.random() * 100) + 10,
      },
    }));
  }, []);

  return (
    <>
      {shoesWithInfo.map((item, index) => (
        <Suspense key={`bag-item-${index}`} fallback={<Loader />}>
          <BagItem
            path={item.path}
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            index={index}
            onBagClick={onBagClick}
            productInfo={item.productInfo}
          />
        </Suspense>
      ))}
    </>
  );
};

const BagStoreScene = ({ onBagClick, orbitControlsRef }) => {
  //   const store = createXRStore({});
  const { scene } = useGLTF(PATH_TO_BAGSSTORE_MODEL);

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <>
      <ambientLight intensity={AMBIENT_LIGHT_INTENSITY * 0.7} color="#ffffff" />
      <pointLight
        position={[0, 5, 0]}
        intensity={30}
        distance={12}
        decay={2}
        color="#ffffff"
        castShadow
      />
      <pointLight
        position={[3, 4, 3]}
        intensity={15}
        distance={8}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[-3, 4, 3]}
        intensity={15}
        distance={8}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[3, 4, -3]}
        intensity={15}
        distance={8}
        decay={2}
        color="#ffffff"
      />
      <pointLight
        position={[-3, 4, -3]}
        intensity={15}
        distance={8}
        decay={2}
        color="#ffffff"
      />
      <spotLight
        position={[2, 3, 0]}
        intensity={15}
        angle={Math.PI / 5}
        penumbra={0.5}
        distance={10}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-2, 3, 0]}
        intensity={15}
        angle={Math.PI / 5}
        penumbra={0.5}
        distance={10}
        color="#ffffff"
        castShadow
      />

      <Physics gravity={[0, -9.81, 0]}>
        <Suspense fallback={<Loader />}>
          <RigidBody type="fixed">
            <primitive
              object={scene}
              position={BAGSSTORE_SHOP_POSITION}
              rotation={BAGSSTORE_SHOP_ROTATION}
              scale={BAGSSTORE_SHOP_SCALE}
              castShadow
              receiveShadow
            />
          </RigidBody>

          <BagsItemsDisplay onBagClick={onBagClick} />

          <RigidBody type="fixed">
            <mesh
              receiveShadow
              position={[0, -0.01, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={FLOOR_SIZE} />
              <meshStandardMaterial
                color={FLOOR_COLOR}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          </RigidBody>
        </Suspense>
      </Physics>

      <fog attach="fog" args={["#e0e0e0", 10, 50]} />
      <color attach="background" args={["#D9D9D9"]} />
      <OrbitControls ref={orbitControlsRef} />
    </>
  );
};

export default function BagStore() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [cartItems, setCartItems] = useState(0);
  const orbitControlsRef = useRef();

  const [error, setError] = useState(null);

  const onProductClick = (index, data) => {
    setSelectedIndex(index);
    setSelectedInfo(data);
  };

  const closeInfo = () => {
    setSelectedIndex(null);
    setSelectedInfo(null);
  };

  const addToCart = () => {
    setCartItems(cartItems + 1);
    alert(`Bag ${selectedInfo.name} was added to your cart!`);
    closeInfo();
  };

  const resetCamera = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  if (error) {
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div>Error loading shop: {error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: "#4F46E5",
            color: "#ffffff",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Navbar cartItems={cartItems} shopName={"BagsShop"} />
      <ControlsPanel resetCamera={resetCamera} />
      {selectedInfo && (
        <ProductInfoPanel
          selectedInfo={selectedInfo}
          closeInfo={closeInfo}
          addToCart={addToCart}
        />
      )}
      <Canvas
        style={{
          width: "100vw",
          height: "calc(100vh - 60px)",
        }}
        gl={{ antialias: true }}
        shadows="soft"
        camera={{ position: [0.5, 0.5, 0.5] }}
      >
        <Suspense fallback={<Loader />}>
          <BagStoreScene
            onBagClick={onProductClick}
            orbitControlsRef={orbitControlsRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
