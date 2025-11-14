import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmailTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get template ID from URL

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    status: true,
  });

  // Simulate fetching template data by ID
  useEffect(() => {
    // Replace with API call in real app
    const fetchTemplate = async () => {
      const dummyTemplates = [
        {
          id: "1",
          name: "Welcome Email",
          subject: "Welcome to our platform!",
          body: "Hello {name}, welcome to our platform.",
          status: true,
        },
        {
          id: "2",
          name: "Password Reset",
          subject: "Reset your password",
          body: "Click the link to reset your password: {reset_link}",
          status: false,
        },
      ];
      const template = dummyTemplates.find((tpl) => tpl.id === id);
      if (template) {
        setFormData({
          name: template.name,
          subject: template.subject,
          body: template.body,
          status: template.status,
        });
      }
    };
    fetchTemplate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.body) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log(`Template ${id} Updated:`, formData);
    alert("Template updated successfully (check console)");
    navigate("/email-templates");
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 text-dark">Edit Email Template</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <form onSubmit={handleSubmit}>
              {/* Template Name */}
              <div className="row mb-2">
                <div className="col-lg-3">
                  <label className="lableClass">
                    Template Name <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Template Name"
                    className="form-control"
                    style={{ marginTop: "5px" }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="row mb-2">
                <div className="col-lg-3">
                  <label className="lableClass">
                    Subject <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter Subject"
                    className="form-control"
                    style={{ marginTop: "5px" }}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="row mb-2">
                <div className="col-lg-3">
                  <label className="lableClass">
                    Body <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <div className="col-lg-6">
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    placeholder="Enter email body"
                    className="form-control"
                    rows={6}
                    style={{ marginTop: "5px" }}
                  />
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
              <div className="row mb-2">
                <div className="col-lg-3"></div>
                <div className="col-lg-6 d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                  &nbsp;&nbsp;
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/email-templates")}
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

export default EditEmailTemplate;
