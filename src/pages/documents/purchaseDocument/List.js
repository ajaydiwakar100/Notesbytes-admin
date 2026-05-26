import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "../../../layouts/DataTable";
import SearchBar from "../../../layouts/SearchBar";
import Pagination from "../../../layouts/Pagination";
import axios from "axios";
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap"; 
import { LIST_PURCHASE_ORDERS_API, GET_INVOICE_BY_USER} from "../../../config";

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 10;
  const location = useLocation();

  /* =========================
     Format Date
  ========================= */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const token = localStorage.getItem("token");

  /* =========================
     Fetch Orders
  ========================= */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      

      let apiUrl = LIST_PURCHASE_ORDERS_API;

      // Optional route based filter
      if (location.pathname.includes("/orders/completed")) {
        apiUrl += "?status=completed";
      } else if (location.pathname.includes("/orders/pending")) {
        apiUrl += "?status=pending";
      }

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        const apiOrders = response.data.data;

        const formatted = apiOrders.map((o, index) => ({
          index: index + 1,
          id: o._id,
          orderId: o.razorpayOrderId || "-",
          buyerName: o.userId?.name || "-",
          buyerEmail: o.userId?.email || "-",
          buyerId: o.userId?._id || "-",
          amount: o.amount ? `₹${o.amount}` : "-",
          paymentStatus: o.status
            ? o.status.charAt(0).toUpperCase() + o.status.slice(1)
            : "N/A",
          createdAt: formatDate(o.created_at),
          items: o.items,
        }));

        setOrders(formatted);
        setFilteredOrders(formatted);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

    /* ---------------- PURCHASE INVOICE ---------------- */
  const handleDownloadInvoice = async (orderId) => {
    try {
     
      const response = await axios.get(`${GET_INVOICE_BY_USER}?orderId=${orderId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice");
    }
  };

  /* =========================
     Fetch on Route Change
  ========================= */
  useEffect(() => {
    fetchOrders();
  }, [location.pathname]);

  /* =========================
     Search
  ========================= */
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = orders.filter((order) =>
      order.orderId.toLowerCase().includes(query) ||
      order.buyerName.toLowerCase().includes(query) ||
      order.buyerEmail.toLowerCase().includes(query) ||
      order.paymentStatus.toLowerCase().includes(query)
    );

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  /* =========================
     Pagination
  ========================= */
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  /* =========================
     Table Columns
  ========================= */
  const columns = [
  {
    header: "Sno",
    className: "text-center",
    render: (_, index) => index + 1,
    sortable: true,
    sortValue: (_, index) => index + 1,
  },
  {
    header: "Order ID",
    accessor: "orderId",
    className: "text-center",
    sortable: true,
  },
  {
    header: "Buyer",
    accessor: "buyerName",
    className: "text-center",
    sortable: true,
  },
  {
    header: "Email",
    accessor: "buyerEmail",
    className: "text-center",
    sortable: true,
  },
  {
    header: "Amount",
    accessor: "amount",
    className: "text-center",
  },
  {
    header: "Items",
    className: "text-center",
    sortable: true,
    render: (row) => ( <ul className="mb-0 ps-3"> {row.items.map((item) => ( <li key={item._id}> {item.title} (₹{item.price} × {item.quantity}) </li> ))} </ul> ),
  },
  {
    header: "Payment Status",
    className: "text-center",
    sortable: true,
    render: (row) => (
      <span
        className={`badge ${
          row.paymentStatus === "PAID"
            ? "badge-success"
            : "badge-warning"
        }`}
      >
        {row.paymentStatus}
      </span>
    ),
  },
  {
    header: "Date",
    accessor: "createdAt",
    className: "text-center",
    sortable: true,
  },
  {
    header: "Invoice",
    className: "text-center",
    sortable: true,
    render: (row) => (
      <i
        className="fa fa-file-pdf text-danger"
        style={{ cursor: "pointer", fontSize: 18 }}
        title="Download Invoice"
        onClick={() => handleDownloadInvoice(row.id)}
      />
    ),
  },
  {
    header: "Action",
    className: "text-center",
    sortable: true,
    render: (row) => (
      <Link to={`/users/detail/${row.buyerId}`}>
        <i
          className="fa fa-eye text-success"
          style={{ cursor: "pointer", fontSize: 18 }}
          title="View Details"
        ></i>
      </Link>
    ),
  },
];


  if (loading) {
    return <div className="text-center p-3">Loading Orders...</div>;
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 text-dark">Purchase Orders</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title">Order List</div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>

            <div className="box-main-table mt-3">
              <DataTable
                columns={columns}
                data={currentOrders}
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

export default PurchaseOrderList;
