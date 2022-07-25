import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HOME/Home";
import Siderbar from "./components/Layout/SideBar/Siderbar";
import SignUp from "./components/SignUp/SignUp";
import EmailVerify from "./components/EmailVerfiy/EmailVerify";
import Post from "./components/POST/Post";
import Profile from "./components/Profile/Profile";
import PasswordReset from "./components/Password-reset/PasswordReset,";
import Verified from "./components/Verified/Verified";
import { IsAdmin, HasAuth } from "./Middleware/AuthMiddleware";
import Dashboard from "./components/Admin/Dashboard";
import Sidebar from "./components/Layout/Admin/Sidebar";
import UserProfile from "./components/UserProfile/UserProfile";
import Atest from "./components/Atest/Atest";
import CreatePost from "./components/CreatePost/CreatePost";

function App() {
  return (
    <div className="App">
      <>
        <Router>
          <Siderbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify/:token" element={<EmailVerify />} />
            <Route path="/user-profile" element={<Profile />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/verified/:token" element={<Verified />} />
            <Route element={<HasAuth />}>
              <Route path="/auth" element={<SignUp />} />
            </Route>
            <Route path="/user/:id" element={<UserProfile />} />

            <Route element={<IsAdmin />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard-profile" element={<Profile />} />
            </Route>
            <Route path="/post-action" element={<CreatePost />} />
            <Route path="/test" element={<Atest />} />
          </Routes>
        </Router>
      </>
    </div>
  );
}

export default App;
