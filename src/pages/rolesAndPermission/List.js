import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";
import axios from "axios";
import { LIST_ROLE_API, CHANGE_STATUS_ROLE_API } from "../../config"; 
import { toast } from "react-toastify";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoleModules, setSelectedRoleModules] = useState(null);
  const rolesPerPage = 10;
  const navigate = useNavigate();

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(LIST_ROLE_API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setRoles(res.data.data);
          setFilteredRoles(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        if (err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    };
    fetchRoles();
  }, []);

  // Toggle role status
  const handleToggleStatus = async (roleId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      // Optimistically update UI immediately
      setRoles((prev) =>
        prev.map((role) =>
          role.id === roleId ? { ...role, status: !role.status } : role
        )
      );

      // Call API to save change
      const res = await axios.post(
        CHANGE_STATUS_ROLE_API,
        { id: roleId, status: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status !== "success") {
        // Revert if API fails
        setRoles((prev) =>
          prev.map((role) =>
            role.id === roleId ? { ...role, status: currentStatus } : role
          )
        );
        toast.error(res.data.msg || "Failed to update status");
      } else {
        toast.success(res.data.msg || "Status updated successfully");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      // Revert if API fails
      setRoles((prev) =>
        prev.map((role) =>
          role.id === roleId ? { ...role, status: currentStatus } : role
        )
      );
      toast.error("Something went wrong!");
    }
  };



  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.modules.some((mod) =>
          mod.permissions.some((perm) => perm.toLowerCase().includes(query))
        )
    );

    setFilteredRoles(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage) || 1;
  const indexOfLastItem = currentPage * rolesPerPage;
  const indexOfFirstItem = indexOfLastItem - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Table columns
  const columns = [
    { header: "Sno", accessor: "index" },
    { header: "Role Name", accessor: "name" },
    {
      header: "Status",
      render: (role) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={role.status} 
            onChange={() => handleToggleStatus(role.id, role.status)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    {
      header: "Created At",
      render: (role) => {
        const date = new Date(role.createdAt);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate().toString().padStart(2, "0");
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      header: "Action",
        render: (role) => (
          <div className="d-flex gap-2">
            {/* Edit icon */}
            <Link to={`/roles/edit/${role.id}`}>
              <i className="fa fa-edit text-primary" aria-hidden="true"></i>
            </Link>
            &nbsp;&nbsp;&nbsp;
            {/* Info icon */}
            <i
              className="fa fa-info-circle text-primary mt-1"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedRoleModules(role.modules)}
            />
          </div>
        ),
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="m-0 text-dark">Manage Roles & Permissions</h1>
          <button className="btn btn-primary" onClick={() => navigate("/roles/add")}>
            Add Role
          </button>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-top d-flex justify-content-between align-items-center">
              <div className="box-main-title">Role List</div>
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
                data={currentRoles}
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

      {/* Modules & Permissions Modal */}
      {selectedRoleModules && (
        <div className="modal-overlay" onClick={() => setSelectedRoleModules(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h5>Modules & Permissions</h5>
            <ul>
              {selectedRoleModules.map((mod) => (
                <li key={mod.name}>
                  <strong>{mod.name}:</strong> {mod.permissions.join(", ")}
                </li>
              ))}
            </ul>
            <button className="btn btn-secondary" onClick={() => setSelectedRoleModules(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleList;
