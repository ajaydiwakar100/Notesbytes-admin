import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FORGOT_PASSWORD_API } from "../config";
import Loader from "../layouts/Loader";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter email address");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(FORGOT_PASSWORD_API, { email });
      console.log("Forget Password Response:", data);

      if (data.status === "success" && data.code === 200) {
        toast.success(data.msg || "A Verification link send to your email");
      } else {
        toast.error(data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error("Forget Password Error:", error);

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
                <div className="login-title-box">
                  {/* <h4 className="login-title">Forget Password</h4> */}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="lableclassName">
                      Enter Registered Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="form-control"
                      value={email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                      Send email
                    </button>

                    <button type="submit" className="btn btn-primary" onClick={() => navigate(-1)}>
                       Back to Login
                    </button>
                  </div>

                  <div>
                    {/* <p className="back-to-login">
                      <a href="#" onClick={() => navigate(-1)}>
                        Back to Login
                      </a>
                    </p> */}
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

export default ForgetPassword;