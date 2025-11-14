import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";

const EmailTemplateList = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  // Simulate fetching from API
  useEffect(() => {
    const dummyTemplates = [
      {
        id: "1",
        name: "Welcome Email",
        subject: "Welcome to our platform!",
        status: true,
        createdAt: "2025-01-10",
      },
      {
        id: "2",
        name: "Password Reset",
        subject: "Reset your password",
        status: false,
        createdAt: "2025-02-15",
      },
    ];
    setTemplates(dummyTemplates);
    setFilteredTemplates(dummyTemplates);
  }, []);

  const handleToggleStatus = (id) => {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.id === id ? { ...tpl, status: !tpl.status } : tpl))
    );
    setFilteredTemplates((prev) =>
      prev.map((tpl) => (tpl.id === id ? { ...tpl, status: !tpl.status } : tpl))
    );
  };

  const columns = [
    { header: "Sno", accessor: "index" },
    { header: "Template Name", accessor: "name" },
    { header: "Subject", accessor: "subject" },
    {
      header: "Status",
      render: (tpl) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={tpl.status}
            onChange={() => handleToggleStatus(tpl.id)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    { header: "Created At", accessor: "createdAt" },
    {
      header: "Action",
      render: (tpl) => (
        <div className="d-flex gap-2">
          <Link to={`/email-template/edit/${tpl.id}`}>
            <i className="fa fa-edit text-primary" />
          </Link>
        </div>
      ),
    },
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = templates.filter(
      (tpl) =>
        tpl.name.toLowerCase().includes(query) ||
        tpl.subject.toLowerCase().includes(query)
    );
    setFilteredTemplates(filtered);
  };

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
              <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            </div>

            <div className="box-main-table mt-3">
              <DataTable columns={columns} data={filteredTemplates} startIndex={0} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailTemplateList;
