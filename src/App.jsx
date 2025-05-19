import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { Canvas } from "@react-three/fiber";
import { noEvents } from "@react-three/xr";
import { PCFSoftShadowMap } from "three";
import { Suspense } from "react";

// Layouts
import Layout from "./Admin/Layout/Layout";
import SellerLayout from "./Seller/SellerLayout";

// Pages
import Welcome1 from "./Components/Welcome/welcome1";
import Home from "./Components/HomePage/Home/Home";
import Login from "./Components/Form/Login/Login";
import SignUp from "./Components/Form/SignUp/Signup";
import ForgetPassword from "./Components/Form/ForgotPassword/Forgotpassword";
import BagsShop from "./Pages/BagsStore";
import ProtectedRoute from "./Components/ProtectedRoute";
import Activate from "./Components/Form/ActivateAccount/activateAccount";
import ResetPassword from "./Components/Form/ForgotPassword/ResetPassword";
import Cart from "./Pages/Cart";
import Profile from "./Components/HomePage/Profile/Profile";
import Unauthorized from "./Pages/Unauthorized";
import ShoesShop from "./Pages/ShoesShop";
import SportsShop from "./Pages/SportStore";

// Admin Components
import Dashboard from "./Admin/Dashboard/Dashboard";
import Users from "./Admin/Users/Users";
import ShowAdminPage from "./Admin/ShowAdminPage/ShowAdminPage";

import CreateShop from "./Seller/Create/createShop.jsx";
import EditShop from "./Seller/Edit/editShop.jsx";
import ShopAssets from "./Seller/Models/shopAssets.jsx";
import ShopList from "./Seller/List/shopList.jsx";
import ShopDetails from "./Seller/Details/shopDetail.jsx";
import ModelPreview from "./Seller/Preview/ModelPreview.jsx";

import Loader from "./Utils/Loader/Loader";
import { Holding } from "./Utils/Holding";

const CanvasContainer = () => {
  const location = useLocation();
  const threeDRoutes = [
    "/shoes/:shopId",
    "/sport/:shopId",
    "/holding/:shopId",
    "/bags/:shopId",
  ];
  const shouldShowCanvas = threeDRoutes.includes(location.pathname);

  if (!shouldShowCanvas) {
    return null;
  }

  return (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      shadows="soft"
      camera={{ position: [-0.5, 0.5, 0.5] }}
      events={noEvents}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Suspense fallback={<Loader />}></Suspense>
    </Canvas>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <CanvasContainer />
      <Routes>
        <Route path="/" element={<Welcome1 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/activate-account" element={<Activate />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />

        {/* <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}> */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="showAdmin" element={<ShowAdminPage />} />
        </Route>
        {/* </ProtectedRoute> */}

        {/* <Route
          path="/seller-shop"
          element={<ProtectedRoute allowedRoles={["ROLE_SELLER"]} />}
        > */}
        <Route path="/seller-shop" element={<SellerLayout />}>
          <Route index element={<ShopList />} />
          <Route path="create" element={<CreateShop />} />
          <Route path="details/:shopId" element={<ShopDetails />} />
          <Route path="details/:shopId/edit" element={<EditShop />} />
          <Route path="details/:shopId/assets" element={<ShopAssets />} />
          <Route
            path="details/:shopId/ModelPreview"
            element={<ModelPreview />}
          />
        </Route>

        <Route path="/:shopName/:shopId" element={<GenericShop />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </AuthProvider>
  );
};

import { useParams } from "react-router-dom";

const GenericShop = () => {
  const { shopName } = useParams();

  if (shopName === "shoes") return <ShoesShop />;
  if (shopName === "sports") return <SportsShop />;
  if (shopName === "holding") return <Holding />;
  if (shopName === "bags") return <BagsShop />;
};

export default GenericShop;
