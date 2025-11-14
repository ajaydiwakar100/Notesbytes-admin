import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";
import axios from "axios";
import { CHANGE_PASSWORD_API } from "../config";
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "oldPassword":
        setOldPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        CHANGE_PASSWORD_API,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.status === "success") {
        toast.success(data.msg);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.msg || "Password change failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0 text-dark">Change Password</h1>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="box-main">
              <form onSubmit={handleSubmit}>
                <div style={{ margin: "20px" }}>
                  <div className="row mb-3 align-items-center">
                    <div className="col-lg-6 d-flex align-items-center">
                      <label style={{ width: "300px" }}>Old Password</label>
                      <input
                        type="password"
                        name="oldPassword"
                        className="form-control"
                        value={oldPassword}
                        onChange={handleChange}
                        placeholder="Enter Old Password"
                        style={{ marginLeft: "10px" }}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <div className="col-lg-6 d-flex align-items-center">
                      <label style={{ width: "300px" }}>New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={newPassword}
                        onChange={handleChange}
                        placeholder="Enter New Password"
                        style={{ marginLeft: "10px" }}
                      />
                    </div>
                  </div>

                  <div className="row mb-3 align-items-center">
                    <div className="col-lg-6 d-flex align-items-center">
                      <label style={{ width: "300px" }}>Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm New Password"
                        style={{ marginLeft: "10px" }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 d-flex" style={{ marginLeft: "200px", gap: "10px" }}>
                      <button type="submit" className="btn btn-primary">Submit</button>
                      <button type="button" className="btn btn-secondary" 
                       onClick={() => navigate("/dashboard")}>Cancel</button>
                    </div>
                  </div>
                </div>  
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChangePassword;
