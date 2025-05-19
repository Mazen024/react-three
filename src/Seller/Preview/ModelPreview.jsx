import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShopAssets } from "../../Service/shopService";
import styles from "./ModelPreview.module.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PropTypes from "prop-types";
import * as THREE from "three";

const GltfModel = ({ modelData, coordinates }) => {
  const ref = useRef();

  const gltf = useLoader(GLTFLoader, modelData.gltfUrl, (loader) => {
    const originalLoad = THREE.FileLoader.prototype.load;

    THREE.FileLoader.prototype.load = function (
      url,
      onLoad,
      onProgress,
      onError
    ) {
      // Handle .bin file requests
      if (url.includes(".bin") && !url.includes("?sv=")) {
        console.log("Intercepting bin file request:", url);
        if (modelData.binUrl) {
          console.log("Redirecting to bin URL:", modelData.binUrl);
          return originalLoad.call(
            this,
            modelData.binUrl,
            onLoad,
            onProgress,
            onError
          );
        }
      }

      // Handle texture file requests
      const textureExtensions = [".jpg", ".jpeg", ".png"];
      const isTexture = textureExtensions.some((ext) =>
        url.toLowerCase().endsWith(ext)
      );
      if (url.includes(".jpg") && !url.includes("?sv=")) {
        console.log("Intercepting texture file request:", url);
        const filename = url.split("/").pop();
        const textureUrl = modelData.textureUrls?.find((t) =>
          t.includes(filename)
        );
        if (textureUrl) {
          console.log("Redirecting to texture URL:", textureUrl);
          return originalLoad.call(
            this,
            textureUrl,
            onLoad,
            onProgress,
            onError
          );
        } else {
          console.warn(`No matching texture URL found for: ${filename}`);
          // Fallback: Proceed with original URL or handle error
          return originalLoad.call(this, url, onLoad, onProgress, onError);
        }
      }

      return originalLoad.call(this, url, onLoad, onProgress, onError);
    };

    // Cleanup: Restore the original load method
    return () => {
      THREE.FileLoader.prototype.load = originalLoad;
    };
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(
        coordinates.x_pos,
        coordinates.y_pos,
        coordinates.z_pos
      );

      ref.current.scale.set(
        coordinates.x_scale,
        coordinates.y_scale,
        coordinates.z_scale
      );

      ref.current.rotation.set(
        coordinates.x_rot,
        coordinates.y_rot,
        coordinates.z_rot
      );
    }
  }, [coordinates]);

  return <primitive object={gltf.scene} ref={ref} />;
};

GltfModel.propTypes = {
  modelData: PropTypes.shape({
    gltfUrl: PropTypes.string.isRequired,
    binUrl: PropTypes.string,
    textureUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  coordinates: PropTypes.shape({
    x_pos: PropTypes.number,
    y_pos: PropTypes.number,
    z_pos: PropTypes.number,
    x_scale: PropTypes.number,
    y_scale: PropTypes.number,
    z_scale: PropTypes.number,
    x_rot: PropTypes.number,
    y_rot: PropTypes.number,
    z_rot: PropTypes.number,
  }).isRequired,
};

const ErrorFallback = ({ error }) => {
  return (
    <div className={styles.errorContainer}>
      <h3>Error Loading 3D Model</h3>
      <details>
        <summary>View Error Details</summary>
        <pre>{error.message}</pre>
      </details>
      <p>Please check your model files and permissions.</p>
    </div>
  );
};
ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};

const ShopAssets = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [modelData, setModelData] = useState({
    gltfUrl: null,
    binUrl: null,
    textureUrls: [],
    iconUrl: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [coordinates, setCoordinates] = useState({
    x_pos: 0,
    y_pos: 0,
    z_pos: 0,
    x_scale: 1,
    y_scale: 1,
    z_scale: 1,
    x_rot: 0,
    y_rot: 0,
    z_rot: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const assetsResponse = await getShopAssets(shopId);

        if (assetsResponse.success) {
          setModelData({
            gltfUrl: assetsResponse.data.urls.gltfUrl,
            binUrl: assetsResponse.data.urls.binUrl,
            textureUrls: assetsResponse.data.urls.textureUrls || [],
            iconUrl: assetsResponse.data.urls.iconUrl,
          });

          if (assetsResponse.data?.coordinates) {
            setCoordinates(assetsResponse.data.coordinates);
          }
        } else {
          setError(assetsResponse.error || "Failed to fetch shop details");
        }
      } catch (err) {
        setError("An error occurred while fetching shop data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchData();
    }
  }, [shopId]);

  if (loading) return <div className={styles.loadingContainer}>Loading...</div>;
  if (error && !modelData.gltfUrl)
    return <ErrorFallback error={new Error(error)} />;
  if (!modelData.gltfUrl)
    return <div className={styles.errorMessage}>3D Model not found</div>;

  return (
    <div className={styles.shopAssetsPage}>
      <h2>3D Model Preview</h2>

      <div className={styles.canvasWrapper}>
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense
            fallback={
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            }
          >
            {modelData.gltfUrl && modelData.binUrl && (
              <GltfModel modelData={modelData} coordinates={coordinates} />
            )}
            <Environment preset="city" />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>

      {modelData.gltfUrl && (
        <div className={styles.modelInfo}>
          <h3>Model Information</h3>
          <p>GLTF URL: {modelData.gltfUrl ? "✓ Available" : "✕ Missing"}</p>
          <p>BIN URL: {modelData.binUrl ? "✓ Available" : "⚠️ Missing"}</p>
          <p>
            Texture URLs:{" "}
            {modelData.textureUrls.length > 0
              ? `✓ ${modelData.textureUrls.length} Available`
              : "⚠️ Missing"}
          </p>

          <details>
            <summary>Debug Information</summary>
            <div className={styles.debugInfo}>
              <p>
                <strong>GLTF:</strong> {modelData.gltfUrl}
              </p>
              <p>
                <strong>BIN:</strong> {modelData.binUrl}
              </p>
              <p>
                <strong>Textures:</strong>{" "}
                {modelData.textureUrls.length > 0
                  ? modelData.textureUrls.join(", ")
                  : "None"}
              </p>
            </div>
          </details>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Back to Model Page
        </button>
      </div>
    </div>
  );
};

export default ShopAssets;
