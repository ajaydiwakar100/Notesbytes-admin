import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DataTable from "../../../layouts/DataTable";
import SearchBar from "../../../layouts/SearchBar";
import Pagination from "../../../layouts/Pagination";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

import {
  GET_DOCS_BY_USER_ID,
  UPDATE_DOCS_STATUS,
  APPROVED_REJECTED_STATUS,
  GET_DOC_DETAILS,
  BASE_URL
} from "../../../config";

const UploadDocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [docToReject, setDocToReject] = useState(null);
  const [docToApprove, setDocToApprove] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const location = useLocation();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // ✅ FIXED

  /* =========================
     Format Date
  ========================= */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================
     Fetch Documents
  ========================= */
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${GET_DOCS_BY_USER_ID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        const docs = res.data.data.documents || [];

        const formatted = docs.map((d) => ({
          _id: d._id,
          documentName: d.title,
          price: `₹ ${d.price}`,
          fileUrl: d.filePath,
          status: d.status,
          approvalStatus: d.approvalStatus,
          createdAt: formatDate(d.createdAt),
        }));
        console.log(formatted);
        setDocuments(formatted);
        setFilteredDocs(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [location.pathname]);

  /* =========================
     Search
  ========================= */
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = documents.filter(
      (doc) =>
        doc.documentName.toLowerCase().includes(query) ||
        doc.price.toLowerCase().includes(query) ||
        doc.approvalStatus.toLowerCase().includes(query)
    );

    setFilteredDocs(filtered);
    setCurrentPage(1);
  };

  /* =========================
     Pagination
  ========================= */
  const totalPages = Math.ceil(filteredDocs.length / docsPerPage);
  const indexOfLast = currentPage * docsPerPage;
  const indexOfFirst = indexOfLast - docsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirst, indexOfLast);

  /* =========================
     Table Columns
  ========================= */
  const columns = [
    {
      header: "Sno",
      render: (_, index) => indexOfFirst + index + 1, // ✅ AUTO SNO
    },
    { header: "Document Name", accessor: "documentName" },
    { header: "Price", accessor: "price" },
    {
      header: "Status",
      render: (doc) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={doc.status === 1}
            onChange={() => handleToggleStatus(doc._id, doc.status)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    { header: "Created At", accessor: "createdAt" },
    {
      header: "Action",
      render: (doc) => (
        <div className="d-flex gap-2">
        {doc.approvalStatus === "pending" ? (
            <>
            {/* Approve */}
            <i
                className="fa fa-check text-success"
                style={{ cursor: "pointer", fontSize: 18, margin: 10 }}
                title="Approve"
                onClick={() => handleApproveClick(doc._id)}
            ></i>

            {/* Reject */}
            <i
                className="fa fa-times text-danger"
                style={{ cursor: "pointer", fontSize: 18, margin: 10 }}
                title="Reject"
                onClick={() => handleRejectClick(doc._id)}
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

          <i
            className="fa fa-download text-primary"
            title="Download"
            style={{ fontSize: 18, margin: 10, cursor: "pointer" }}
            onClick={() => window.open(doc.fileUrl, "_blank")}
          />

          <i
            className="fa fa-eye text-info"
            title="View"
            style={{ fontSize: 18, margin: 10, cursor: "pointer" }}
            onClick={() => handleView(doc._id)}
          />
        </div>
      ),
    },
  ];

  /* =========================
     Actions
  ========================= */
  const handleToggleStatus = async (id, status) => {
    try {
      await axios.put(
        UPDATE_DOCS_STATUS,
        { id, status: status === 1 ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchDocuments();
    } catch {
      toast.error("Failed to update status");
    }
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

  const handleRejectClick = (documentId) => {
    setDocToReject(documentId);   // store which document is being rejected
    setRejectReason("");          // reset previous reason
    setShowRejectModal(true);     // show modal
  };

  const handleApproveClick = (documentId) => {
    setDocToApprove(documentId);
    setShowApproveModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection");
      return;
    }

    try {
       setActionLoading(true);

      const response = await axios.put(
        APPROVED_REJECTED_STATUS,
        { id: docToReject, approvalStatus: "rejected", reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        toast.success("Document rejected");
        fetchDocuments(); // refresh table
      }
    } catch (err) {
      console.error("Error rejecting document:", err);
      toast.error("Failed to reject document");
    } finally {
       setActionLoading(false);
      setShowRejectModal(false);
    }
  };

  const handleApproveConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await axios.put(
        APPROVED_REJECTED_STATUS,
        { id: docToApprove, approvalStatus: "approved", reason: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        toast.success("Document approved");
        fetchDocuments();
      }
    } catch (err) {
      console.error("Error approving document:", err);
      toast.error("Failed to approve document");
    } finally {
        setActionLoading(false);
      setShowApproveModal(false);
    }
  };

  if (loading) return <div className="p-3 text-center">Loading...</div>;

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <div className="box-main-top d-flex justify-content-between">
              <div className="box-main-title">Uploaded Documents</div>
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>
            <div style={{ margin:"20px" }}>
                <DataTable
                    columns={columns}
                    data={currentDocs}
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
      {/* Document Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Document Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {selectedDoc && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        rowGap: "12px",
                        columnGap: "20px",
                    }}
                >
                {/* BASIC INFO */}
                <div>
                    <strong>Title</strong>
                    <div>{selectedDoc.title}</div>
                </div>
    
                <div>
                    <strong>Slug</strong>
                    <div>{selectedDoc.slug}</div>
                </div>
    
                <div>
                    <strong>Author</strong>
                    <div>{selectedDoc.author || "-"}</div>
                </div>
    
                <div>
                    <strong>Subject</strong>
                    <div>{selectedDoc.subject}</div>
                </div>
    
                <div>
                    <strong>Exam</strong>
                    <div>{selectedDoc.exam}</div>
                </div>
    
                <div>
                    <strong>Language</strong>
                    <div>{selectedDoc.language}</div>
                </div>
    
                {/* PRICE */}
                <div>
                    <strong>Price</strong>
                    <div>₹ {selectedDoc.price}</div>
                </div>
    
                <div>
                    <strong>Original Price</strong>
                    <div>₹ {selectedDoc.originalPrice}</div>
                </div>
    
                <div>
                    <strong>Pages</strong>
                    <div>{selectedDoc.pages}</div>
                </div>
    
                {/* DESCRIPTIONS */}
                <div style={{ gridColumn: "1 / 4" }}>
                    <strong>Short Description</strong>
                    <div>{selectedDoc.shortDescription}</div>
                </div>
    
                <div style={{ gridColumn: "1 / 4" }}>
                    <strong>Description</strong>
                    <div>{selectedDoc.description}</div>
                </div>
    
                {/* FORMAT */}
                <div>
                    <strong>Format</strong>
                    <div>{selectedDoc.format}</div>
                </div>
    
                <div>
                    <strong>Status</strong>
                    <div>{selectedDoc.status === 1 ? "Active" : "Inactive"}</div>
                </div>
    
                <div>
                    <strong>Approval Status</strong>
                    <div>{selectedDoc.approvalStatus}</div>
                </div>
    
                {/* FEATURE / PUBLISH */}
                <div>
                    <strong>Featured</strong>
                    <div>{selectedDoc.isFeature ? "Yes" : "No"}</div>
                </div>
    
                <div>
                    <strong>Publish Status</strong>
                    <div>{selectedDoc.publishStatus ? "Published" : "Unpublished"}</div>
                </div>
    
                {/* REJECTION / APPROVAL */}
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
    
                {/* FILE INFO */}
                <div>
                    <strong>File Size</strong>
                    <div>{(selectedDoc.fileSize / 1024).toFixed(2)} KB</div>
                </div>
    
                <div>
                    <strong>MIME Type</strong>
                    <div>{selectedDoc.fileMimeType}</div>
                </div>
    
                <div>
                    <strong>File</strong>
                    <div>
                    <a href={selectedDoc.filePath} target="_blank" rel="noreferrer">
                        View / Download
                    </a>
                    </div>
                </div>
    
                <div>
                    <strong>Sample File</strong>
                    <div>
                    {selectedDoc.sampleFile ? (
                        <a href={selectedDoc.sampleFile} target="_blank" rel="noreferrer">
                        View Sample
                        </a>
                    ) : "-"}
                    </div>
                </div>
    
                <div>
                    <strong>Thumbnail</strong>
                    <div>
                    {selectedDoc.docImage ? (
                        <img
                        src={`${BASE_URL}${selectedDoc.docImage}`}
                        alt="Document"
                        style={{ width: 80, borderRadius: 4 }}
                        />
                    ) : "-"}
                    </div>
                </div>
    
                {/* STATS */}
                <div>
                    <strong>No. of Downloads</strong>
                    <div>{selectedDoc.noOfDownloads}</div>
                </div>
    
                <div>
                    <strong>Rating</strong>
                    <div>{selectedDoc.rating}</div>
                </div>
    
                <div>
                    <strong>Reviews Count</strong>
                    <div>{selectedDoc.reviewsCount}</div>
                </div>
    
                {/* ARRAYS */}
                <div style={{ gridColumn: "1 / 4" }}>
                    <strong>Topics</strong>
                    <div>{selectedDoc.topics?.length ? selectedDoc.topics.join(", ") : "-"}</div>
                </div>
    
                <div style={{ gridColumn: "1 / 4" }}>
                    <strong>Highlights</strong>
                    <div>{selectedDoc.highlights?.length ? selectedDoc.highlights.join(", ") : "-"}</div>
                </div>
    
                <div style={{ gridColumn: "1 / 4" }}>
                    <strong>Downloaded By</strong>
                    <div>
                    {selectedDoc.downloadedBy?.length
                        ? selectedDoc.downloadedBy.join(", ")
                        : "-"}
                    </div>
                </div>
    
                <div style={{ gridColumn: "1 / 4" }}>
                    <strong>Reviews</strong>
                    <div>{selectedDoc.reviews?.length ? selectedDoc.reviews.join(", ") : "-"}</div>
                </div>
    
                {/* META */}
                <div>
                    <strong>Uploaded By</strong>
                    <div>{selectedDoc.uploadedBy?.name || selectedDoc.uploadedBy}</div>
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
    
        <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Reject Document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <label>Reason for Rejection:</label>
            <textarea
                className="form-control"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Enter rejection reason"
            />
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                Cancel
            </Button>
           <Button
              variant="danger"
              onClick={handleRejectConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Rejecting..." : "Reject"}
            </Button>
            </Modal.Footer>
        </Modal>
      
        <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Approve Document</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
            Are you sure you want to approve this document?
            </Modal.Body>
    
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
                Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleApproveConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Approving..." : "Yes, Approve"}
            </Button>
            </Modal.Footer>
        </Modal>
      
    </div>

    
  );
};

export default UploadDocumentList;
