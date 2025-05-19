import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createShop } from "../../Service/shopService";
import styles from "./CreateShop.module.css";

// Utility function for email validation
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const CreateShop = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    email: "",
    phone: "",
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Shop name is required";
    }

    if (!formData.category) {
      return "Please select a category";
    }

    if (!formData.location.trim()) {
      return "Location is required";
    }

    if (!formData.description.trim()) {
      return "Description is required";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    } else if (!validateEmail(formData.email)) {
      return "Invalid email format";
    }

    if (formData.phone.trim() && !/^[+]?[\d\s()-]{10,}$/.test(formData.phone)) {
      return "Invalid phone number format";
    }

    return null; // No errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors) {
      setErrors("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrors(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrors("");

    try {
      const response = await createShop(formData);

      if (response.success) {
        navigate(-1, {
          state: {
            message: "Shop created successfully!",
            type: "success",
          },
        });
      } else {
        setErrors(response.error || "Failed to create shop");
      }
    } catch (err) {
      setErrors(err.response?.data?.message || "An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createShopContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>Create New Shop</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Shop Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              placeholder="Enter shop name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.category ? styles.inputError : ""
              }`}
            >
              <option value="">Select a category</option>
              <option value="clothing">Clothes</option>
              <option value="Bags">Bags</option>
              <option value="Shoes">Shoes</option>
              <option value="Fitness">Fitness</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              Location <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.location ? styles.inputError : ""
              }`}
              placeholder="Enter shop location"
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.description ? styles.inputError : ""
              }`}
              placeholder="Describe your shop"
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              placeholder="Enter email address"
            />
          </div>

          {/* Phone Number */}
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.phone ? styles.inputError : ""
              }`}
              placeholder="Enter phone number"
            />
          </div>
          {errors && <div className={styles.globalErrorMessage}>{errors}</div>}

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate("/seller-shop")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Shop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
