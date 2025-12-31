import React, { useState, useEffect } from "react";

const EditRole = ({ existingRole }) => {
    
  // existingRole is an optional prop for edit mode
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState(true);
  const [permissions, setPermissions] = useState([]);

  // Modules and their permissions
  const modules = {
    Dashboard: ["View", "Edit", "Delete"],
    Users: ["View", "Edit", "Delete", "Create"],
    Posts: ["View", "Edit", "Delete", "Create"],
  };

  // Load existing role data if editing
  useEffect(() => {
    if (existingRole) {
      setRoleName(existingRole.roleName || "");
      setStatus(existingRole.status ?? true);
      setPermissions(existingRole.permissions || []);
    }
  }, [existingRole]);

  // Toggle permission
  const handlePermissionChange = (module, perm) => {
    const key = `${module}_${perm}`;
    if (permissions.includes(key)) {
      setPermissions(permissions.filter((p) => p !== key));
    } else {
      setPermissions([...permissions, key]);
    }
  };

  // Toggle status
  const handleToggleStatus = () => setStatus(!status);

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      alert("Please enter a role name");
      return;
    }

    const roleData = { roleName, status, permissions };
    if (existingRole) {
      console.log("Role Updated:", roleData); // Call API to update role
      alert("Role updated successfully (check console)");
    } else {
      console.log("Role Created:", roleData); // Call API to create role
      alert("Role created successfully (check console)");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="m-0 text-dark">
            {existingRole ? "Edit Role" : "Add Role"} and Permissions
          </h1>
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
                    placeholder="Role name"
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
                    <div
                      key={module}
                      className="mb-2 d-flex align-items-center flex-wrap"
                    >
                      {/* Module Name */}
                      <span
                        className="me-3"
                        style={{ fontWeight: "bold", minWidth: "120px" }}
                      >
                        {module}:
                      </span>

                      {/* Permissions Checkboxes */}
                      {modules[module].map((perm) => {
                        const key = `${module}_${perm}`;
                        return (
                          <div key={key} className="form-check form-check-inline">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={key}
                              checked={permissions.includes(key)}
                              onChange={() => handlePermissionChange(module, perm)}
                            />
                            <label className="form-check-label" htmlFor={key}>
                              {perm}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="row mb-3">
                <div className="col-lg-4"></div>
                <div className="col-lg-4 d-flex" style={{ gap: "10px" }}>
                  <button type="submit" className="btn btn-primary">
                    {existingRole ? "Update" : "Submit"}
                  </button>
                  <button type="button" className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditRole;
