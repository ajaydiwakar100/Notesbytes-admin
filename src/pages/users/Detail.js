import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import { VIEW_USERS_API,GET_DOCS_BY_USER_ID,UPDATE_DOCS_STATUS,APPROVED_REJECTED_STATUS,GET_DOC_DETAILS } from "../../config";
import DataTable from "../../layouts/DataTable";
import SearchBar from "../../layouts/SearchBar";
import Pagination from "../../layouts/Pagination";
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Referral States
  const [referralUsers, setReferralUsers] = useState([]);
  const [filteredReferral, setFilteredReferral] = useState([]);
  const [referralSearch, setReferralSearch] = useState("");
  const [loadingReferral, setLoadingReferral] = useState(true);
  const [referralPage, setReferralPage] = useState(1);
  const referralPerPage = 10;

  // Document States
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [docSearch, setDocSearch] = useState("");
  const [docCurrentPage, setDocCurrentPage] = useState(1);
  const docsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser(id);
    fetchReferralUsers(id);
    fetchDocuments(id);
  }, [id]);

  // -------------------------
  // Fetch Main User
  // -------------------------
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${VIEW_USERS_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        setUser(response.data.data);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Fetch Referral Users
  // -------------------------
  const fetchReferralUsers = async () => {
    try {
      const response = await axios.get(`${VIEW_USERS_API}/${id}/referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        const formatted = response.data.data.map((u, index) => ({
          index: index + 1,
          name: u.name,
          email: u.email,
          referralCode: u.referralCode,
          referralBy: u.referredBy,
          createdAt: formatDate(u.createdAt),
        }));

        setReferralUsers(formatted);
        setFilteredReferral(formatted);
      }
    } catch (err) {
      console.error("Referral error:", err);
    } finally {
      setLoadingReferral(false);
    }
  };

  // Referral Search
  const handleReferralSearch = (term) => {
    // if an event was passed, extract its value
    if (term && typeof term === "object" && "target" in term) {
      term = term.target.value;
    }

    // coerce to string and trim
    const text = (term ?? "").toString();
    setReferralSearch(text);

    setReferralPage(1);

    if (!text.trim()) {
      setFilteredReferral(referralUsers);
      return;
    }

    const lower = text.trim().toLowerCase();

    const result = referralUsers.filter((u) => {
      return (
        (u?.name?.toLowerCase() || "").includes(lower) ||
        (u?.email?.toLowerCase() || "").includes(lower) ||
        (u?.referralCode?.toLowerCase() || "").includes(lower)
      );
    });

    setFilteredReferral(result);
  };

  // Referral Pagination
  const referralTotalPages = Math.ceil(filteredReferral.length / referralPerPage);
  const referralIndexOfLast = referralPage * referralPerPage;
  const referralIndexOfFirst = referralIndexOfLast - referralPerPage;
  const currentReferralPage = filteredReferral.slice(
    referralIndexOfFirst,
    referralIndexOfLast
  );

  // -------------------------
  // Fetch Document List
  // -------------------------
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${GET_DOCS_BY_USER_ID}?userId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        const docs = response.data.data.documents || [];

        const formatted = docs.map((d, index) => ({
          index: index + 1,
          _id: d._id,
          documentName: d.name,               // just name
          price: `₹ ${d.prize}`,              // add ₹ sign
          fileUrl: d.filePath,                // file URL
          status: d.status, 
          approvalStatus:d.approvalStatus,                  // status toggle
          createdAt: formatDate(d.createdAt),
        }));


        setDocuments(formatted);
        setFilteredDocs(formatted);
      }
    } catch (err) {
      console.error("Document error:", err);
    }
  };


  // Document Search
  const handleDocSearch = (term) => {
    setDocSearch(term);

    if (!term) return setFilteredDocs(documents);

    const result = documents.filter((doc) =>
      (doc.documentType || "").toLowerCase().includes(term.toLowerCase()) ||
      (doc.documentName || "").toLowerCase().includes(term.toLowerCase())
    );

    setFilteredDocs(result);
    setDocCurrentPage(1);
  };

  // Document Pagination
  const docTotalPages = Math.ceil(filteredDocs.length / docsPerPage);
  const docIndexOfLast = docCurrentPage * docsPerPage;
  const docIndexOfFirst = docIndexOfLast - docsPerPage;
  const currentDocs = filteredDocs.slice(docIndexOfFirst, docIndexOfLast);

  if (loading) return <div className="text-center p-3">Loading user...</div>;
  if (error) return <div className="text-center p-3">Error: {error}</div>;

  // -------------------------
  // Referral Columns
  // -------------------------
  const referralColumns = [
    { header: "Sno", accessor: "index" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Referral By", accessor: "referralBy" },
    { header: "Referral Code", accessor: "referralCode" },
    { header: "Created At", accessor: "createdAt" },
  ];

  // -------------------------
  // Document Columns
  // -------------------------
  const docColumns = [
    { header: "Sno", accessor: "index" },
    { header: "Document Name", accessor: "documentName" },
    { header: "Price", accessor: "price" },
    {
      header: "Status",
      render: (doc) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={doc.status}
            onChange={() => handleToggleStatus(doc._id,doc.status)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    { header: "Created At", accessor: "createdAt" },
    {
      header: "Action",
      render: (doc) => (
      <div className="d-flex align-items-center gap-2">
      {doc.approvalStatus === "pending" ? (
        <>
          {/* Approve */}
          <i
            className="fa fa-check text-success"
            style={{ cursor: "pointer", fontSize: 18, margin: 10 }}
            title="Approve"
            onClick={() => handleApprove(doc._id)}
          ></i>

          {/* Reject */}
          <i
            className="fa fa-times text-danger"
            style={{ cursor: "pointer", fontSize: 18, margin: 10 }}
            title="Reject"
            onClick={() => handleReject(doc._id)}
          ></i>
        </>
      ) : doc.approvalStatus === "approved" ? (
        // Show only tick for approved
        <i
          className="fa fa-check text-success"
          style={{ fontSize: 18, margin: 10 }}
          title="Approved"
        ></i>
      ) : (
        // Show only cross for rejected
        <i
          className="fa fa-times text-danger"
          style={{ fontSize: 18, margin: 10 }}
          title="Rejected"
        ></i>
      )}

      {/* Download (always visible) */}
      <i
        className="fa fa-download text-primary"
        style={{ cursor: "pointer", fontSize: 18, margin: 10 }}
        title="Download"
        onClick={() => handleDownload(doc.fileUrl)}
      ></i>

      {/* View (always visible) */}
      <i
        className="fa fa-eye text-info"
        style={{ cursor: "pointer", fontSize: 18, margin: 10 }}
        title="View"
        onClick={() => handleView(doc._id)}
      ></i>
    </div>

      ),
    },
  ];

  // Toggle document status (active/inactive)
  const handleToggleStatus = async (documentId, status) => {
    try {
      const newStatus = status === 1 ? 0 : 1;
      const response = await axios.put(UPDATE_DOCS_STATUS,
        { id: documentId,status: newStatus},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        toast.success("Status updated successfully");
        fetchDocuments(); // refresh table
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Failed to update status");
    }
  };

  // Approve document
  const handleApprove = async (documentId) => {
    try {
      const response = await axios.put(APPROVED_REJECTED_STATUS,
        { id: documentId, approvalStatus: "approved", reason:null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        toast.success("Document approved");
        fetchDocuments();
      }
    } catch (err) {
      console.error("Error approving document:", err);
      toast.error("Failed to approve document");
    }
  };

  // Reject document
  const handleReject = async (documentId) => {
    try {
      const response = await axios.put(
        APPROVED_REJECTED_STATUS,
        { id: documentId, approvalStatus: "rejected", reason:null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        toast.success("Document rejected");
        fetchDocuments();
      }
    } catch (err) {
      console.error("Error rejecting document:", err);
      toast.error("Failed to reject document");
    }
  };

  // Download document
  const handleDownload = (fileUrl) => {
    window.open(fileUrl, "_blank"); // open file in new tab
  };

  // View document (can redirect or open modal)
  const handleView = async (documentId) => {
    try {
      const response = await axios.get(`${GET_DOC_DETAILS}/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === "success") {
        setSelectedDoc(response.data.data);
        setShowModal(true);
      } else {
        toast.error("Document not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch document details");
    }
  };

  return (
    <div className="content-wrapper">
      {/* USER DETAILS */}
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0 text-dark">User Details</h1>
        </div>
      </div>

      {/* USER INFO BLOCK */}
      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-table mt-3">
              <div className="row mb-2" style={{ marginTop: "10px" }}>
                <div className="col-lg-4">
                  <label>Name</label>
                  <br />
                  <span>{user.name}</span>
                </div>
                <div className="col-lg-6">
                  <label>Email</label>
                  <br />
                  <span>{user.email}</span>
                </div>
                <div className="col-lg-2">
                  <label>Phone</label>
                  <br />
                  <span>{user.phone}</span>
                </div>
              </div>

              <div className="row mb-3" style={{ marginTop: "30px" }}>
                <div className="col-lg-4">
                  <label>User Type</label>
                  <br />
                  <span>{user.userType}</span>
                </div>

                <div className="col-lg-6">
                  <label>Address</label>
                  <br />
                  <span>
                    {user.address
                      ? `${user.address}, ${user.city}, ${user.state}, ${user.country} - ${user.pincode}`
                      : "N/A"}
                  </span>
                </div>

                <div className="col-lg-2">
                  <label>Status</label>
                  <br />
                  <span>{user.status === 1 ? "Active" : "Inactive"}</span>
                </div>
              </div>

              <div className="row mb-2" style={{ marginTop: "30px" }}>
                <div className="col-lg-4">
                  <label>Referral Code</label>
                  <br />
                  <span>{user.referralCode}</span>
                </div>

                <div className="col-lg-6">
                  <label>Referral Commission</label>
                  <br />
                  <span>₹ {user.referralCommission}</span>
                </div>

                <div className="col-lg-2">
                  <label>Created At</label>
                  <br />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REFERRAL USERS */}
      <div className="content-header">
        <div className="container-fluid">
          <h1>Referral Users</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-table">
              <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title"></div>
                <SearchBar
                  searchQuery={referralSearch}
                  onSearchChange={handleReferralSearch}
                />
              </div>
             

              {loadingReferral ? (
                <div className="text-center p-3">Loading referrals...</div>
              ) : (
                <DataTable
                  columns={referralColumns}
                  data={currentReferralPage}
                  startIndex={referralIndexOfFirst}
                />
              )}
              <div className="mt-2">
                <Pagination
                  currentPage={referralPage}
                  totalPages={referralTotalPages}
                  onPageChange={(page) => setReferralPage(page)}
                />
              </div>  
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT LIST */}
      <div className="content-header">
        <div className="container-fluid">
          <h1>Uploded Documents</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-table">
              <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title"></div>
                <SearchBar
                searchValue={docSearch}
                onSearch={handleDocSearch}
              />
              </div>
             
              <DataTable
                columns={docColumns}
                data={currentDocs}
                startIndex={docIndexOfFirst}
              />
              
              <div className="mt-2">
                <Pagination
                  currentPage={docCurrentPage}
                  totalPages={docTotalPages}
                  onPageChange={(page) => setDocCurrentPage(page)}
                />
              </div>  
            </div>
          </div>
        </div>
      </section>

       {/* Document Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Document Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoc && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: "12px", columnGap: "20px" }}>
              <div>
                <strong>Name</strong>
                <div>{selectedDoc.name}</div>
              </div>
              <div>
                <strong>Type</strong>
                <div>{selectedDoc.type}</div>
              </div>
              <div>
                <strong>Price</strong>
                <div>₹ {selectedDoc.prize}</div>
              </div>

              <div style={{ gridColumn: "1 / 4" }}>
                <strong>Notes</strong>
                <div>{selectedDoc.notes}</div>
              </div>

              <div>
                <strong>Status</strong>
                <div>{selectedDoc.status === 1 ? "Active" : "Inactive"}</div>
              </div>
              <div>
                <strong>Approval Status</strong>
                <div>{selectedDoc.approvalStatus}</div>
              </div>
              <div>
                <strong>Rejected Reason</strong>
                <div>{selectedDoc.rejectedReason || "-"}</div>
              </div>
              <div>
                <strong>Approved At</strong>
                <div>{selectedDoc.approvedAt ? formatDate(selectedDoc.approvedAt) : "-"}</div>
              </div>
              <div>
                <strong>Rejected At</strong>
                <div>{selectedDoc.rejectedAt ? formatDate(selectedDoc.rejectedAt) : "-"}</div>
              </div>

              <div>
                <strong>Uploaded By</strong>
                <div>{selectedDoc.uploadedBy?.name || selectedDoc.uploadedBy}</div>
              </div>
              <div>
                <strong>No. of Downloads</strong>
                <div>{selectedDoc.noOfDownloads}</div>
              </div>
              <div>
                <strong>Rating</strong>
                <div>{selectedDoc.rating}</div>
              </div>

              <div>
                <strong>File</strong>
                <div>
                  <a
                    href={`${selectedDoc.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View / Download
                  </a>
                </div>
              </div>
              <div>
                <strong>File Size</strong>
                <div>{(selectedDoc.fileSize / 1024).toFixed(2)} KB</div>
              </div>
              <div>
                <strong>File MIME Type</strong>
                <div>{selectedDoc.fileMimeType}</div>
              </div>

              <div style={{ gridColumn: "1 / 4" }}>
                <strong>Downloaded By</strong>
                <div>{selectedDoc.downloadedBy.length > 0 ? selectedDoc.downloadedBy.join(", ") : "-"}</div>
              </div>

              <div style={{ gridColumn: "1 / 4" }}>
                <strong>Reviews</strong>
                <div>{selectedDoc.reviews.length > 0 ? selectedDoc.reviews.join(", ") : "-"}</div>
              </div>

              <div>
                <strong>Created At</strong>
                <div>{formatDate(selectedDoc.createdAt)}</div>
              </div>
              <div>
                <strong>Updated At</strong>
                <div>{formatDate(selectedDoc.updatedAt)}</div>
              </div>
              
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
}

export default UserDetail;
