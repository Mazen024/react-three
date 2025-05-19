import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { register } from "../../../Service/authService";
import styles from "./SignUp.module.css";
import { Snow } from "../../snow";
import PropTypes from "prop-types";
import ActivationModal from "../ActivateAccount/activateAccount"; // Import the new modal component

import {
  FaUser,
  FaEnvelope,
  FaEyeSlash,
  FaEye,
  FaBirthdayCake,
  FaVenusMars,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const PasswordStrength = ({ password }) => {
  const getStrength = useMemo(() => {
    if (!password) return { score: 0, text: "" };

    let score = 0;

    if (password.length >= 8) score += 1;

    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthText = ["Weak", "Fair", "Good", "Strong", "Very Strong"][
      Math.min(score, 4)
    ];

    return { score, text: strengthText };
  }, [password]);

  if (!password) return null;

  const { score, text } = getStrength;

  return (
    <div className={styles.passwordStrength}>
      <div className={styles.strengthMeter}>
        <div
          className={styles.strengthIndicator}
          style={{
            width: `${(score / 5) * 100}%`,
            backgroundColor:
              score <= 1
                ? "#ff4d4d"
                : score <= 2
                ? "#ffad4d"
                : score <= 3
                ? "#ffee4d"
                : score <= 4
                ? "#6ee75d"
                : "#30bf78",
          }}
        ></div>
      </div>
      <span
        className={styles.strengthText}
        style={{
          color:
            score <= 1
              ? "#ff4d4d"
              : score <= 2
              ? "#ffad4d"
              : score <= 3
              ? "#c9b51b"
              : score <= 4
              ? "#6ee75d"
              : "#30bf78",
        }}
      >
        {text}
      </span>
    </div>
  );
};

PasswordStrength.propTypes = {
  password: PropTypes.string.isRequired,
};

const ValidationFeedback = ({ valid, message }) => {
  if (valid === null) return null;

  return (
    <div className={valid ? styles.validFeedback : styles.invalidFeedback}>
      {valid ? (
        <FaCheckCircle className={styles.validIcon} />
      ) : (
        <FaTimesCircle className={styles.invalidIcon} />
      )}
      <span>{message}</span>
    </div>
  );
};

const initialFormData = {
  firstname: "",
  lastname: "",
  email: "",
  birthday: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

const initialTouched = {
  firstname: false,
  lastname: false,
  email: false,
  birthday: false,
  gender: false,
  password: false,
  confirmPassword: false,
};

const initialValidation = {
  firstname: null,
  lastname: null,
  email: null,
  birthday: null,
  gender: null,
  password: null,
  confirmPassword: null,
};

ValidationFeedback.propTypes = {
  valid: PropTypes.bool,
  message: PropTypes.string,
};

export default function SignUp() {
  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState(initialTouched);
  const [validation, setValidation] = useState(initialValidation);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef(null);

  const validateField = (name, value) => {
    let isValid = true;
    let message = "";

    switch (name) {
      case "firstname":
      case "lastname":
        isValid = value.trim().length >= 2;
        message = isValid ? "Looks good" : "Must be at least 2 characters";
        break;

      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        message = isValid
          ? "Valid email format"
          : "Please enter a valid email address";
        break;
      }

      case "birthday":
        if (!value) {
          isValid = false;
          message = "Please select your date of birth";
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            isValid = age - 1 >= 13;
          } else {
            isValid = age >= 13;
          }

          message = isValid
            ? "Valid date"
            : "You must be at least 13 years old";
        }
        break;

      case "gender":
        isValid = value !== "";
        message = isValid ? "Selection made" : "Please select an option";
        break;

      case "password": {
        const hasMinLength = value.length >= 8;
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);

        isValid = hasMinLength && (hasUppercase || hasLowercase) && hasNumber;

        if (!isValid) {
          message =
            "Password must have at least 8 characters with letters and numbers";
        } else {
          message = "Strong password";
        }

        if (touched.confirmPassword) {
          validateField("confirmPassword", formData.confirmPassword);
        }
        break;
      }

      case "confirmPassword":
        isValid = value === formData.password && value !== "";
        message = isValid ? "Passwords match" : "Passwords do not match";
        break;

      default:
        break;
    }

    setValidation((prev) => ({
      ...prev,
      [name]: isValid,
    }));

    return { isValid, message };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      validateField(name, value);
    }

    if (name === "password" && touched.confirmPassword) {
      setTimeout(() => {
        validateField("confirmPassword", formData.confirmPassword);
      }, 0);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    validateField(name, formData[name]);
  };

  const validateForm = () => {
    let isFormValid = true;
    const newValidation = { ...validation };
    const newTouched = { ...touched };

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const { isValid } = validateField(key, formData[key]);
      newValidation[key] = isValid;

      if (!isValid) isFormValid = false;
    });

    setTouched(newTouched);
    setValidation(newValidation);

    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      setErrorMessage("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    const registrationData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      birthDate: formData.birthday,
      gender: formData.gender,
      password: formData.password,
    };

    try {
      const { success, error } = await register(registrationData);

      if (success) {
        setSuccessMessage(
          "Registration successful! Please check your email to activate your account."
        );

        setShowActivationModal(true);
      } else {
        setErrorMessage(error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivationSuccess = () => {
    navigate("/login");
  };

  const handleCloseActivationModal = () => {
    setShowActivationModal(false);
    setFormData(initialFormData);
    setTouched(initialTouched);
    setValidation(initialValidation);
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  // Focus first field on mount if neededddddddddddddddddddddddd
  // useEffect(() => {
  //   const firstInput = formRef.current?.querySelector("input");
  //   if (firstInput) firstInput.focus();

  //   // Clean up function
  //   return () => {
  //     // Any cleanup if needed
  //   };
  // }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className={styles.signupPage}>
      <div className={`${styles.signupContainer} ${styles.signupLeft}`}>
        <form
          ref={formRef}
          className={styles.signupForm}
          onSubmit={handleSubmit}
          noValidate
        >
          <h2>Sign Up</h2>

          {/* First Name */}
          <div className={`${styles.formGroup} ${styles.inputIcon}`}>
            <FaUser className={styles.iconLeft} />
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="First Name"
              aria-label="First Name"
              className={
                touched.firstname
                  ? validation.firstname
                    ? styles.validInput
                    : styles.invalidInput
                  : ""
              }
              required
            />
            {touched.firstname && (
              <ValidationFeedback
                valid={validation.firstname}
                message={
                  validation.firstname ? "Looks good" : "First name is required"
                }
              />
            )}
          </div>

          {/* Last Name */}
          <div className={`${styles.formGroup} ${styles.inputIcon}`}>
            <FaUser className={styles.iconLeft} />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Last Name"
              aria-label="Last Name"
              className={
                touched.lastname
                  ? validation.lastname
                    ? styles.validInput
                    : styles.invalidInput
                  : ""
              }
              required
            />
            {touched.lastname && (
              <ValidationFeedback
                valid={validation.lastname}
                message={
                  validation.lastname ? "Looks good" : "Last name is required"
                }
              />
            )}
          </div>

          {/* Email */}
          <div className={`${styles.formGroup} ${styles.inputIcon}`}>
            <FaEnvelope className={styles.iconLeft} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email Address"
              aria-label="Email Address"
              className={
                touched.email
                  ? validation.email
                    ? styles.validInput
                    : styles.invalidInput
                  : ""
              }
              required
            />
            {touched.email && (
              <ValidationFeedback
                valid={validation.email}
                message={
                  validation.email
                    ? "Valid email"
                    : "Please enter a valid email address"
                }
              />
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                aria-label="Password"
                className={
                  touched.password
                    ? validation.password
                      ? styles.validInput
                      : styles.invalidInput
                    : ""
                }
                required
              />
              <div
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    togglePasswordVisibility();
                  }
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <PasswordStrength password={formData.password} />

            {touched.password && (
              <ValidationFeedback
                valid={validation.password}
                message={
                  validation.password
                    ? "Strong password"
                    : "Password must have at least 8 characters with letters and numbers"
                }
              />
            )}
          </div>

          {/* Confirm Password */}
          <div className={`${styles.formGroup}`}>
            <div className={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm Password"
                aria-label="Confirm Password"
                className={
                  touched.confirmPassword
                    ? validation.confirmPassword
                      ? styles.validInput
                      : styles.invalidInput
                    : ""
                }
                required
              />
              <div
                className={styles.eyeIcon}
                onClick={toggleConfirmPasswordVisibility}
                role="button"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleConfirmPasswordVisibility();
                  }
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {touched.confirmPassword && (
              <ValidationFeedback
                valid={validation.confirmPassword}
                message={
                  validation.confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"
                }
              />
            )}
          </div>

          {/* Birthday */}
          <div className={`${styles.formGroup} ${styles.inputIcon}`}>
            <FaBirthdayCake className={styles.iconLeft} />
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Birthday"
              aria-label="Birthday"
              className={
                touched.birthday
                  ? validation.birthday
                    ? styles.validInput
                    : styles.invalidInput
                  : ""
              }
              required
            />

            {touched.birthday && (
              <ValidationFeedback
                valid={validation.birthday}
                message={
                  validation.birthday
                    ? "Valid date"
                    : "You must be at least 13 years old"
                }
              />
            )}
          </div>

          {/* Gender */}
          <div className={`${styles.formGroup} ${styles.inputIcon}`}>
            <FaVenusMars className={styles.iconLeft} />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-label="Gender"
              className={`${styles.genderSelect} ${
                touched.gender
                  ? validation.gender
                    ? styles.validInput
                    : styles.invalidInput
                  : ""
              }`}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>

            {touched.gender && (
              <ValidationFeedback
                valid={validation.gender}
                message={
                  validation.gender
                    ? "Selection made"
                    : "Please select your gender"
                }
              />
            )}
          </div>

          {/* Error/Success Messages */}
          {errorMessage && (
            <div className={styles.errorMessage} role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && !showActivationModal && (
            <div className={styles.successMessage} role="status">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.signupBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>
        </form>
      </div>

      <div className={`${styles.signupContainer} ${styles.signupRight}`}>
        <h2>Join MetaMall</h2>
        <p>
          Sign up now and start your virtual shopping journey in the worlds most
          immersive digital marketplace.
        </p>
        <div
          className={styles.signupLink}
          onClick={redirectToLogin}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              redirectToLogin();
            }
          }}
        >
          Already have an account? Log in
        </div>
      </div>

      <div className={styles.snowContainer}>
        <Canvas>
          <Snow />
        </Canvas>
      </div>

      {showActivationModal && (
        <ActivationModal
          onClose={handleCloseActivationModal}
          onSuccess={handleActivationSuccess}
        />
      )}
    </div>
  );
}
