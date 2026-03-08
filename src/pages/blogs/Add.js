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

const AddBlog = () => {
   const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          const d = res.data.data;

          setFormData({
            title: d.title || "",
            category: d.category || "",
            image: null,
            content: d.content || "",
            status: d.status === "published" ? true : false,
            author: d.author || "",
            embed:d.embed || ""
          });

          // ✅ show existing image
          if (d.image) {
            setImagePreview(d.image); // full URL from backend
          }
        }
      } catch {
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

      const API = id ? `${UPDATE_BLOG_API}`: CREATE_BLOG_API;
     
      const fd = new FormData();
      if (id) {
        fd.append("id", id);   // 👈 pass id in body
      }
      fd.append("title", formData.title);
      fd.append("category", formData.category);
      fd.append("content", formData.content);
      fd.append("status", formData.status ? "published" : "draft");
      fd.append("author", formData.author);

      if(formData.embed){
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


  /* ----------------------------------
     UI
  ----------------------------------*/
  return (
    <div className="content-wrapper" style={{ padding: "10px" }}>
      <div className="content-header">
        <h1>{id ? "Edit Blog" : "Add Blog"}</h1>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main" style={{ padding: "30px" }}>
            <form onSubmit={handleSubmit}>

              {/* TITLE */}
              <div className="mb-3">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </div>

              {/* CATEGORY */}
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
                {errors.category && <small className="text-danger">{errors.category}</small>}
              </div>

              {/* IMAGE */}
              <div className="mb-3">
                <label>Blog Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
               {/* IMAGE PREVIEW */}
                {imagePreview && (
                    <div style={{ marginTop: "10px" }}>
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                        width: "200px",
                        height: "auto",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        padding: "4px",
                        }}
                    />
                    </div>
                )}

                {/* AUTHOR */}
              <div className="mb-3">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  value={formData.author}
                  onChange={handleChange}
                />
                {errors.author && <small className="text-danger">{errors.author}</small>}
              </div>

              {/* CONTENT */}
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
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Paste HTML code here..."
                />
              ) : (
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              )}

              {errors.content && (
                <small className="text-danger">{errors.content}</small>
              )}
            </div>
              <div className="mb-3">
                <label>Embed HTML (Optional)</label>

                <textarea
                  name="embed"
                  className="form-control"
                  rows="4"
                  placeholder="<iframe src='...'></iframe>"
                  value={formData.embed}
                  onChange={handleChange}
                />
              </div>
              {/* STATUS */}
              <div className="mb-4">
                <label className="me-3">Status</label>
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
              </div>

              {/* BUTTONS */}
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : id ? "Update Blog" : "Publish Blog"}
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/blogs")}
              >
                Cancel
              </button>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddBlog;
