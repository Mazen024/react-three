/* eslint-disable react/prop-types */
import {
  Suspense,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  OrbitControls,
  useGLTF,
  Environment,
  PerspectiveCamera,
  Html,
  Text,
  useProgress,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3, MathUtils } from "three";
import {
  PATH_TO_SHOESSHOP_MODEL,
  SHOES_CONFIGURATIONS,
  SHOESSHOP_SHOP_POSITION,
  SHOESSHOP_SHOP_ROTATION,
  SHOESSHOP_SHOP_SCALE,
  AMBIENT_LIGHT_INTENSITY,
  FLOOR_SIZE,
  FLOOR_COLOR,
} from "../Constants/ShoesShop";
import styles from "./ProductInfoPanel.module.css";
import notificationStyles from "./ProductInfoPanel.module.css";
import cartStyles from "./ProductInfoPanel.module.css";

// Custom loader with progress indicator
const CustomLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-700">
          {Math.round(progress)}% loaded
        </p>
      </div>
    </Html>
  );
};

// Price tag component for shoe items
const PriceTag = ({ price, name, visible }) => {
  if (!visible) return null;

  return (
    <Html position={[0, 0.1, 0]} center>
      <div className="bg-black bg-opacity-75 text-white p-2 rounded-md text-center pointer-events-none">
        <p className="font-bold">{name}</p>
        <p>${price}</p>
      </div>
    </Html>
  );
};

// Enhanced shoe item with animations
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

  // Hover animation effect
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
      <primitive object={clonedScene} />
      <PriceTag
        price={productInfo.price}
        name={productInfo.name}
        visible={showLabel}
      />
    </group>
  );
};

// Camera controller for smooth transitions
const CameraController = ({ focusPosition, isFocused, resetView }) => {
  const { camera } = useThree();
  const controls = useRef();

  const defaultPosition = useMemo(() => new Vector3(-0.5, 0.5, 0.5), []);
  const targetPosition = useMemo(
    () =>
      isFocused
        ? new Vector3(...focusPosition).add(new Vector3(0.3, 0.2, 0.3))
        : defaultPosition,
    [isFocused, focusPosition, defaultPosition]
  );

  useFrame((_, delta) => {
    if (controls.current) {
      if (isFocused) {
        // Smoothly move camera to focus on selected item
        camera.position.lerp(targetPosition, delta * 2);
        controls.current.target.lerp(new Vector3(...focusPosition), delta * 2);
      } else if (resetView) {
        // Smoothly reset camera to default view
        camera.position.lerp(defaultPosition, delta * 2);
        controls.current.target.lerp(new Vector3(0, 0, 0), delta * 2);
      }
      controls.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enableZoom={!isFocused}
      enableRotate={!isFocused}
      enablePan={!isFocused}
    />
  );
};

// Displays all shoes with product info
const ShoesDisplay = ({ onShoeClick }) => {
  // Add product info to each shoe configuration
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
        <Suspense key={`shoe-${index}`} fallback={null}>
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

// Shop environment setup
const ShoeShopScene = ({ onShoeClick, focusedItem, resetCamera }) => {
  const { scene: shoesShopModel } = useGLTF(PATH_TO_SHOESSHOP_MODEL);

  // Enhanced shop model with better materials
  useMemo(() => {
    shoesShopModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.includes("door")) {
          child.material.color.set("#C4A484");
          child.material.roughness = 0.4;
          child.material.metalness = 0.1;
        }

        // Add better materials to shop elements
        if (child.name.includes("shelf") || child.name.includes("display")) {
          child.material.roughness = 0.3;
          child.material.metalness = 0.2;
        }

        if (child.name.includes("wall") || child.name.includes("ceiling")) {
          child.material.roughness = 0.7;
        }
      }
    });
  }, [shoesShopModel]);

  // Determine if camera should focus on a specific item
  const isFocused = focusedItem !== null;
  const focusPosition = isFocused ? focusedItem.position : [0, 0, 0];

  return (
    <>
      <Suspense fallback={<CustomLoader />}>
        {/* Advanced lighting setup */}
        <ambientLight
          intensity={AMBIENT_LIGHT_INTENSITY * 0.5}
          color="#ffffff"
        />

        {/* Main lighting */}
        <pointLight
          position={[0, 5, 0]}
          intensity={20}
          distance={15}
          decay={2}
          color="#ffffff"
          castShadow
          // eslint-disable-next-line react/no-unknown-property
          shadow-mapSize={[2048, 2048]}
        />

        {/* Corner lights */}
        <pointLight
          position={[3, 4, 3]}
          intensity={10}
          distance={8}
          decay={2}
          color="#f8f4e6"
        />
        <pointLight
          position={[-3, 4, 3]}
          intensity={10}
          distance={8}
          decay={2}
          color="#f8f4e6"
        />
        <pointLight
          position={[3, 4, -3]}
          intensity={10}
          distance={8}
          decay={2}
          color="#f8f4e6"
        />
        <pointLight
          position={[-3, 4, -3]}
          intensity={10}
          distance={8}
          decay={2}
          color="#f8f4e6"
        />

        {/* Spotlight for dramatic accents */}
        <spotLight
          position={[2, 3, 0]}
          intensity={12}
          angle={Math.PI / 5}
          penumbra={0.5}
          distance={10}
          color="#ffffff"
          castShadow
        />
        <spotLight
          position={[-2, 3, 0]}
          intensity={12}
          angle={Math.PI / 5}
          penumbra={0.5}
          distance={10}
          color="#ffffff"
          castShadow
        />

        {/* Add environment for reflections */}
        <Environment preset="sunset" />

        <Physics gravity={[0, -9.81, 0]}>
          <Suspense fallback={null}>
            {/* Shop model */}
            <RigidBody type="fixed">
              <primitive
                object={shoesShopModel}
                position={SHOESSHOP_SHOP_POSITION}
                rotation={SHOESSHOP_SHOP_ROTATION}
                scale={SHOESSHOP_SHOP_SCALE}
                castShadow
                receiveShadow
              />
            </RigidBody>

            {/* Shoes display */}
            <ShoesDisplay onShoeClick={onShoeClick} />

            {/* Floor */}
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

        {/* Shop atmosphere */}
        <fog attach="fog" args={["#e0e0e0", 10, 50]} />
        <color attach="background" args={["#D9D9D9"]} />

        {/* Camera control system */}
        <CameraController
          focusPosition={focusPosition}
          isFocused={isFocused}
          resetView={resetCamera}
        />

        {/* Default camera */}
        <PerspectiveCamera makeDefault position={[-0.5, 0.5, 0.5]} />
      </Suspense>
    </>
  );
};

// ProductInfoPanel component
const ProductInfoPanel = ({ selectedInfo, closeInfo, addToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const canAddToCart = selectedSize && selectedColor;

  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
  }, [selectedInfo?.name]);

  if (!selectedInfo) return null;

  return (
    <div className={styles.productInfoPanel}>
      <button onClick={closeInfo} className={styles.closeButton}>
        ✕
      </button>

      <h2 className={styles.productTitle}>{selectedInfo.name}</h2>

      <div className={styles.ratingContainer}>
        <div className={styles.starRating}>
          {"★".repeat(Math.floor(selectedInfo.rating))}
          {selectedInfo.rating % 1 >= 0.5 ? "½" : ""}
          {"☆".repeat(5 - Math.ceil(selectedInfo.rating))}
        </div>
        <span className={styles.reviewCount}>
          ({selectedInfo.reviews} reviews)
        </span>
      </div>

      <div className={styles.productPrice}>${selectedInfo.price}</div>
      <p className={styles.productDescription}>{selectedInfo.description}</p>

      <div className={styles.colorSelection}>
        <h3 className={styles.sectionTitle}>Color</h3>
        <div className={styles.colorOptions}>
          {selectedInfo.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`${styles.colorButton} ${
                selectedColor === color ? styles.selected : ""
              }`}
              style={{
                backgroundColor: color.toLowerCase(),
                color: ["White", "Yellow"].includes(color) ? "#000" : "#fff",
              }}
              title={color}
            >
              {selectedColor === color ? "✓" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.sizeSelection}>
        <h3 className={styles.sectionTitle}>Size</h3>
        <div className={styles.sizeOptions}>
          {selectedInfo.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`${styles.sizeButton} ${
                selectedSize === size ? styles.selected : ""
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.quantitySelection}>
        <h3 className={styles.sectionTitle}>Quantity</h3>
        <div className={styles.quantityInput}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className={`${styles.quantityButton} ${styles.decrease}`}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className={styles.quantityValue}
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className={`${styles.quantityButton} ${styles.increase}`}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => addToCart(selectedSize, selectedColor, quantity)}
        disabled={!canAddToCart}
        className={`${styles.addCartButton} ${
          !canAddToCart ? styles.disabled : ""
        }`}
      >
        {canAddToCart ? "Add to Cart" : "Select Size & Color"}
      </button>

      {!canAddToCart && (
        <p className={styles.validationMessage}>
          Please select both size and color
        </p>
      )}
    </div>
  );
};

// CartNotification component

const CartNotification = ({ item, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible || !item) return null;

  return (
    <div className={notificationStyles.cartNotification}>
      <div className={notificationStyles.notificationContent}>
        <div className={notificationStyles.checkIconContainer}>
          <svg
            className={notificationStyles.checkIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className={notificationStyles.notificationText}>
          <p className={notificationStyles.notificationTitle}>Added to Cart!</p>
          <p className={notificationStyles.notificationDetails}>
            {item.name} - {item.color}, Size {item.size} (Qty: {item.quantity})
          </p>
        </div>
        <button
          onClick={onClose}
          className={notificationStyles.notificationClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

// CartIndicator component

const CartIndicator = ({ count, onClick }) => {
  if (count === 0) return null;

  return (
    <button onClick={onClick} className={cartStyles.cartIndicator}>
      <div className={cartStyles.cartIconContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cartStyles.cartIcon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17
            m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className={cartStyles.cartCount}>{count}</span>
      </div>
    </button>
  );
};

// Main component
export default function ShoesShop() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [resetCameraView, setResetCameraView] = useState(false);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Preload models
  useGLTF.preload(PATH_TO_SHOESSHOP_MODEL);
  SHOES_CONFIGURATIONS.forEach((shoe) => {
    useGLTF.preload(shoe.path);
  });

  // Product selection handler
  const onProductClick = useCallback((index, data) => {
    setSelectedIndex(index);
    setSelectedInfo(data.productInfo);
    setResetCameraView(false);
  }, []);

  // Close product info panel
  const closeInfo = useCallback(() => {
    setSelectedIndex(null);
    setSelectedInfo(null);
    setResetCameraView(true);

    // Reset the camera reset flag after a delay
    setTimeout(() => setResetCameraView(false), 2000);
  }, []);

  // Add product to cart
  const addToCart = useCallback(
    (size, color, quantity) => {
      const newItem = {
        id: Date.now(),
        name: selectedInfo.name,
        price: selectedInfo.price,
        size,
        color,
        quantity,
      };

      setCart((prev) => [...prev, newItem]);
      setNotification(newItem);
      setShowNotification(true);
      closeInfo();
    },
    [selectedInfo, closeInfo]
  );

  // Close notification
  const closeNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  // Show cart contents
  const showCart = useCallback(() => {
    if (cart.length === 0) return;

    const total = cart
      .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);

    alert(
      `Cart Contents:\n\n${cart
        .map(
          (item) =>
            `${item.name} - ${item.color}, Size ${item.size} (Qty: ${
              item.quantity
            }) - $${(parseFloat(item.price) * item.quantity).toFixed(2)}`
        )
        .join("\n")}\n\nTotal: $${total}`
    );
  }, [cart]);

  // Get the focused item's position if selected
  const focusedItem =
    selectedIndex !== null ? SHOES_CONFIGURATIONS[selectedIndex] : null;

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
      }}
    >
      {" "}
      {/* Product info panel */}
      {selectedInfo && (
        <ProductInfoPanel
          selectedInfo={selectedInfo}
          closeInfo={closeInfo}
          addToCart={addToCart}
        />
      )}
      {/* Cart indicator */}
      <CartIndicator count={cart.length} onClick={showCart} />
      {/* Cart notification */}
      <CartNotification
        item={notification}
        visible={showNotification}
        onClose={closeNotification}
      />
      {/* 3D Canvas */}
      <Canvas
        style={{ width: "100vw", height: "100vh", flexGrow: 1 }}
        gl={{ antialias: true }}
        shadows="soft"
        camera={{ position: [-0.5, 0.5, 0.5], fov: 50 }}
      >
        <Suspense fallback={<CustomLoader />}>
          <ShoeShopScene
            onShoeClick={onProductClick}
            focusedItem={focusedItem}
            resetCamera={resetCameraView}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
