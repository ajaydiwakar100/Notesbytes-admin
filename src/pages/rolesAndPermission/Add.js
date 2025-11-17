import React, { useState,useEffect } from "react";
import { FETCH_ROLES_MODULES_API, ADD_ROLE_API, GET_ROLE_API } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate,Link,useParams } from 'react-router-dom';


const AddRole = () => {
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState({});
  const navigate = useNavigate();
  
  // Edit call
  const { id } = useParams();

  
  // Modules and their permissions
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(FETCH_ROLES_MODULES_API, {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          // Convert array → object like { "Dashboard": ["View", "Create", ...] }
          const formattedModules = {};

          res.data.data.forEach((mod) => {
            // Use module name as key, and extract only permission names
            formattedModules[mod.name] = mod.permissions?.map((p) => ({
              id: p._id,
              name: p.name
            })) || [];
          });
          setModules(formattedModules);
        } else {
          console.warn("Unexpected API format:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch modules:", err);

        // Redirect to login if unauthorized
        if (err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    };

    fetchModules();
  }, []);

  // Fetch role details if editing
  useEffect(() => {
    if (!id) return; // Only fetch if id exists
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${GET_ROLE_API}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          const role = res.data.data;
          setRoleName(role.name);
          setStatus(role.status);
          setPermissions(role.permissionId || []); // assuming API returns permission IDs
        } else {
          toast.error(res.data.msg || "Failed to fetch role");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        if (err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          toast.error("Something went wrong!");
        }
      }
    };
    fetchRole();
  }, [id]);


  // Toggle permission
  const handlePermissionChange = (permId) => {
    if (permissions.includes(permId)) {
      setPermissions(permissions.filter((id) => id !== permId));
    } else {
      setPermissions([...permissions, permId]);
    }
  };

  // Toggle status
  const handleToggleStatus = () => setStatus(!status);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Validate role name
    if (!roleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    // 2️⃣ Validate permissions
    if (permissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    // Prepare payload for API
    const payload = {
      name: roleName,
      status: !!status,
       ...(id ? { _id: id } : {}),
      permissionId: permissions.map((p) => {
        return p; // Replace with permission ID if you store it
      }),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(ADD_ROLE_API, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        toast.success(res.data.msg);

        // Reset form
        setRoleName("");
        setStatus(true);
        setPermissions([]);

        navigate("/roles");

      } else {
        toast.error(res.data.msg || "Failed to create role");
      }
    } catch (err) {
      console.error("Error creating role:", err);

      // Redirect to login if unauthorized
      if (err.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="m-0 text-dark">{id ? "Edit Role and Permissions" : "Add Roles and Permissions"}</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <form onSubmit={handleSubmit}>
               
                {/* Role Name */}
                <div className="row mb-3">
                    <div className="col-lg-4">
                        <label className="lableClass">Role Name</label>
                    </div>
                    <div className="col-lg-4">
                        <input
                            type="text"
                            className="form-control"
                            value={roleName}
                            placeholder="Role name "
                            onChange={(e) => setRoleName(e.target.value)}
                            style={{ marginTop: "10px" }}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="row mb-3">
                    <div className="col-lg-4">
                    <label className="lableClass">Status</label>
                    </div>
                    <div className="col-lg-4">
                    <label className="switch" style={{ marginTop: "10px" }}>
                        <input
                        type="checkbox"
                        checked={status}
                        onChange={handleToggleStatus}
                        />
                        <span className="slider round"></span>
                    </label>
                    </div>
                </div>
            
                {/* Permissions by module */}
                <div className="row mb-3">
                  <div className="col-lg-4">
                    <label className="lableClass">Permissions</label>
                  </div>
                  <div className="col-lg-8">
                    {Object.keys(modules).map((module) => (
                      <div key={module} className="row align-items-center mb-3">
                        {/* Left column: Module name */}
                        <div className="col-lg-3">
                          <label className="labelClass" style={{ fontWeight: "bold" }}>
                            {module}
                          </label>
                        </div>

                        {/* Right column: Permissions checkboxes */}
                        <div className="col-lg-9">
                          <div className="d-flex flex-wrap gap-3">
                            {modules[module].map((perm) => {
                            const key = `${module}-${perm.id}`;
                            return (
                              <div key={key} className="form-check form-check-inline">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={key}
                                  checked={permissions.includes(perm.id)}
                                  onChange={() => handlePermissionChange(perm.id)}
                                />
                                <label className="form-check-label" htmlFor={key}>
                                  {perm.name.charAt(0).toUpperCase() + perm.name.slice(1)}
                                </label>
                              </div>
                            );
                          })}

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Submit */}
                 <div className="row mb-3" style={{  marginTop: "20px" }}>
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4 d-flex" style={{  gap: "10px" }}>
                        <button type="submit" className="btn btn-primary">Submit</button>
                         <button type="button" className="btn btn-secondary"
                         onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </div>
              
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddRole;
