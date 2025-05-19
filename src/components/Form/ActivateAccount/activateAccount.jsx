import { useState } from "react";
import PropTypes from "prop-types";
import { activateAccount } from "../../../Service/authService";
import styles from "./ActivateAccount.module.css";

function ActivationModal({ onClose, onSuccess }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      setStatus("error");
      setMessage("Please enter the activation code.");
      return;
    }

    setStatus("verifying");
    setMessage("Verifying your account...");

    try {
      const { success, error } = await activateAccount(token);

      if (success) {
        setStatus("success");
        setMessage(
          "Your account has been successfully activated! You can now log in."
        );
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setStatus("error");
        setMessage(
          error?.message || "Failed to activate your account. Please check the code."
        );
      }
    } catch (error) {
      console.error("Activation error:", error);
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.activateTitle}>Account Activation</h2>
        <p className={styles.activateDescription}>
          Please check your email for the activation code we sent you.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Enter activation code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={styles.inputField}
            autoFocus
          />
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={status === "verifying"}
          >
            {status === "verifying" ? "Verifying..." : "Verify"}
          </button>
        </form>

        {message && (
          <p 
            className={
              status === "verifying" 
                ? styles.verifying 
                : status === "success" 
                ? styles.success 
                : styles.error
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

ActivationModal.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default ActivationModal;