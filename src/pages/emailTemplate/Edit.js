import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  GET_EMAIL_TEMPLATE_DETAILS,
  UPDATE_EMAIL_TEMPLATE_API,
} from "../../config";

const EditEmailTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    key: "",
    subject: "",
    body: "",
    isActive: true,
  });

  // =========================
  // Fetch Template Details
  // =========================
  useEffect(() => {
    fetchTemplateDetails();
  }, [id]);

  const fetchTemplateDetails = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${GET_EMAIL_TEMPLATE_DETAILS}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        const template = res.data.data;

        setFormData({
          key: template.key || "",
          subject: template.subject || "",
          body: template.body || "",
          isActive: template.isActive ?? true,
        });
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load template details");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // Submit Update
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.key || !formData.subject || !formData.body) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${UPDATE_EMAIL_TEMPLATE_API}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/email-template");
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update template");
    } finally {
      setLoading(false);
    }
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
              {/* Template Key */}
              <div className="row mb-3">
                <div className="col-lg-3">
                  <label className="lableClass">
                    Template Key <span style={{ color: "red" }}>*</span>
                  </label>
                </div>

                <div className="col-lg-6">
                  <input
                    type="text"
                    name="key"
                    value={formData.key}
                    onChange={handleChange}
                    placeholder="Enter Template Key"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="row mb-3">
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
                  />
                </div>
              </div>

              {/* Body */}
              <div className="row mb-3">
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
                    rows={8}
                  />
                </div>
              </div>

              {/* Status */}
              {/* <div className="row mb-3">
                <div className="col-lg-3">
                  <label className="lableClass">Status</label>
                </div>

                <div className="col-lg-6">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div> */}

              {/* Buttons */}
              <div className="row mb-3">
                <div className="col-lg-3"></div>

                <div className="col-lg-6 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>

                  &nbsp;&nbsp;

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/email-template")}
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