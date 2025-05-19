/* eslint-disable react/prop-types */
import { Html } from "@react-three/drei";
import styles from "./ProductInfoPanel.module.css";

export const PriceTag = ({ price, name, visible }) => {
  if (!visible) return null;

  return (
    <Html position={[0, 0.2, 0]} center style={{ pointerEvents: "none" }}>
      <div
        className={`${styles.container} ${
          visible ? styles.visible : styles.hidden
        }`}
      >
        <p className={styles.name}>{name}</p>
        <p className={styles.price}>${price}</p>
        <div className={styles.tag}>Click to view</div>
      </div>
    </Html>
  );
};

export const ProductInfoPanel = ({ selectedInfo, closeInfo, addToCart }) => {
  if (!selectedInfo) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>{selectedInfo.name}</h3>
        <button className={styles.vrButton}>VR View</button>
        <button className={styles.closeButton} onClick={closeInfo} aria-label="Close panel">
          ×
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.modelSection}>
            <p className={styles.label}>Model</p>
            <p className={styles.text}>{selectedInfo.model}</p>
          </div>
          <div>
            <p className={styles.label}>Description</p>
            <p className={styles.description}>{selectedInfo.description}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h4 className={styles.specsTitle}>Specifications</h4>
          <div className={styles.specificationsGrid}>
            <div className={styles.specItem}>
              <p className={styles.label}>Availability</p>
              <p className={styles.inStock}>In Stock</p>
            </div>

            <div className={styles.specItem}>
              <p className={styles.label}>Category</p>
              <p className={styles.specText}>Electronics</p>
            </div>

            <div className={styles.specItem}>
              <p className={styles.label}>SKU</p>
              <p className={styles.specText}>PRD-{selectedInfo.model}</p>
            </div>

            <div className={styles.specItem}>
              <p className={styles.label}>Warranty</p>
              <p className={styles.specText}>2 Years</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.addButton} onClick={addToCart}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
            >
              <path
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M16 17a2 2 0 100 4 2 2 0 000-4zm0 0H9m0 0a2 2 0 100 4 2 2 0 000-4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
          Add to Cart
        </button>
        <button className={styles.cancelButton} onClick={closeInfo}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export const ControlsPanel = ({ resetCamera }) => {
  return (
    <div className={styles.controlsPanel}>
      <button className={styles.resetButton} onClick={resetCamera}>
        Reset View
      </button>
    </div>
  );
};

export default ProductInfoPanel;