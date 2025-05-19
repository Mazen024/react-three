import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useState, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import styles from "./Login.module.css";
import { authenticate } from "../../../Service/authService";
import { Snow } from "../../snow";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const { data, success, error } = await authenticate(userData);
      if (success) {
        login({
          email: data.email,
          fullName: data.fullName,
          roles: data.roles,
          accessToken: data.token,
          refreshToken: data.refreshToken,
        });
      } else {
        setErrorMessage(
          error || "Authentication failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        const { details, message } = error.response.data;
        setErrorMessage(details || message || "An unexpected error occurred.");
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`${styles.loginContainer} ${styles.loginLeft}`}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className={`${styles.formGroup} ${styles.inputIcon}`}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <FaEnvelope className={styles.icon} />
          </div>

          <div className={`${styles.formGroup} ${styles.inputIcon}`}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <FaLock className={styles.icon} />

            {showPassword ? (
              <FaEyeSlash
                className={styles.eyeIcon}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className={styles.eyeIcon}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          {errorMessage && (
            <div className={styles.errorMessage}>{String(errorMessage)}</div>
          )}

          <div
            onClick={() => navigate("/forgot-password")}
            className={styles.forgotPasswordLink}
          >
            Forgot Password?
          </div>

          <button type="submit" className={styles.loginBtn}>
            Log In
          </button>
        </form>
      </div>

      <div className={`${styles.loginContainer} ${styles.loginRight}`}>
        <h2>Welcome to MetaMall</h2>
        <p>Your gateway to a virtual shopping experience.</p>
        <p>Join us today and explore the future of e-commerce.</p>
        <div className={styles.signupLink} onClick={() => navigate("/signup")}>
          Need registration?
        </div>
      </div>

      <div className={styles.snowContainer}>
        <Canvas>
          <Snow />
        </Canvas>
      </div>
    </div>
  );
}

export default Login;
