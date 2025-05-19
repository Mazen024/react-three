import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getShopAssets,
  getShopDetails,
  deleteShop,
} from "../../Service/shopService";
import styles from "./ShopDetail.module.css";

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        const shopResponse = await getShopDetails(shopId);

        if (shopResponse.success) {
          setShop(shopResponse.data);

          const assetsResponse = await getShopAssets(shopId);

          if (assetsResponse.success) {
            setAssets(assetsResponse.data);
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
      fetchShopData();
    }
  }, [shopId]);

  const handleDeleteShop = async () => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        const response = await deleteShop(shopId);

        if (response.success) {
          alert("Shop deleted successfully");
          navigate("/seller-shop", { replace: true });
        } else {
          alert(`Failed to delete shop: ${response.error}`);
        }
      } catch (err) {
        alert("An error occurred while deleting the shop");
        console.error(err);
      }
    }
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>Loading shop details...</div>
    );
  if (error) return <div className={styles.errorContainer}>Error: {error}</div>;
  if (!shop)
    return <div className={styles.notFoundContainer}>Shop not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.shopName}>{shop.name}</h1>
      </div>
      <div className={styles.detailsSection}>
        <div className={styles.detailCard}>
          <div className={styles.detailTitle}>Category</div>
          <div className={styles.detailValue}>{shop.category}</div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailTitle}>Description</div>
          <div className={styles.detailValue}>{shop.description}</div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailTitle}>Location</div>
          <div className={styles.detailValue}>{shop.location}</div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailTitle}>Email</div>
          <div className={styles.detailValue}>{shop.email}</div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailTitle}>Phone</div>
          <div className={styles.detailValue}>{shop.phone}</div>
        </div>
      </div>
      <h2 className={styles.sectionHeading}>Shop Assets</h2>
      {assets.urls.iconUrl ||
      assets.urls.gltfUrl ||
      assets.urls.binUrl ||
      assets.urls.textureUrl ? (
        <>
          <button
            className={`${styles.button} ${styles.uploadButton}`}
            onClick={() => navigate("./ModelPreview")}
          >
            ModelPreview
          </button>
          <div className={styles.shopAssetsContainer}>
            {assets.urls?.iconUrl && (
              <div className={styles.assetCard}>
                <h3 className={styles.cardTitle}>Shop Icon</h3>
                <img
                  src={assets.urls.iconUrl}
                  alt="Shop Icon"
                  className={styles.assetIconImage}
                />
              </div>
            )}

            {assets.urls?.gltfUrl && (
              <div className={styles.assetCard}>
                <h3 className={styles.cardTitle}>3D Model (GLTF)</h3>
                <div className={styles.cardContent}>{assets.urls.gltfUrl}</div>
              </div>
            )}

            {assets.urls?.binUrl && (
              <div className={styles.assetCard}>
                <h3 className={styles.cardTitle}>Binary Data (BIN)</h3>
                <div className={styles.cardContent}>{assets.urls.binUrl}</div>
              </div>
            )}

            {assets.urls?.textureUrl && (
              <div className={styles.assetCard}>
                <h3 className={styles.cardTitle}>Texture</h3>
                <div className={styles.cardContent}>
                  {assets.urls.textureUrl}
                </div>
              </div>
            )}
          </div>

          <h2 className={styles.sectionHeading}>Shop Coordinates</h2>
          <div className={styles.shopAssetsContainer}>
            {assets.coordinates ? (
              [
                { title: "Position", axes: ["x_pos", "y_pos", "z_pos"] },
                { title: "Scale", axes: ["x_scale", "y_scale", "z_scale"] },
                { title: "Rotation", axes: ["x_rot", "y_rot", "z_rot"] },
              ].map(({ title, axes }) => (
                <div key={title} className={styles.assetCard}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  {axes.map((axis) => (
                    <div key={axis} className={styles.coordinateItem}>
                      <span className={styles.coordinateLabel}>
                        {axis.charAt(0).toUpperCase()}:
                      </span>
                      <span className={styles.coordinateValue}>
                        {assets.coordinates[axis].toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className={styles.errorCard}>
                <p className={styles.errorMessage}>No coordinates Found</p>
                <p className={styles.errorMessage}>Go to Manage Positions</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.errorCard}>
          <p className={styles.errorMessage}>No Assets Found</p>
          <p className={styles.errorMessage}>Go to Manage Assets</p>
        </div>
      )}

      <div className={styles.actionsContainer}>
        <button
          className={`${styles.button} ${styles.editButton}`}
          onClick={() => navigate(`./edit`)}
        >
          Edit Shop
        </button>
        <button
          className={`${styles.button} ${styles.assetsButton}`}
          onClick={() => navigate(`./assets`)}
        >
          Manage Assets & Positions
        </button>
        <button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={handleDeleteShop}
        >
          Delete Shop
        </button>
      </div>
    </div>
  );
};

export default ShopDetail;
