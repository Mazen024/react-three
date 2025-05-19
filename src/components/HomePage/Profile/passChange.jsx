import { useState } from "react";
import { changePassword } from "../../../Service/authService";
import styles from "./passChange.module.css";

// eslint-disable-next-line react/prop-types
const PasswordChangeModal = ({ isOpen, onClose, onSuccess }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validatePasswords = () => {
    if (passwordData.newPassword.length < 8) {
      setMessage({
        text: "New password must be at least 8 characters long",
        type: "error",
      });
      return false;
    }

    if (!/[A-Za-z]/.test(passwordData.newPassword)) {
      setMessage({
        text: "New password must contain at least one letter",
        type: "error",
      });
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ text: "New passwords don't match", type: "error" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const { success, error } = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (success) {
        setMessage({ text: "Password successfully updated!", type: "success" });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setMessage({
          text: error || "Failed to update password",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
      console.error("Password change error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Change Password</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label htmlFor="currentPassword">Current Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handleInputChange}
                className={styles.fieldInput}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className={styles.formField}>
            <label htmlFor="newPassword">New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleInputChange}
                className={styles.fieldInput}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? "Hide" : "Show"}
              </button>
            </div>
            <p className={styles.passwordHint}>Must be at least 8 characters</p>
          </div>

          <div className={styles.formField}>
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handleInputChange}
                className={styles.fieldInput}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
