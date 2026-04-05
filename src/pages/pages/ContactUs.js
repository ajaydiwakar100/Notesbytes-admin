import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";

import {
  GET_CONTACT_LIST,
  UPDATE_CONTACT_STATUS,
} from "../../config";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const token = localStorage.getItem("token");

  // =========================
  // Format Date
  // =========================
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // Fetch Contacts
  // =========================
  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(GET_CONTACT_LIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        const list = res.data.data || [];
        setContacts(list);
        setFilteredContacts(list);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // =========================
  // Search
  // =========================
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();

    setSearchQuery(query);

    const filtered = contacts.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.subject?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query)
    );

    setFilteredContacts(filtered);
    setCurrentPage(1);
  };

  // =========================
  // Toggle Resolved Status
  // =========================
  const handleToggleResolved = async (contact) => {
    try {
      setActionLoading(true);

      const updatedStatus = !contact.isResolved;

      const res = await axios.put(
        `${UPDATE_CONTACT_STATUS}/${contact._id}`,
        {
          isResolved: updatedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        toast.success("Status updated successfully");
        fetchContacts();
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // Pagination
  // =========================
  const totalPages = Math.ceil(
    filteredContacts.length / contactsPerPage
  );

  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;

  const currentContacts = filteredContacts.slice(
    indexOfFirst,
    indexOfLast
  );

  // =========================
  // View Details
  // =========================
  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  // =========================
  // Table Columns
  // =========================
  const columns = [
    {
      header: "S.No",
      render: (_, index) => indexOfFirst + index + 1,
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Subject",
      accessor: "subject",
    },
    {
      header: "Resolved",
      render: (row) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.isResolved === true}
            disabled={actionLoading}
            onChange={() => handleToggleResolved(row)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    {
      header: "Created At",
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: "Action",
      render: (row) => (
        <i
          className="fa fa-eye text-info"
          style={{
            cursor: "pointer",
            fontSize: 18,
          }}
          title="View"
          onClick={() => handleView(row)}
        ></i>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-3 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="content-wrapper">
    <div className="content-header">
        <div className="container-fluid">
        <h1 className="m-0 text-dark">Manage Contact Us</h1>
        </div>
    </div>
      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title">
                Contact Us Listing
              </div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>

            <div style={{ margin: "20px" }}>
              <DataTable
                columns={columns}
                data={currentContacts}
                startIndex={indexOfFirst}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </section>

      {/* View Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Contact Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedContact && (
            <div className="d-flex flex-column gap-3">
              <div>
                <strong>Name:</strong>
                <div>{selectedContact.name}</div>
              </div>

              <div>
                <strong>Email:</strong>
                <div>{selectedContact.email}</div>
              </div>

              <div>
                <strong>Phone:</strong>
                <div>{selectedContact.phone}</div>
              </div>

              <div>
                <strong>Subject:</strong>
                <div>{selectedContact.subject}</div>
              </div>

              <div>
                <strong>Message:</strong>
                <div>{selectedContact.message}</div>
              </div>

              <div>
                <strong>Status:</strong>
                <div>
                  {selectedContact.isResolved
                    ? "Resolved"
                    : "Pending"}
                </div>
              </div>

              <div>
                <strong>Created At:</strong>
                <div>
                  {formatDate(
                    selectedContact.createdAt
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactList;