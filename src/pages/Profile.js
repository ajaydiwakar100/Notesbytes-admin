import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";
import axios from "axios";
import { PROFILE_UPDATE_API } from "../config";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    setName(profile.name || "");
    setEmail(profile.email || "");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

        const { data } = await axios.post(
            PROFILE_UPDATE_API,{name,email},{
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (data.status === "success") {
            toast.success(data.msg);

            // Get existing profile from localStorage
            const existingProfile = JSON.parse(localStorage.getItem("profile") || "{}");

            // Merge updated name and email with existing profile
            const updatedProfile = {
                ...existingProfile,
                name: name,   // or data.data.name if returned from API
                email: email, // or data.data.email
            };

            localStorage.setItem("profile", JSON.stringify(updatedProfile));

            // setTimeout(() => {
            //     window.location.reload();
            // }, 500); 
        } else {
            toast.error(data.msg || "Profile update failed");
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
            <div className="row">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Edit Profile</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="box-main">
              <div className="box-main-table">
                <div className="container-fluid">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3 align-items-center">
                        <div className="col-lg-4 d-flex align-items-center">
                            <label className="lableClass mb-0" style={{ width: "120px" }}>
                            Name
                            </label>
                            <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={name}
                            onChange={handleChange}
                            style={{ marginLeft: "10px" }}
                            />
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <div className="col-lg-4 d-flex align-items-center">
                            <label className="lableClass mb-0" style={{ width: "120px" }}>
                            Email
                            </label>
                            <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={email}
                            onChange={handleChange}
                            style={{ marginLeft: "10px" }}
                            />
                        </div>    
                    </div>    
                    
                    <div className="row">
                    <div className="col-lg-6 d-flex" style={{ marginLeft: "100px", gap: "10px" }}>
                        <button type="submit" className="btn btn-primary">
                        Submit
                        </button>
                        <button type="button" className="btn btn-secondary"
                         onClick={() => window.history.back()}>
                        Cancel
                        </button>
                    </div>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;
