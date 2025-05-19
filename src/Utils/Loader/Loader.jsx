import { Html, useProgress } from "@react-three/drei";
import "./Loader.css";
import { useParams } from "react-router-dom";

const Loader = () => {
  const { progress } = useProgress();
  const { shopName } = useParams();
  const progressValue = Math.round(progress);

  return (
    <Html center>
      <div className="loader-container">
        <div className="loader-content">
          <div className="loader-brand">
            <span className="loader-logo">{shopName}</span>
            <span className="loader-tagline">Premium 3D Experience</span>
          </div>

          <div className="loader-progress-container">
            <div className="loader-progress-label">
              <span>Loading Experience</span>
              <span className="loader-percentage">{progressValue}%</span>
            </div>

            <div className="loader-progress-bar">
              <div
                className="loader-progress-fill"
                style={{ width: `${Math.min(100, progressValue)}%` }}
              ></div>
            </div>

            <div className="loader-tip">
              {progressValue < 50
                ? "Preparing your 3D shopping experience..."
                : progressValue < 90
                ? "Loading premium models..."
                : "Almost ready! Setting up your virtual showroom..."}
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Loader;
