import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";

const SubAdminList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  // Simulate API fetch
  useEffect(() => {
    const dummyUsers = [
      {
        id: "1",
        name: "Ajay Diwakar",
        email: "ajay@example.com",
        phone: "9876543210",
        role: "Sub Admin",
        userType: "Seller",
        status: true,
        createdAt: "2025-01-10",
      },
      {
        id: "2",
        name: "Radha Sharma",
        email: "radha@example.com",
        phone: "9123456780",
        role: "Sub Admin",
        userType: "Buyer",
        status: false,
        createdAt: "2025-02-15",
      },
      {
        id: "3",
        name: "Mohan Patel",
        email: "mohan@example.com",
        phone: "9812345678",
        role: "Sub Admin",
        userType: "Seller",
        status: true,
        createdAt: "2025-03-20",
      },
    ];

    setTimeout(() => {
      setUsers(dummyUsers);
      setFilteredUsers(dummyUsers);
    }, 500);
  }, []);

  // Toggle status
  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: !user.status } : user
      )
    );
    setFilteredUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: !user.status } : user
      )
    );

    // TODO: Call API to update status
  };

  // Table columns
  const columns = [
    { header: "Sno", accessor: "index" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Role", accessor: "role" },
    { header: "User Type", accessor: "userType" },
    {
      header: "Status",
      render: (user) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={user.status}
            onChange={() => handleToggleStatus(user.id)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    { header: "Created At", accessor: "createdAt" },
    {
      header: "Action",
      render: (user) => (
        <div className="d-flex gap-2">
          <Link to={`/sub-admins/edit/${user.id}`}>
            <i className="fa fa-edit text-primary" aria-hidden="true"></i>
          </Link>
        </div>
      ),
    },
  ];

  // Search handler
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const indexOfLastItem = currentPage * usersPerPage;
  const indexOfFirstItem = indexOfLastItem - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="m-0 text-dark">Manage Sub Admins</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/sub-admins/add")}
          >
            Add Sub Admin
          </button>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-top d-flex justify-content-between align-items-center">
              <div className="box-main-title">Sub Admin List</div>
              <div className="box-main-top-right">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="box-main-table mt-3">
              <DataTable
                columns={columns}
                data={currentUsers}
                startIndex={indexOfFirstItem}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubAdminList;
