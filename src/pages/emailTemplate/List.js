import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import { EMAIL_LIST_API}  from "../../config";
import Pagination from "../../layouts/Pagination";

const EmailTemplateList = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  // -------------------------
  // FETCH EMAIL TEMPLATES
  // -------------------------
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(EMAIL_LIST_API);

      if (res.data.status === "success") {
        setTemplates(res.data.data);
        setFilteredTemplates(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // -------------------------
  // STATUS TOGGLE
  // -------------------------
  const handleToggleStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/email-template/status/${id}`, {
        status: !status,
      });

      fetchTemplates(); // refresh list
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  // -------------------------
  // TABLE COLUMNS
  // -------------------------
  const columns = [
    {
      header: "Sno",
      render: (row, index) => index + 1,
    },
    { header: "Template Name", accessor: "key" },
    { header: "Subject", accessor: "subject" },

    // {
    //   header: "Status",
    //   render: (tpl) => (
    //     <label className="switch">
    //       <input
    //         type="checkbox"
    //         checked={tpl.isActive}
    //         onChange={() => handleToggleStatus(tpl._id, tpl.status)}
    //       />
    //       <span className="slider round"></span>
    //     </label>
    //   ),
    // },

    {
      header: "Created At",
      render: (tpl) =>
        new Date(tpl.createdAt).toLocaleDateString(),
    },

    {
      header: "Action",
      render: (tpl) => (
        <div className="d-flex gap-2">
          <Link to={`/email-template/edit/${tpl._id}`}>
            <i className="fa fa-edit text-primary" />
          </Link>
        </div>
      ),
    },
  ];

  // -------------------------
  // SEARCH
  // -------------------------
  // const handleSearchChange = (e) => {
  //   const query = e.target.value.toLowerCase();
  //   setSearchQuery(query);

  //   const filtered = templates.filter(
  //     (tpl) =>
  //       tpl.name.toLowerCase().includes(query) ||
  //       tpl.subject.toLowerCase().includes(query)
  //   );

  //   (filtered);
  // };

    const handleSearchChange = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = templates.filter((b) =>
        b.title?.toLowerCase().includes(query) ||
        b.category?.toLowerCase().includes(query) ||
        b.author?.toLowerCase().includes(query)
      );

      setFilteredTemplates(filtered);
      setCurrentPage(1);
    };

   // PAGINATION
  const totalPages = Math.ceil(filteredTemplates.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = filteredTemplates.slice(indexOfFirst, indexOfLast);

  return (
    <div className="content-wrapper">
      <div className="content-header d-flex justify-content-between align-items-center">
        <h1 className="m-0 text-dark">Manage Email Templates</h1>
      </div>

      <section className="content">
        <div className="container-fluid mt-3">
          <div className="box-main">

            <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title">Template List</div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>

            <div className="box-main-table mt-3">
              <DataTable
                columns={columns}
                data={filteredTemplates}
                startIndex={0}
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

export default EmailTemplateList;