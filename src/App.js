import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Form/Login/Login";
import SignUp from "./components/Form/SignUp/Signup";
import Welcome from "./components/Welcome/welcome";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="home" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;
