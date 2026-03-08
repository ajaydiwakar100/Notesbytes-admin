import React, { useEffect, useState } from "react";
import axios from "axios";
import { SUMMARY_REPORT_API } from "../../config";
import { toast } from "react-toastify";


const SummaryReport = () => {

  const [summaryData, setSummaryData] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: ""
  });

  // ================================
  // HANDLE DATE CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ================================
  // FETCH SUMMARY REPORT
  // ================================
  const fetchSummaryReport = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(SUMMARY_REPORT_API, {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {

        const data = res.data.data;

        const summary = [
          { title: "Total Orders", value: data.totalOrders },
          { title: "Total Sellers", value: data.totalSellers },
          { title: "Total Buyers", value: data.totalBuyers },
          { title: "Total Admin Commission", value: `₹${data.totalAdminCommission}` },
          { title: "Total Seller Earnings", value: `₹${data.totalSellerEarnings}` },
          { title: "Total Referral", value: data.totalReferral },
          { title: "Total Referral Payout", value: `₹${data.totalReferralPayout}` },
          { title: "Total Document Uploaded", value: data.totalDocuments },
          { title: "Total Pending Document", value: data.pendingDocuments },
          { title: "Total Approved Document", value: data.approvedDocuments },
        ];

        setSummaryData(summary);
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch summary report");
    }
  };

  useEffect(() => {
    fetchSummaryReport();
  }, []);

  // ================================
  // FILTER BUTTON
  // ================================
  const handleFilter = () => {
    fetchSummaryReport();
  };

  const handleReset = () => {

    setFilters({
      startDate: "",
      endDate: ""
    });

    setTimeout(() => {
      fetchSummaryReport();
    }, 100);
  };

    const exportCSV = async () => {
        try {

            const { data } = await axios.get("/api/admin/export-full-report", {
                params: filters,
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(data);

            const link = document.createElement("a");
            link.href = url;
            link.download = "summary-report.csv";
            link.click();

        } catch (err) {
            console.error(err);
        }
    };

  // ================================
  // UI
  // ================================
  return (
    <div className="content-wrapper">

      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 text-dark">Summary Report</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">

          <div className="box-main">

            {/* =======================
                DATE FILTER
            ======================= */}
            <div className="d-flex justify-content-end mt-3">
              <div className="row w-100">

                <div className="col-md-3">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label>To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    value={filters.endDate}
                    min={filters.startDate}   // prevents selecting before From Date
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-end gap-2">

                  <button
                    className="btn btn-primary"
                    onClick={handleFilter}
                  >
                    Filter
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={exportCSV}
                  >
                    Export CSV
                  </button>

                </div>

              </div>
            </div>

            {/* =======================
                SUMMARY TABLE
            ======================= */}

            <div className="table-responsive mt-3" style={{ padding: "20px" }}>

              <table className="table table-bordered admin-table">

                <thead>
                  <tr>
                    <th style={{ width: "70%" }}>Heading</th>
                    <th style={{ width: "30%" }}>Count / Amount</th>
                  </tr>
                </thead>

                <tbody>

                  {summaryData.map((item, index) => (
                    <tr key={index}>
                      <td> <b>{item.title}</b></td>
                      <td>{item.value}</td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default SummaryReport;