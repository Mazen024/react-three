import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateShopDetails, getShopDetails } from "../../Service/shopService";
import styles from "./EditShop.module.css";

const EditShop = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchShopDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getShopDetails(shopId);

        if (response.success) {
          const shop = response.data;
          setFormData({
            name: shop.name || "",
            category: shop.category || "",
            location: shop.location || "",
            description: shop.description || "",
            email: shop.email || "",
            phone: shop.phone || "",
          });
        } else {
          setError(response.error || "Failed to fetch shop details");
        }
      } catch (err) {
        setError("An error occurred while fetching shop details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Shop name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Shop name must be at least 3 characters";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (
      formData.phone.trim() &&
      !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
        formData.phone
      )
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must be logged in to update shop details");
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "",
      };

      const response = await updateShopDetails(shopId, submitData);

      if (response.success) {
        alert("Shop updated successfully!");
        navigate(-1);
      } else {
        if (response.validationErrors) {
          setValidationErrors(response.validationErrors);
        } else if (response.statusCode === 403) {
          setError("You are not authorized to update this shop");
        } else if (response.statusCode === 400) {
          setError("Validation failed: " + response.error);
        } else {
          setError(response.error || "Failed to update shop");
        }
      }
    } catch (err) {
      setError("An error occurred while updating the shop");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className={styles.loadingContainer}>Loading shop details...</div>
    );
  if (error && !formData.name)
    return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div className={styles.editShop}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Shop</h1>
      </div>

      {error && <div className={styles.errorMessage}>Error: {error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            Shop Name
          </label>
          <input
            className={styles.input}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {validationErrors.name && (
            <div className={styles.validationError}>
              {validationErrors.name}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="category">
            Category
          </label>
          <select
            className={styles.select}
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="clothing">Clothes</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Fitness">Fitness</option>
            <option value="other">Other</option>
          </select>
          {validationErrors.category && (
            <div className={styles.validationError}>
              {validationErrors.category}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="location">
            Location
          </label>
          <input
            className={styles.input}
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          {validationErrors.location && (
            <div className={styles.validationError}>
              {validationErrors.location}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">
            Description
          </label>
          <textarea
            className={styles.textarea}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
          {validationErrors.description && (
            <div className={styles.validationError}>
              {validationErrors.description}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {validationErrors.email && (
            <div className={styles.validationError}>
              {validationErrors.email}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label
            className={`${styles.label} ${styles.optionalLabel}`}
            htmlFor="phone"
          >
            Phone Number (Optional)
          </label>
          <input
            className={styles.input}
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {validationErrors.phone && (
            <div className={styles.validationError}>
              {validationErrors.phone}
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShop;
