import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllShops } from "../../Service/shopService";
import styles from "./ShopList.module.css";

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (shops.length > 0) {
      const uniqueCategories = [
        ...new Set(shops.map((shop) => shop.category)),
      ].filter(Boolean);
      setCategories(uniqueCategories);
    }
  }, [shops]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await getAllShops(page, 10);
        if (response.success) {
          setShops(response.data.content || []);
          setTotalPages(response.data.totalPages || 0);
        } else {
          setError(response.error || "Failed to fetch shops");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching shops");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page + 1 < totalPages) setPage(page + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || shop.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading shops...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.shopList}>
      <div className={styles.header}>
        <h2>All Shops</h2>
        <button onClick={() => navigate(`./create`)}>+ Create Shop</button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search shops..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {categories.length > 0 && (
          <select
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        )}
      </div>

      {filteredShops.length === 0 ? (
        <p className={styles.noShops}>
          {shops.length === 0
            ? "No shops found"
            : "No shops match your search criteria"}
        </p>
      ) : (
        <div className={styles.shopGrid}>
          {filteredShops.map((shop) => (
            <div key={shop.id} className={styles.shopCard}>
              {shop.imageUrl && (
                <div className={styles.shopImage}>
                  <img src={shop.imageUrl} alt={shop.name} />
                </div>
              )}
              <h3>{shop.name}</h3>
              <p>{shop.description}</p>
              {shop.category && (
                <span className={styles.category}>{shop.category}</span>
              )}
              <button
                className={styles.viewDetails}
                onClick={() => navigate(`./details/${shop.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={handlePrevPage} disabled={page === 0}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={page + 1 >= totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopList;
