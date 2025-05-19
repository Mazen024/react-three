import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getShopAssets,
  uploadShopAssets,
  getShopDetails,
  updateShopCoordinates,
} from "../../Service/shopService";
import styles from "./ShopAssets.module.css";

const ShopAssets = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [files, setFiles] = useState({
    gltf: null,
    bin: null,
    icon: null,
    texture: null,
  });

  const [previews, setPreviews] = useState({
    icon: null,
  });

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

  const [isEditingCoordinates, setIsEditingCoordinates] = useState(false);
  const [updatingCoordinates, setUpdatingCoordinates] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const shopResponse = await getShopDetails(shopId);

        if (shopResponse.success) {
          setShop(shopResponse.data);

          const assetsResponse = await getShopAssets(shopId);

          if (assetsResponse.success) {
            setAssets(assetsResponse.data);

            // Initialize coordinates state if available
            if (assetsResponse.data?.coordinates) {
              setCoordinates(assetsResponse.data.coordinates);
            }
          }
        } else {
          setError(shopResponse.error || "Failed to fetch shop details");
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

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setCoordinates((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleCoordinatesSubmit = async (e) => {
    e.preventDefault();
    setUpdatingCoordinates(true);
    setError(null);

    try {
      const response = await updateShopCoordinates(shopId, coordinates);

      if (response.success) {
        alert("Shop coordinates updated successfully!");
        setIsEditingCoordinates(false);

        // Refresh assets to get updated coordinates
        const assetsResponse = await getShopAssets(shopId);
        if (assetsResponse.success) {
          setAssets(assetsResponse.data);
        }
      } else {
        setError(response.error || "Failed to update coordinates");
      }
    } catch (err) {
      setError("An error occurred while updating coordinates");
      console.error("Update error:", err);
    } finally {
      setUpdatingCoordinates(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset coordinates to the original values from the API
    if (assets?.coordinates) {
      setCoordinates(assets.coordinates);
    }
    setIsEditingCoordinates(false);
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: selectedFiles[0],
      }));

      if (name === "icon" && selectedFiles[0].type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviews((prev) => ({
            ...prev,
            icon: event.target.result,
          }));
        };
        reader.readAsDataURL(selectedFiles[0]);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const hasFiles = Object.values(files).some((file) => file !== null);
    if (!hasFiles) {
      setError("Please select at least one file to upload");
      setUploading(false);
      return;
    }

    // Validate file types and sizes
    const validateFile = (file, allowedTypes, maxSizeMB = 1000) => {
      if (!file) return true;

      // Check file type with more flexible matching
      const isValidType = allowedTypes.some((type) => {
        // Check MIME type or file extension
        return (
          file.type === type ||
          file.type.includes(type) ||
          file.name
            .toLowerCase()
            .endsWith(type.replace("image/", ".").replace("model/", "."))
        );
      });

      // Check file size (max 10MB)
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

      return {
        isValid: isValidType && isValidSize,
        error: !isValidType
          ? `Invalid file type. Allowed: ${allowedTypes.join(", ")}`
          : !isValidSize
          ? `File too large (max ${maxSizeMB}MB)`
          : null,
      };
    };

    // Validate each file with strict type checking
    const validations = {
      gltf: validateFile(files.gltf, [
        "model/gltf+json",
        "model/gltf-binary",
        ".gltf",
        ".glb",
      ]),
      bin: validateFile(files.bin, ["application/octet-stream", ".bin"]),
      icon: validateFile(files.icon, [
        "image/png",
        "image/jpeg",
        ".png",
        ".jpg",
        ".jpeg",
      ]),
      texture: validateFile(files.texture, [
        "image/png",
        "image/jpeg",
        ".png",
        ".jpg",
        ".jpeg",
      ]),
    };

    // Check if any validation failed
    const validationErrors = Object.entries(validations)
      .filter(([key, validation]) => files[key] && !validation.isValid)
      .map(([key, validation]) => `${key}: ${validation.error}`);

    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          if (key === "gltf") {
            const gltfBlob = new Blob([file], { type: "model/gltf+json" });
            formData.append(key, gltfBlob, file.name);
          } else {
            formData.append(key, file);
          }
        }
      });

      const response = await uploadShopAssets(shopId, formData);

      if (response.success) {
        alert("Assets uploaded successfully!");
        const assetsResponse = await getShopAssets(shopId);
        if (assetsResponse.success) {
          setAssets(assetsResponse.data);
        }

        // Reset form
        setFiles({
          gltf: null,
          bin: null,
          icon: null,
          texture: null,
        });
        setPreviews({ icon: null });

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => {
          input.value = "";
        });
      } else {
        setError(response.error || "Failed to upload assets");
        console.error("Upload response:", response);
      }
    } catch (err) {
      setError("An error occurred while uploading assets");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className={styles.loadingContainer}>Loading...</div>;
  if (error && !shop)
    return <div className={styles.errorMessage}>Error: {error}</div>;
  if (!shop) return <div className={styles.errorMessage}>Shop not found</div>;

  return (
    <div className={styles.shopAssetsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Manage Assets&Posintion for {shop.name}
        </h1>
      </div>

      {error && <div className={styles.errorMessage}>Error: {error}</div>}

      <div className={styles.currentAssets}>
        <>
          <div className={styles.coordinatesSection}>
            <h2 className={styles.sectionTitle}>
              3D Positioning
              {!isEditingCoordinates && (
                <button
                  type="button"
                  className={styles.editCoordinatesButton}
                  onClick={() => setIsEditingCoordinates(true)}
                >
                  Edit
                </button>
              )}
            </h2>

            {isEditingCoordinates ? (
              <form
                className={styles.coordinatesForm}
                onSubmit={handleCoordinatesSubmit}
              >
                <div className={styles.coordinatesFormGrid}>
                  <div className={styles.coordinatesFormGroup}>
                    <h3 className={styles.coordinatesTitle}>Position</h3>
                    {["x_pos", "y_pos", "z_pos"].map((axis) => (
                      <div key={axis} className={styles.coordinateInputGroup}>
                        <label className={styles.coordinateInputLabel}>
                          {axis.charAt(0).toUpperCase()}:
                        </label>
                        <input
                          type="number"
                          name={axis}
                          value={coordinates[axis]}
                          onChange={handleCoordinateChange}
                          className={styles.coordinateInput}
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.coordinatesFormGroup}>
                    <h3 className={styles.coordinatesTitle}>Scale</h3>
                    {["x_scale", "y_scale", "z_scale"].map((axis) => (
                      <div key={axis} className={styles.coordinateInputGroup}>
                        <label className={styles.coordinateInputLabel}>
                          {axis.charAt(0).toUpperCase()}:
                        </label>
                        <input
                          type="number"
                          name={axis}
                          value={coordinates[axis]}
                          onChange={handleCoordinateChange}
                          className={styles.coordinateInput}
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.coordinatesFormGroup}>
                    <h3 className={styles.coordinatesTitle}>Rotation</h3>
                    {["x_rot", "y_rot", "z_rot"].map((axis) => (
                      <div key={axis} className={styles.coordinateInputGroup}>
                        <label className={styles.coordinateInputLabel}>
                          {axis.charAt(0).toUpperCase()}:
                        </label>
                        <input
                          type="number"
                          name={axis}
                          value={coordinates[axis]}
                          onChange={handleCoordinateChange}
                          className={styles.coordinateInput}
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.coordinatesFormActions}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.cancelButton}`}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.saveButton}`}
                    disabled={updatingCoordinates}
                  >
                    {updatingCoordinates ? "Saving..." : "Save Coordinates"}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.coordinatesGrid}>
                <div className={styles.coordinatesGroup}>
                  <h3 className={styles.coordinatesTitle}>Position</h3>
                  {["x_pos", "y_pos", "z_pos"].map((axis) => (
                    <div key={axis} className={styles.coordinateItem}>
                      <span className={styles.coordinateLabel}>
                        {axis.charAt(0).toUpperCase()}:
                      </span>
                      <span className={styles.coordinateValue}>
                        {(assets.coordinates
                          ? assets.coordinates[axis]
                          : coordinates[axis]
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.coordinatesGroup}>
                  <h3 className={styles.coordinatesTitle}>Scale</h3>
                  {["x_scale", "y_scale", "z_scale"].map((axis) => (
                    <div key={axis} className={styles.coordinateItem}>
                      <span className={styles.coordinateLabel}>
                        {axis.charAt(0).toUpperCase()}:
                      </span>
                      <span className={styles.coordinateValue}>
                        {(assets.coordinates
                          ? assets.coordinates[axis]
                          : coordinates[axis]
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.coordinatesGroup}>
                  <h3 className={styles.coordinatesTitle}>Rotation</h3>
                  {["x_rot", "y_rot", "z_rot"].map((axis) => (
                    <div key={axis} className={styles.coordinateItem}>
                      <span className={styles.coordinateLabel}>
                        {axis.charAt(0).toUpperCase()}:
                      </span>
                      <span className={styles.coordinateValue}>
                        {(assets.coordinates
                          ? assets.coordinates[axis]
                          : coordinates[axis]
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      </div>

      <div className={styles.uploadAssets}>
        <h2 className={styles.sectionTitle}>Upload New Assets</h2>

        <form className={styles.form} onSubmit={handleUpload}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="icon">
              Shop Icon (PNG, JPG)
            </label>
            <input
              className={styles.fileInput}
              type="file"
              id="icon"
              name="icon"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {previews.icon && (
              <div className={styles.filePreview}>
                <img
                  src={previews.icon}
                  alt="Icon Preview"
                  className={styles.assetIcon}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="gltf">
              3D Model (GLTF)
            </label>
            <input
              className={styles.fileInput}
              type="file"
              id="gltf"
              name="gltf"
              accept=".gltf,.glb"
              onChange={handleFileChange}
            />
            {files.gltf && (
              <div className={styles.fileInfo}>
                Selected: {files.gltf.name} (
                {Math.round(files.gltf.size / 1024)} KB)
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="bin">
              Binary Data (BIN)
            </label>
            <input
              className={styles.fileInput}
              type="file"
              id="bin"
              name="bin"
              accept=".bin"
              onChange={handleFileChange}
            />
            {files.bin && (
              <div className={styles.fileInfo}>
                Selected: {files.bin.name} ({Math.round(files.bin.size / 1024)}{" "}
                KB)
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="texture">
              Texture (PNG, JPG)
            </label>
            <input
              className={styles.fileInput}
              type="file"
              id="texture"
              name="texture"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {files.texture && (
              <div className={styles.fileInfo}>
                Selected: {files.texture.name} (
                {Math.round(files.texture.size / 1024)} KB)
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.backButton}`}
              onClick={() => navigate(-1)}
            >
              Back to Shop
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.uploadButton}`}
              disabled={uploading || !Object.values(files).some((f) => f)}
            >
              {uploading ? "Uploading..." : "Upload Assets"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopAssets;
