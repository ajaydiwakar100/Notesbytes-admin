import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar"; // Make sure you have this component
import Pagination from "../../layouts/Pagination"; // Make sure you have this component

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Simulate API fetch
  useEffect(() => {
    const dummyUsers = [
      {
        _id: "1",
        first_name: "Ajay",
        last_name: "Diwakar",
        phone_number: "9876543210",
        email: "ajay@example.com",
        is_kyc_approved: 1,
        is_block_user: "1",
        createdAt: "2025-10-04",
      },
      {
        _id: "2",
        first_name: "Radha",
        last_name: "Sharma",
        phone_number: "9123456780",
        email: "radha@example.com",
        is_kyc_approved: 0,
        is_block_user: "0",
        createdAt: "2025-09-25",
      },
      {
        _id: "3",
        first_name: "Mohan",
        last_name: "Patel",
        phone_number: "9812345678",
        email: "mohan@example.com",
        is_kyc_approved: 2,
        is_block_user: "1",
        createdAt: "2025-09-15",
      },
    ];

    setTimeout(() => {
      setUsers(dummyUsers);
      setFilteredUsers(dummyUsers); // initialize filtered users
    }, 1000);
  }, []);

  // Table Columns
  const columns = [
    { header: "Sno", accessor: "index" },
    {
      header: "Name",
      render: (user) => `${user.first_name} ${user.last_name}`,
    },
    { header: "Phone", accessor: "phone_number" },
    { header: "Email", accessor: "email" },
    {
      header: "KYC",
      render: (user) =>
        user.is_kyc_approved === 1
          ? "Approved"
          : user.is_kyc_approved === 2
          ? "Rejected"
          : "Pending",
    },
    {
      header: "Status",
      render: (user) => (user.is_block_user === "1" ? "Active" : "Blocked"),
    },
    { header: "Created At", accessor: "createdAt" },
    {
      header: "Action",
      render: (user) => (
        <Link to={`/users/detail/${user._id}`}>
          <i className="fa fa-eye text-success" aria-hidden="true"></i>
        </Link>
      ),
    },
  ];

  // Handle Search
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  //  Pagination Calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const indexOfLastItem = currentPage * usersPerPage;
  const indexOfFirstItem = indexOfLastItem - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  //  Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Manage Users</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-top d-flex justify-content-between align-items-center">
              <div className="box-main-title">User List</div>
              <div className="box-main-top-right">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="box-main-table mt-3">
              <DataTable columns={columns} data={currentUsers} startIndex={indexOfFirstItem} />
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

export default UserList;
