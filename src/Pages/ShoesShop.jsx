/* eslint-disable react/prop-types */
import { Suspense, useMemo, useState, useRef, useEffect } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { MathUtils, FileLoader } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  getShopConstants,
  SHOES_CONFIGURATIONS,
  AMBIENT_LIGHT_INTENSITY,
  FLOOR_SIZE,
  FLOOR_COLOR,
} from "../Constants/ShoesShop";
import Loader from "../Utils/Loader/Loader";
import ProductInfoPanel, {
  PriceTag,
  ControlsPanel,
} from "../Utils/ProductClick/handleProductClick";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

const ShoeItem = ({
  path,
  position,
  rotation,
  scale,
  index,
  onShoeClick,
  productInfo,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const meshRef = useRef();
  const initialY = position[1];

  const { scene } = useGLTF(path);

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
        onShoeClick(index, { ...productInfo, path, position, rotation, scale });
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

const ShoesDisplay = ({ onShoeClick }) => {
  const shoesWithInfo = useMemo(() => {
    return SHOES_CONFIGURATIONS.map((shoe, idx) => ({
      ...shoe,
      productInfo: {
        name: `Premium Shoe ${idx + 1}`,
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
      {shoesWithInfo.map((shoe, index) => (
        <Suspense key={`shoe-${index}`} fallback={<Loader />}>
          <ShoeItem
            path={shoe.path}
            position={shoe.position}
            rotation={shoe.rotation}
            scale={shoe.scale}
            index={index}
            onShoeClick={onShoeClick}
            productInfo={shoe.productInfo}
          />
        </Suspense>
      ))}
    </>
  );
};

// Custom GLTFModel component that handles bin file redirection
const CustomGLTFModel = ({ modelUrl, binUrl, position, rotation, scale }) => {
  const gltfRef = useRef();

  // Load the GLTF model with bin file redirection if needed
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    if (binUrl) {
      const originalLoad = FileLoader.prototype.load;

      // Override the load method to intercept .bin file requests
      FileLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        if (url.includes(".bin") && !url.includes("?sv=")) {
          return originalLoad.call(this, binUrl, onLoad, onProgress, onError);
        }
        return originalLoad.call(this, url, onLoad, onProgress, onError);
      };

      // Cleanup function to restore original load method
      return () => {
        FileLoader.prototype.load = originalLoad;
      };
    }
  });

  // Apply position, rotation, and scale
  useEffect(() => {
    if (gltfRef.current) {
      gltfRef.current.position.set(position[0], position[1], position[2]);
      gltfRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      gltfRef.current.scale.set(scale[0], scale[1], scale[2]);
    }
  }, [position, rotation, scale]);

  // Apply material properties and shadows
  useMemo(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.name.includes("door")) {
            child.material.color.set("#C4A484");
            child.material.roughness = 0.4;
            child.material.metalness = 0.1;
          }
        }
      });
    }
  }, [gltf]);

  return <primitive ref={gltfRef} object={gltf?.scene} />;
};

const ShoeShopScene = ({ onShoeClick, orbitControlsRef, shopConfig }) => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <ambientLight
          intensity={AMBIENT_LIGHT_INTENSITY * 0.7}
          color="#ffffff"
        />
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
            {shopConfig.MODEL_URL && (
              <RigidBody type="fixed">
                <CustomGLTFModel
                  modelUrl={shopConfig.MODEL_URL}
                  binUrl={shopConfig.BIN_URL}
                  position={shopConfig.SHOP_POSITION}
                  rotation={shopConfig.SHOP_ROTATION}
                  scale={shopConfig.SHOP_SCALE}
                />
              </RigidBody>
            )}

            <ShoesDisplay onShoeClick={onShoeClick} />

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
      </Suspense>
    </>
  );
};

export default function ShoesShop() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [cartItems, setCartItems] = useState(0);
  const orbitControlsRef = useRef();
  const { shopId } = useParams();

  const [error, setError] = useState(null);
  const [shopConfig, setShopConfig] = useState({
    MODEL_URL: "",
    BIN_URL: "",
    SHOP_POSITION: [0, 0, 0],
    SHOP_ROTATION: [0, 0, 0],
    SHOP_SCALE: [1, 1, 1],
  });

  // Load shop constants when component mounts
  useEffect(() => {
    const loadConstants = async () => {
      try {
        const id = shopId || "default";
        const constants = await getShopConstants(id);

        // Update shop config with loaded data
        setShopConfig(constants);
      } catch (e) {
        console.error("Failed to load shop constants:", e);
        setError(e.message);
      }
    };

    loadConstants();
  }, [shopId]);

  // Only preload models when we have valid URLs
  useEffect(() => {
    if (shopConfig.MODEL_URL) {
      // Don't preload here since we're using custom loader with bin file redirection

      // Preload shoe models
      SHOES_CONFIGURATIONS.forEach((shoe) => {
        useGLTF.preload(shoe.path);
      });
    }
  }, [shopConfig.MODEL_URL]);

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
    alert(`Shoes ${selectedInfo.name} was added to your cart!`);
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
      <Navbar cartItems={cartItems} shopName={"ShoesShop"} />
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
          <ShoeShopScene
            onShoeClick={onProductClick}
            orbitControlsRef={orbitControlsRef}
            shopConfig={shopConfig}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
