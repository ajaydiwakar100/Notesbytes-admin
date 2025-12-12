import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";
import axios from "axios";

import {
  LIST_USERS_API,
  CHANGE_USERS_STATUS_API,
} from "../../config";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // Fetch Users From API
  // =========================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Add query if route is /users/buyers or /users/sellers
      let apiUrl = LIST_USERS_API;
      if (location.pathname.includes("/users/buyers")) {
        apiUrl += "?user_type=buyer";
      } else if (location.pathname.includes("/users/sellers")) {
        apiUrl += "?user_type=seller";
      }

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        const apiUsers = response.data.data;

        const formatted = apiUsers.map((u, index) => ({
          index: index + 1,
          id: u._id,
          name: u.name || "-",
          email: u.email || "-",
          phone: u.phone || "-",
          userType: u.userType
            ? u.userType.charAt(0).toUpperCase() + u.userType.slice(1)
            : "N/A",
          status: Number(u.status) === 1, // boolean
          isRefferal: u.referredBy ? "Yes": 'No',
          createdAt: u.createdAt ? formatDate(u.createdAt) : "-",
        }));

        setUsers(formatted);
        setFilteredUsers(formatted);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Effect: fetch on mount or route change
  // =========================
  useEffect(() => {
    fetchUsers();
  }, [location.pathname]); // <-- dynamic fetch on route change

  // =========================
  // Toggle Status
  // =========================
  const handleToggleStatus = async (userId) => {
    const currentUser = users.find((u) => u.id === userId);
    const newStatus = !currentUser.status;

    // instant UI toggle
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    setFilteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        CHANGE_USERS_STATUS_API,
        {
          id: userId,
          status: newStatus ? 1 : 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Status update failed:", err);

      // rollback UI
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: !newStatus } : u
        )
      );

      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: !newStatus } : u
        )
      );
    }
  };

  // =========================
  // Table Columns
  // =========================
  const columns = [
    { header: "Sno", accessor: "index" },
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Email", accessor: "email" },
    { header: "Type", accessor: "userType" },
    { header: "Refferal", accessor: "isRefferal" },
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
        <Link to={`/users/detail/${user.id}`}>
          <i className="fa fa-eye text-success"></i>
        </Link>
      ),
    },
  ];

  // =========================
  // Search Handler
  // =========================
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter((user) =>
      (user.name?.toLowerCase() || "").includes(query) ||
      (user.email?.toLowerCase() || "").includes(query) ||
      (user.phone?.toLowerCase() || "").includes(query) ||
      (user.userType?.toLowerCase() || "").includes(query)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // =========================
  // Pagination
  // =========================
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  if (loading) return <div className="text-center p-3">Loading Users...</div>;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 text-dark">Manage Users</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title">User List</div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>

            <div className="box-main-table mt-3">
              <DataTable
                columns={columns}
                data={currentUsers}
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

export default UserList;
