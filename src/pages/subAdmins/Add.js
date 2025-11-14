import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSubAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    role: "",
    status: true,
    userType: "Seller",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in required fields: Name, Email, Phone");
      return;
    }
    console.log("SubAdmin Submitted:", formData);
    alert("SubAdmin added successfully (check console)");
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      role: "",
      status: true,
      userType: "Seller",
    });
    navigate("/subadmins");
  };

  const requiredStar = <span style={{ color: "red" }}>*</span>;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 text-dark">Add Sub Admin</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <form onSubmit={handleSubmit} style={{ marginTop:"20px"}}>
              {[
                { label: "Name", name: "name", type: "text", required: true },
                { label: "Email", name: "email", type: "email", required: true },
                { label: "Phone", name: "phone", type: "text", required: true },
                { label: "Address", name: "address", type: "text" , required: true},
                { label: "Country", name: "country", type: "text", required: true },
                { label: "State", name: "state", type: "text", required: true},
                { label: "City", name: "city", type: "text", required: true},
                { label: "Role", name: "role", type: "text", required: true },
              ].map((field) => (
                <div className="row mb-2" key={field.name}>
                  <div className="col-lg-3">
                    <label className="lableClass">
                      {field.label} {field.required && requiredStar}
                    </label>
                  </div>
                  <div className="col-lg-6" >
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label}`}
                      className="form-control"
                      style={{ marginTop: "5px" }}
                    />
                  </div>
                </div>
              ))}

              {/* User Type */}
              <div className="row mb-2">
                <div className="col-lg-3">
                  <label className="lableClass">User Type</label>
                </div>
                <div className="col-lg-6">
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="form-control"
                    style={{ marginTop: "5px" }}
                  >
                    <option value="Seller">Seller</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="row mb-2">
                <div className="col-lg-3">
                  <label className="lableClass">Status</label>
                </div>
                <div className="col-lg-6">
                  <label className="switch" style={{ marginTop: "5px" }}>
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="row mb-5">
                <div className="col-lg-3"></div>
                <div className="col-lg-6 d-flex gap-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  &nbsp; &nbsp;
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/sub-admins")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddSubAdmin;
