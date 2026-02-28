import React, { useEffect, useState } from "react";
import axios from "axios";
import { DASHBOARD_API } from "../config"; // your API
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPurchasedDocs: 0,
    totalPendingDocs: 0,
    totalApprovedDocs: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(DASHBOARD_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 text-dark">Dashboard</h1>
        </div>
      </div>

     <section className="content">
        <div className="container-fluid">
            <div className="row">

            {/* Total Users */}
            <div className="col-lg-3 col-6">
                <a href="/admin/users" style={{ textDecoration: "none" }}>
                <div className="small-box bg-orange">
                    <div className="inner">
                    <p>Users</p>
                    <h3>{stats.totalUsers}</h3>
                    </div>
                    <div className="icon">
                    <i
                        className="fa fa-user-friends"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Total registered users"
                    ></i>
                    </div>
                </div>
                </a>
            </div>

            {/* Purchased Documents */}
            <div className="col-lg-3 col-6">
                <a href="/admin/documents/purchase-orders" style={{ textDecoration: "none" }}>
                <div className="small-box bg-blue">
                    <div className="inner">
                    <p>Purchased Documents</p>
                    <h3>{stats.totalPurchasedDocs}</h3>
                    </div>
                    <div className="icon">
                    <i
                        className="fa fa-shopping-bag"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Total documents purchased"
                    ></i>
                    </div>
                </div>
                </a>
            </div>

            {/* Pending Documents */}
            <div className="col-lg-3 col-6">
                <a href="/admin/documents/upload-documents" style={{ textDecoration: "none" }}>
                <div className="small-box bg-red">
                    <div className="inner">
                    <p>Pending Documents</p>
                    <h3>{stats.totalPendingDocs}</h3>
                    </div>
                    <div className="icon">
                    <i
                        className="fa fa-hourglass-half"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Documents waiting for approval"
                    ></i>
                    </div>
                </div>
                </a>
            </div>

            {/* Approved Documents */}
            <div className="col-lg-3 col-6">
                <a href="/admin/documents/upload-documents" style={{ textDecoration: "none" }}>
                <div className="small-box bg-green">
                    <div className="inner">
                    <p>Approved Documents</p>
                    <h3>{stats.totalApprovedDocs}</h3>
                    </div>
                    <div className="icon">
                    <i
                        className="fa fa-check"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Documents approved by admin"
                    ></i>
                    </div>
                </div>
                </a>
            </div>

            </div>
        </div>
    </section>
    </div>
  );
};

export default Dashboard;