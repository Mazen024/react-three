import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCog,
  FaHome,
  FaSave,
  FaSignOutAlt,
  FaSpinner,
  FaStore,
  FaUser,
  FaTimes
} from "react-icons/fa";
import styles from "./Profile.module.css";
import { AuthContext } from "../../../Context/AuthContext";
import {
  getUserProfile,
  updateProfile,
  uploadUserPhoto,
} from "../../../Service/authService";
import PasswordChangeModal from "./passChange";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    firstname: "",
    lastname: "",
    gender: "",
    birthDate: "",
    age: "",
  });
  
  // State to store original data for cancel functionality
  const [originalData, setOriginalData] = useState({
    fullName: "",
    email: "",
    firstname: "",
    lastname: "",
    gender: "",
    birthDate: "",
    age: "",
  });
  
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { auth, setAuth, logout } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState(
    "Assets/textures/unknown-person.png"
  );

  const openPasswordModal = () => {
    setIsModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsModalOpen(false);
  };

  const formatDateForInput = (dateString) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return "";
    }
  };

  const calculateAge = (birthDate) => {
    try {
      const date = new Date(birthDate);

      if (isNaN(date.getTime())) return "";

      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      return age.toString();
    } catch (err) {
      console.error("Error calculating age:", err);
      return "";
    }
  };

  const getBirthDateFromAge = (age) => {
    if (!age || isNaN(age)) return "";

    const today = new Date();
    const birthYear = today.getFullYear() - parseInt(age);
    const birthMonth = today.getMonth();
    const birthDay = today.getDate();

    const birthDate = new Date(birthYear, birthMonth, birthDay);

    const year = birthDate.getFullYear();
    const month = String(birthDate.getMonth() + 1).padStart(2, "0");
    const day = String(birthDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const storedUser = localStorage.getItem("user");
  const roleauth = storedUser ? JSON.parse(storedUser) : null;

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, success, error } = await getUserProfile();

      if (success && data) {
        setAuth(data);

        let formattedGender = data.gender ? data.gender.toLowerCase() : "";
        let ageValue = "";
        let birthDateValue = "";

        if (data.birthDate) {
          birthDateValue = formatDateForInput(data.birthDate);
          ageValue = calculateAge(data.birthDate);
        } else if (data.age) {
          ageValue = data.age.toString();
          birthDateValue = getBirthDateFromAge(data.age);
        }

        const formattedData = {
          fullName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          email: data.email || "",
          firstname: data.firstName || "",
          lastname: data.lastName || "",
          gender: formattedGender,
          birthDate: birthDateValue,
          age: ageValue,
        };

        setFormData(formattedData);
        setOriginalData(formattedData); // Store original data for cancel functionality

        if (data.photoUrl) {
          setProfilePicture(data.photoUrl);
        }
      } else {
        setError(error?.details || "Failed to load profile data");
      }
    } catch (err) {
      setError("An error occurred while fetching your profile");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthDate") {
      const age = calculateAge(value);
      setFormData({ ...formData, birthDate: value, age });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditClick = () => {
    if (currentlyEditing) {
      saveChanges();
    } else {
      setCurrentlyEditing(true);
    }
  };

  // New cancel function
  const handleCancelClick = () => {
    setFormData({...originalData});
    setCurrentlyEditing(null);
    setError(null);
  };

  const saveChanges = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const updatedValue = {
        firstname: formData.fullName.split(" ")[0] || "",
        lastname: formData.fullName.split(" ").slice(1).join(" ") || "",
        gender: formData.gender ? formData.gender.toUpperCase() : "",
        birthDate: formData.birthDate,
      };
      console.log(updatedValue);

      const { success, error } = await updateProfile(updatedValue);

      if (success) {
        setSuccessMessage("Profile updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        await fetchUserProfile();
      } else {
        setError(error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while saving changes");
      console.error(err);
    } finally {
      setIsUpdating(false);
      setCurrentlyEditing(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target.result);
      };
      reader.readAsDataURL(file);

      await uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file) => {
    setUploadingPhoto(true);
    setError(null);

    try {
      const { success, data, error } = await uploadUserPhoto(file);

      if (success) {
        setSuccessMessage("Profile photo updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);

        if (data.photoUrl) {
          setProfilePicture(data.photoUrl);
        }
      } else {
        setError(error?.message || "Failed to upload photo");
        await fetchUserProfile();
      }
    } catch (err) {
      setError("An error occurred while uploading your photo");
      console.error(err);
      await fetchUserProfile();
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.loadingSpinner} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={`${styles.sidebarIcon} ${styles.logoIcon}`}>
            <FaUser />
          </div>

          <div className={styles.sidebarIcon} onClick={() => navigate("/home")}>
            <FaHome />
            <span className={styles.iconTooltip}>Home</span>
          </div>

          {roleauth?.roles && roleauth.roles !== "ROLE_USER" && (
            <div
              className={styles.sidebarIcon}
              onClick={() => navigate("/seller-shop")}
            >
              <FaStore />
              <span className={styles.iconTooltip}>Dashboard</span>
            </div>
          )}

          <div
            className={styles.sidebarIcon}
            onClick={() => navigate("/settings")}
          >
            <FaCog />
            <span className={styles.iconTooltip}>Settings</span>
          </div>
        </div>

        <div className={styles.sidebarBottom}>
          <div
            className={`${styles.sidebarIcon} ${styles.logoutIcon}`}
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span className={styles.iconTooltip}>Logout</span>
          </div>
        </div>
      </nav>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.welcomeText}>Welcome, {auth.firstName}</h1>
            <p className={styles.dateText}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.profileHeader}>
          <div
            className={styles.profileImageContainer}
            onClick={handlePhotoClick}
          >
            <img
              src={profilePicture}
              alt="Profile"
              className={`${styles.profileImage} ${
                uploadingPhoto ? styles.uploading : ""
              }`}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className={styles.fileInput}
            />
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>
              {auth.firstName}
              {" " + auth.lastName}
            </h2>
            <p className={styles.profileEmail}>{formData.email}</p>
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.editButton}
              onClick={handleEditClick}
              disabled={isUpdating}
            >
              {currentlyEditing ? (
                isUpdating ? (
                  <FaSpinner className={styles.spinnerIcon} />
                ) : (
                  <FaSave />
                )
              ) : (
                "Edit"
              )}
            </button>
            {currentlyEditing && (
              <button
                className={styles.cancelButton}
                onClick={handleCancelClick}
                disabled={isUpdating}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <div className={styles.profileFields}>
          <div className={styles.fieldColumn}>
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={styles.fieldInput}
                disabled={!currentlyEditing}
              />
            </div>
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={styles.fieldInput}
                disabled={!currentlyEditing}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className={styles.fieldColumn}>
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>
                {currentlyEditing ? "Birth Date" : "Age"}
              </label>
              {currentlyEditing ? (
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={styles.fieldInput}
                />
              ) : (
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  className={styles.fieldInput}
                  disabled
                />
              )}
            </div>
            <div className={styles.profileField}>
              <label className={styles.fieldLabel}>Password</label>
              <input
                type="password"
                name="password"
                value="••••••••••••••••"
                onClick={openPasswordModal}
                readOnly
                className={styles.fieldInput}
                style={{ cursor: "pointer" }}
              />
            </div>

            {isModalOpen && (
              <PasswordChangeModal
                isOpen={isModalOpen}
                onClose={closePasswordModal}
                onSuccess={() => {
                  closePasswordModal();
                }}
              />
            )}
          </div>
        </div>

        <div className={styles.emailSection}>
          <h3 className={styles.sectionTitle}>My Email Address</h3>
          <div className={styles.emailItem}>
            <span>{formData.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;