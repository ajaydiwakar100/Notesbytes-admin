import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LIST_ROLE_API, CREATE_SUB_ADMIN_API, VIEW_SUB_ADMIN_API, UPDATE_SUB_ADMIN_API } from "../../config";
import { toast } from "react-toastify";

const AddSubAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- Detect if editing

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    role: "",
    status: 1,
    user_type: "subadmin",
  });

  // ---------------------------------------------------------------------------
  // Fetch roles
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(LIST_ROLE_API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          setRoles(res.data.data || []);
        }
      } catch (err) {
        if (err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // ---------------------------------------------------------------------------
  // If ID exists → Fetch Sub Admin data for editing
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!id) return; // Only for edit mode

    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${VIEW_SUB_ADMIN_API}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          const data = res.data.data;

          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            country: data.country || "",
            state: data.state || "",
            city: data.city || "",
            role: data.roleId || "",
            status: data.status === 1,
            user_type: data.user_type || "Seller",
          });
        }
      } catch (err) {
        console.error("Failed to fetch details", err);
        toast.error("Failed to load Sub Admin details");
      }
    };

    fetchDetails();
  }, [id]);

  // ---------------------------------------------------------------------------
  // Input change handler
  // ---------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---------------------------------------------------------------------------
  // Form validation
  // ---------------------------------------------------------------------------
  const validateForm = () => {
    let tempErrors = {};

    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "country",
      "state",
      "city",
      "role",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.toString().trim()) {
        tempErrors[field] = "This is required field";
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ---------------------------------------------------------------------------
  // Form submit (Add or Update)
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const API = id
        ? `${UPDATE_SUB_ADMIN_API}/${id}` // Edit
        : CREATE_SUB_ADMIN_API; // Add

      // Convert boolean → number
      const finalData = {
        ...formData,
        status: formData.status ? 1 : 0,
      };
      const res = await axios.post(API, finalData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/sub-admins");
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      console.error("Error:", err);
      const message =
      err.response?.data?.msg || "Something went wrong!";

  
      if (err.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const requiredStar = <span style={{ color: "red" }}>*</span>;

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h1 className="m-0 text-dark">{id ? "Edit Sub Admin" : "Add Sub Admin"}</h1>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>

              {/* ALL INPUTS */}
              {[
                { label: "Full Name", name: "name" },
                { label: "Email Address", name: "email", type: "email" },
                { label: "Phone Number", name: "phone" },
                { label: "Address", name: "address" },
                { label: "Country", name: "country" },
                { label: "State", name: "state" },
                { label: "City", name: "city" }
              ].map((f) => (
                <div className="row mb-2" key={f.name}>
                  <div className="col-lg-3">
                    <label className="lableClass">
                      {f.label} {requiredStar}
                    </label>
                  </div>
                  <div className="col-lg-6">
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${f.label}`}
                      className="form-control"
                      style={{ border: errors[f.name] ? "1px solid red" : "" }}
                    />
                    {errors[f.name] && (
                      <small style={{ color: "red" }}>{errors[f.name]}</small>
                    )}
                  </div>
                </div>
              ))}

              {/* ROLE */}
              <div className="row mb-2">
                <div className="col-lg-3">
                  <label className="lableClass">
                    Select Role {requiredStar}
                  </label>
                </div>
                <div className="col-lg-6">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-control"
                    style={{ border: errors.role ? "1px solid red" : "" }}
                  >
                    <option value="">Select Role</option>

                    {!loadingRoles &&
                      roles.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.name}
                        </option>
                      ))}
                  </select>

                  {errors.role && (
                    <small style={{ color: "red" }}>{errors.role}</small>
                  )}
                </div>
              </div>

              {/* USER TYPE */}
              {/* <div className="row mb-2">
                <div className="col-lg-3">
                  <label className="lableClass">User Type</label>
                </div>
                <div className="col-lg-6">
                  <select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Seller">Seller</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                </div>
              </div> */}

              {/* STATUS */}
              <div className="row mb-3">
                <div className="col-lg-3">
                  <label className="lableClass">Status</label>
                </div>
                <div className="col-lg-6">
                  <label className="switch">
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

              {/* BUTTONS */}
              <div className="row mb-5">
                <div className="col-lg-3"></div>
                <div className="col-lg-6 d-flex gap-3">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : id ? "Update" : "Submit"}
                  </button>

                  &nbsp;&nbsp;
                  <button
                    type="button"
                    className="btn btn-secondary "
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
