import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminReview.css";

import charminarImg from "../../assets/heritage/charminar.jpg";
import golcondaImg from "../../assets/heritage/golconda.jpg";
import warangalImg from "../../assets/heritage/warangal.jpg";

const initialSubmissions = [
  {
    id: 1,
    site: "Charminar",
    location: "Hyderabad, Telangana",
    volunteer: "Volunteer 101",
    image: charminarImg,
    status: "Pending Review",
  },
  {
    id: 2,
    site: "Golconda Fort",
    location: "Hyderabad, Telangana",
    volunteer: "Volunteer 204",
    image: golcondaImg,
    status: "Pending Review",
  },
  {
    id: 3,
    site: "Warangal Fort",
    location: "Warangal, Telangana",
    volunteer: "Volunteer 315",
    image: warangalImg,
    status: "Pending Review",
  },
];

function AdminReview() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [search, setSearch] = useState("");

  const handleApprove = (id) => {
    setSubmissions((prev) =>
      prev.filter((submission) => submission.id !== id)
    );
  };

  const handleReject = (id) => {
    setSubmissions((prev) =>
      prev.filter((submission) => submission.id !== id)
    );
  };

  const handleView = () => {
    navigate("/admin/volunteer-details");
  };

  const filteredSubmissions = submissions.filter((submission) =>
    submission.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard text-left w-full h-full">
      <div className="dashboard-container">

        {/* Dashboard Header */}
        <div className="dashboard-header text-left">
          <p className="dashboard-tag">
            INTACH Heritage Management
          </p>
          <h1 className="page-title">
            Volunteer Submission Verification
          </h1>
          <p className="dashboard-subtitle">
            Review, verify and manage heritage submissions contributed
            by registered volunteers before publishing them on the
            heritage portal.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📥</span>
            <div>
              <h3>Pending</h3>
              <h2>{submissions.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <h3>Approved Today</h3>
              <h2>12</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">❌</span>
            <div>
              <h3>Rejected Today</h3>
              <h2>2</h2>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div>
            <h2>
              Pending Heritage Submissions
            </h2>
            <p>
              {submissions.length} submission(s) awaiting review
            </p>
          </div>

          <input
            className="search-box"
            type="text"
            placeholder="Search heritage site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Submission List */}
        <div className="submission-list">
          {filteredSubmissions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h2>All Caught Up!</h2>
              <p>There are currently no volunteer submissions waiting for review.</p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div className="submission-card" key={submission.id}>
                <div className="card-image">
                  <img src={submission.image} alt={submission.site} />
                </div>

                <div className="card-content">
                  <div className="card-top">
                    <div>
                      <h2 className="heritage-title">{submission.site}</h2>
                      <p className="heritage-location">📍 {submission.location}</p>
                    </div>
                    <span className="status-badge">{submission.status}</span>
                  </div>

                  <div className="info-grid">
                    <div className="info-box">
                      <span className="info-label">Volunteer</span>
                      <p>{submission.volunteer}</p>
                    </div>

                    <div className="info-box">
                      <span className="info-label">Category</span>
                      <p>Historical Monument</p>
                    </div>

                    <div className="info-box">
                      <span className="info-label">Submitted</span>
                      <p>Today</p>
                    </div>

                    <div className="info-box">
                      <span className="info-label">Verification</span>
                      <p>Awaiting Review</p>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="approve-btn" onClick={() => handleApprove(submission.id)}>
                      ✓ Approve
                    </button>
                    <button className="reject-btn" onClick={() => handleReject(submission.id)}>
                      ✕ Reject
                    </button>
                    <button className="view-btn" onClick={handleView}>
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminReview;
