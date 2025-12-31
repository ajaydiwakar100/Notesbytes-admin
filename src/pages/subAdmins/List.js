import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";
import axios from "axios";
import {
  LIST_SUB_ADMIN_API,
  CHANGE_SUB_ADMIN_STATUS_API,
} from "../../config";

const SubAdminList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch Sub Admin List
  const fetchSubAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(LIST_SUB_ADMIN_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        const apiUsers = response.data.data;

        const formatted = apiUsers.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || "-",
          role: u.role || "N/A",
          userType: u.user_type || "N/A",
          status: u.status === 1 ? true : false,
          createdAt: formatDate(u.createdAt),
        }));

        setUsers(formatted);
        setFilteredUsers(formatted);
      }
    } catch (err) {
      console.error("Error fetching sub-admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  // Toggle status + API call
  const handleToggleStatus = async (userId) => {
    const currentUser = users.find((u) => u.id === userId);
    const newStatus = !currentUser.status;

    // Update UI instantly
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setFilteredUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );

    try {
      const token = localStorage.getItem("token");

      await axios.put(CHANGE_SUB_ADMIN_STATUS_API,
        { status: newStatus ? 1 : 0, id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Status update failed:", err);

      // Rollback UI if API failed
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: !newStatus } : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: !newStatus } : user
        )
      );
    }
  };

  const columns = [
    { header: "Sno", accessor: "index" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Role", accessor: "role" },

    {
      header: "User Type",
      accessor: "userType",
      render: (row) => {
        let str = row.userType.toLowerCase();
        str = str.replace("admin", " admin");
        return str
          .trim()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      },
    },

  

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
        <Link to={`/sub-admins/edit/${user.id}`}>
          <i className="fa fa-edit text-primary"></i>
        </Link>
      ),
    },
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return <div className="text-center p-3">Loading Sub Admins...</div>;
  }

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

            <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title">Sub Admin List</div>
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

export default SubAdminList;
