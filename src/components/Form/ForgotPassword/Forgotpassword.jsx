import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { forgotPassword } from "../../../Service/authService";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const { success, error } = await forgotPassword({ email });

      if (success) {
        setStatus("success");
        setMessage("Password reset instructions have been sent to your email.");
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(
          error.message || "Incorrect email address or something went wrong."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.forgotPasswordContainer}>
        <h2>Reset Your Password</h2>

        {status === "success" ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <p>{message}</p>
            <p className={styles.redirectText}>wait a moment...</p>
          </div>
        ) : (
          <>
            <p className={styles.instructions}>
              Enter your email address and we will send you instructions to
              reset your password.
            </p>

            <form className={styles.forgotPasswordForm} onSubmit={handleSubmit}>
              <div className={`${styles.formGroup} ${styles.inputIcon}`}>
                <FaEnvelope className={styles.icon} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  disabled={status === "submitting"}
                  required
                />
              </div>

              {status === "error" && (
                <div className={styles.errorMessage}>{message}</div>
              )}

              <button
                type="submit"
                className={styles.resetBtn}
                disabled={status === "submitting"}
              >
                {status === "submitting"
                  ? "Sending..."
                  : "Send Reset Instructions"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
