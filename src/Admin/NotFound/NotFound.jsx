import { useNavigate } from "react-router";
import "./NotFound.css"
export default function NotFound() {
    const navigate = useNavigate();
     function handleGoHome() {
        navigate('/');
    }
    return (
        <>
            <div className="notFoundContainer">
                <span className="notFoundTitle">404</span>
                <span className="notFoundSubTitle">Page not found</span>
                <button className="backToHomeButton" onClick={handleGoHome}>
                    Back to Home
                </button>
            </div>
        </>
    );
}
