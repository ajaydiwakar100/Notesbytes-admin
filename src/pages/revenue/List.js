import React, { useState, useEffect } from "react";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";
import axios from "axios";
import { LIST_REVENUE_API, MARK_REVENUE_PAID_API } from "../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const RevenueList = () => {

  const [revenues, setRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    transactionId: "",
    amount: "",
    status: "SETTLED",
    revenueId:""
  });

  const navigate = useNavigate();
  const revenuesPerPage = 10;

  // ================================
  // FETCH REVENUE
  // ================================

   const fetchRevenues = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(LIST_REVENUE_API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {

          const { pending, settled, failed, partial } = res.data.data.transactions;

          const allRevenues = [
            ...pending,
            ...settled,
            ...failed,
            ...partial
          ];

          setRevenues(allRevenues);
          setFilteredRevenues(allRevenues);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch revenue data");
      }
    };
  useEffect(() => {
    fetchRevenues();
  }, []);

  // ================================
  // SEARCH
  // ================================
  const handleSearchChange = (e) => {

    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = revenues.filter((rev) =>
      rev.transactionId?.toLowerCase().includes(query) ||
      rev.userName?.toLowerCase().includes(query) ||
      rev.sellerName?.toLowerCase().includes(query)
    );

    setFilteredRevenues(filtered);
    setCurrentPage(1);
  };

  // ================================
  // PAGINATION
  // ================================
  const totalPages = Math.ceil(filteredRevenues.length / revenuesPerPage) || 1;

  const indexOfLastItem = currentPage * revenuesPerPage;
  const indexOfFirstItem = indexOfLastItem - revenuesPerPage;

  const currentRevenues = filteredRevenues.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ================================
  // OPEN MODAL
  // ================================
  const openPaymentModal = (row) => {

    setSelectedRevenue(row);

    setPaymentForm({
      transactionId: "",
      amount: row.sellerAmount,
      status: "SETTLED",
      revenueId:row._id
    });

    setShowPaymentModal(true);
  };

  // ================================
  // HANDLE FORM CHANGE
  // ================================
  const handlePaymentChange = (e) => {

    const { name, value } = e.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // SUBMIT PAYMENT
  // ================================
  const handlePaymentSubmit = async () => {

    // Validation
    if (!paymentForm.transactionId.trim()) {
      toast.error("Transaction ID is required");
      return;
    }

    if (!paymentForm.amount || isNaN(paymentForm.amount) || Number(paymentForm.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!paymentForm.revenueId) {
      toast.error("Invalid revenue record");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        MARK_REVENUE_PAID_API,
        paymentForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.status === "success") {

        toast.success("Payment marked successfully");

        setShowPaymentModal(false);

        // reset form
        setPaymentForm({
          transactionId: "",
          amount: "",
          status: "SETTLED",
          revenueId: ""
        });

        // refresh revenue list
        fetchRevenues();

      } else {
        toast.error(res.data?.msg || "Failed to update payment");
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment");
    }
  };

  // ================================
  // TABLE COLUMNS
  // ================================
  const columns = [

    { header: "Sno", accessor: "index" },

    { header: "Transaction ID", accessor: "transactionId" },

    {
      header: "User",
      render: (row) => (
        <div>
          <strong>{row.userName}</strong>
          <br />
          <small>{row.userEmail}</small>
        </div>
      ),
    },

    { header: "Seller", accessor: "sellerName" },

    { header: "Payout Type", accessor: "payoutType" },

    {
      header: "Amount",
      render: (row) => `₹${row.amount}`,
    },

    {
      header: "Seller Earnings",
      render: (row) => `₹${row.sellerAmount}`,
    },

    {
      header: "Admin Earnings",
      render: (row) => `₹${row.adminCommission}`,
    },

    {
      header: "Status",
      render: (row) => {

        let badgeClass = "badge-secondary";

        if (row.status === "SETTLED") badgeClass = "badge-success";
        if (row.status === "PENDING") badgeClass = "badge-warning";
        if (row.status === "FAILED") badgeClass = "badge-danger";
        if (row.status === "PARTIAL") badgeClass = "badge-dark";
        

        return (
          <span className={`badge ${badgeClass}`}>
            {row.status}
          </span>
        );
      },
    },
    
    {
      header: "Created Date",
      render: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      header: "Pay Date",
      render: (row) =>
        row.paymentDate
          ? row.paymentDate
          : "N/A",
    },
    {
      header: "Action",
      render: (row) => (

        <div className="d-flex gap-2">

          
          <button
            className="btn btn-success markedAsPaid"
            onClick={() => openPaymentModal(row)}
            disabled={row.transactionId != 'N/A' ? true: false}
          >
            Mark as Paid
          </button>

          {/* <i
            className="fa fa-eye text-primary"
            style={{ cursor: "pointer", marginLeft: "10px" }}
            onClick={() => navigate(`/revenue/view/${row._id}`)}
          ></i> */}

        </div>
      ),
    },
  ];

  const exportCSV = () => {

    const headers = [
      "Transaction ID",
      "User Name",
      "User Email",
      "Seller Name",
      "Payout Type",
      "Amount",
      "Seller Earnings",
      "Admin Earnings",
      "Status",
      "Created Date",
      "Pay Date"
    ];

    const rows = revenues.map((row) => [
      row.transactionId,
      row.userName,
      row.userEmail,
      row.sellerName,
      row.payoutType,
      row.amount,
      row.sellerAmount,
      row.adminCommission,
      row.status,
      new Date(row.createdAt).toLocaleDateString(),
      row.paymentDate || "N/A"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "revenue-list.csv");

    document.body.appendChild(link);
    link.click();
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="content-wrapper">

      <div className="content-header">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h1 className="m-0 text-dark">Revenue Management</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">

          <div className="box-main">

            <div className="box-main-top d-flex justify-content-between align-items-center">

              <div className="box-main-title">
                Revenue List
              </div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            
            </div>
    
            <div className="box-main-table mt-3">
              <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-success" onClick={exportCSV}>
                  Export CSV
                </button>  
              </div>          
              <DataTable
                columns={columns}
                data={currentRevenues}
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

      {/* PAYMENT MODAL */}

      {showPaymentModal && (

        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Mark Payment</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="form-group mb-3">
              <label>Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                className="form-control"
                placeholder="Transaction Id"
                value={paymentForm.transactionId}
                onChange={handlePaymentChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                className="form-control"
                value={paymentForm.amount}
                onChange={handlePaymentChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={paymentForm.status}
                onChange={handlePaymentChange}
              >
                <option value="SETTLED">Paid</option>
                {/* <option value="PARTIAL">Partial Paid</option> */}
              </select>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>

            <Button variant="primary" onClick={handlePaymentSubmit} disabled={!paymentForm.transactionId || !paymentForm.amount}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

      )}

    </div>
  );
};

export default RevenueList;