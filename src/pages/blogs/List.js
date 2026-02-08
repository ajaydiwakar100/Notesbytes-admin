import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";
import axios from "axios";
import {
  LIST_BLOG_API,
  CHANGE_BLOG_STATUS_API
} from "../../config";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 10;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // FETCH BLOGS
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(LIST_BLOG_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        const formatted = res.data.data.map((b) => ({
          id: b._id,
          title: b.title,
          category: b.category || "-",
          author: b.author || "-",
          status: b.status === "published",
          publishedAt: formatDate(b.publishedAt || b.createdAt),
        }));

        setBlogs(formatted);
        setFilteredBlogs(formatted);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // TOGGLE STATUS
  const handleToggleStatus = async (blogId) => {
    const current = blogs.find((b) => b.id === blogId);
    const newStatus = !current.status;

    // Optimistic UI
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId ? { ...b, status: newStatus } : b
      )
    );
    setFilteredBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId ? { ...b, status: newStatus } : b
      )
    );

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        CHANGE_BLOG_STATUS_API,
        {
          id: blogId,
          status: newStatus ? "published" : "draft",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Status update failed:", err);

      // Rollback
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blogId ? { ...b, status: !newStatus } : b
        )
      );
      setFilteredBlogs((prev) =>
        prev.map((b) =>
          b.id === blogId ? { ...b, status: !newStatus } : b
        )
      );
    }
  };

  // TABLE COLUMNS
  const columns = [
    { header: "Sno", accessor: "index" },
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    { header: "Author", accessor: "author" },

    {
      header: "Status",
      render: (blog) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={blog.status}
            onChange={() => handleToggleStatus(blog.id)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },

    { header: "Published On", accessor: "publishedAt" },

    {
      header: "Action",
      render: (blog) => (
        <Link to={`/blogs/edit/${blog.id}`}>
          <i className="fa fa-edit text-primary"></i>
        </Link>
      ),
    },
  ];

  // SEARCH
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
    );

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return <div className="text-center p-3">Loading Blogs...</div>;
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="m-0 text-dark">Manage Blogs</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/blogs/add")}
          >
            Add Blog
          </button>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">

            <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title">Blog List</div>
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>

            <div className="box-main-table mt-3">
              <DataTable
                columns={columns}
                data={currentBlogs}
                startIndex={indexOfFirst}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;
