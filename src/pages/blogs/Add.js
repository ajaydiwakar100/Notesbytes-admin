import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  LIST_BLOG_CATEGORY_API,
  CREATE_BLOG_API,
  VIEW_BLOG_API,
  UPDATE_BLOG_API,
} from "../../config";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/* -----------------------------
   ReactQuill Toolbar
------------------------------*/
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "color",
  "background",
  "script",
];

const AddBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [rawHtmlContent, setRawHtmlContent] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: null,
    content: "",
    embed: "",
    status: true,
    author: "",
  });

  /* ----------------------------------
     Fetch Categories
  ----------------------------------*/
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(LIST_BLOG_CATEGORY_API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const settings = res?.data?.data?.global_settings_content;
        if (!settings) return;

        const content =
          typeof settings === "string" ? JSON.parse(settings) : settings;

        setCategories(
          Array.isArray(content.blogCategories)
            ? content.blogCategories
            : []
        );
      } catch (err) {
        if (err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ----------------------------------
     Fetch Blog (Edit)
  ----------------------------------*/
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${VIEW_BLOG_API}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          const d = res.data.data;

          console.log("BLOG DATA:", d);

          // force HTML mode in edit
          setIsHtmlMode(true);

          // store raw html separately
          setRawHtmlContent(d.content || "");

          // update form properly
          setFormData((prev) => ({
            ...prev,
            title: d.title || "",
            category: d.category || "",
            image: null,
            content: d.content || "",
            status: d.status === "published",
            author: d.author || "",
            embed: d.embed || "",
          }));

          // image preview
          if (d.image) {
            setImagePreview(d.image);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [id]);

  /* ----------------------------------
     Input Change
  ----------------------------------*/
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ----------------------------------
     Validation
  ----------------------------------*/
  const validateForm = () => {
    let temp = {};

    if (!formData.title.trim()) temp.title = "Title is required";
    if (!formData.category) temp.category = "Category is required";
    if (!formData.content.trim()) temp.content = "Content is required";
    if (!formData.author.trim()) temp.author = "Author is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  /* ----------------------------------
     Submit
  ----------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const API = id ? UPDATE_BLOG_API : CREATE_BLOG_API;

      const fd = new FormData();

      if (id) {
        fd.append("id", id);
      }

      fd.append("title", formData.title);
      fd.append("category", formData.category);
      fd.append("content", formData.content);
      fd.append("status", formData.status ? "published" : "draft");
      fd.append("author", formData.author);

      if (formData.embed) {
        fd.append("embed", formData.embed);
      }

      if (formData.image) {
        fd.append("image", formData.image);
      }

      const res = await axios.post(API, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/blogs");
      } else {
        toast.error(res.data.msg);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper" style={{ padding: "10px" }}>
      <div className="content-header">
        <h1>{id ? "Edit Blog" : "Add Blog"}</h1>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main" style={{ padding: "30px" }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <small className="text-danger">{errors.title}</small>
                )}
              </div>

              <div className="mb-3">
                <label>Category *</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((c, index) => (
                    <option key={index} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Blog Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "200px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                  }}
                />
              )}

              <div className="mb-3">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Content *</label>

                <div style={{ marginBottom: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setIsHtmlMode(!isHtmlMode)}
                  >
                    {isHtmlMode ? "Switch to Editor" : "HTML Mode"}
                  </button>
                </div>

                {isHtmlMode ? (
                  <textarea
                    className="form-control"
                    rows="10"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: e.target.value,
                      })
                    }
                  />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        content: value,
                      })
                    }
                    modules={quillModules}
                    formats={quillFormats}
                  />
                )}
              </div>

              <div className="mb-3">
                <label>Embed HTML</label>
                <textarea
                  name="embed"
                  className="form-control"
                  rows="4"
                  value={formData.embed}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label>Status </label>
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : id ? "Update Blog" : "Publish Blog"}
                </button>

                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => setShowPreview(true)}
                >
                  Preview
                </button>

                {id && (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => setShowHtmlPreview(true)}
                  >
                    Show HTML
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/blogs")}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* PREVIEW MODAL */}
            {showPreview && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.6)",
                  zIndex: 9999,
                  overflowY: "auto",
                  padding: "40px",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    maxWidth: "1000px",
                    margin: "0 auto",
                    padding: "30px",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => setShowPreview(false)}
                    className="btn btn-danger"
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "20px",
                    }}
                  >
                    Close
                  </button>

                  <h2>{formData.title}</h2>

                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{
                      __html: formData.content,
                    }}
                  />

                  {formData.embed && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formData.embed,
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* HTML VIEW MODAL */}
            {showHtmlPreview && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.6)",
                  zIndex: 10000,
                  overflowY: "auto",
                  padding: "40px",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    maxWidth: "1000px",
                    margin: "0 auto",
                    padding: "30px",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => setShowHtmlPreview(false)}
                    className="btn btn-danger"
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "20px",
                    }}
                  >
                    Close
                  </button>

                  <h2>HTML Content</h2>

                  <textarea
                    readOnly
                    value={rawHtmlContent}
                    style={{
                      width: "100%",
                      minHeight: "500px",
                      marginTop: "20px",
                      padding: "15px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      background: "#f8f9fa",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddBlog;