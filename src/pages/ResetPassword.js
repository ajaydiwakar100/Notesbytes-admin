import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { RESET_PASSWORD_API } from "../config";
import Loader from "../layouts/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(RESET_PASSWORD_API, {
        token,
        password,
      });

      console.log("Reset Password Response:", data);

      if (data.status === "success" && data.code === 200) {
        toast.success(data.msg || "Password reset successful!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.msg || "Reset failed!");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "An unexpected error occurred";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />

      <div className="col-lg-12" style={{ overflow: "hidden" }}>
        <div className="row" style={{ margin: "-17px" }}>
          <div className="col-lg-8">
            <img
              src="/admin/images/login-banner.jpg"
              className="h-100 object-fit-cover w-100"
              alt="banner"
            />
          </div>

          <div className="auth-bg-gradient card-img-overlay"></div>

          <div className="col-lg-4">
            <div className="login-page">
              <div className="login-box">

                <form onSubmit={handleSubmit}>
                 {/* New Password */}
                  <div className="form-group position-relative">
                    <label className="lableclassName">New Password</label>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "38px",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group mt-3 position-relative">
                    <label className="lableclassName">Confirm Password</label>

                    <input
                      type={showConfirmed ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <span
                      onClick={() => setShowConfirmed(!showConfirmed)}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "38px",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      {showConfirmed ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-primary">
                      Reset Password
                    </button>
                    <p className="back-to-login">
                      <a href="#" onClick={() => navigate("/login")}>
                        Back to Login
                      </a>
                    </p>
                  </div>

                  <div>
                    
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;