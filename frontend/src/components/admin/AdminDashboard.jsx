import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import HeritageModal from "./HeritageModal";

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
  },
  {
    id: 2,
    site: "Golconda Fort",
    location: "Hyderabad, Telangana",
    volunteer: "Volunteer 204",
    image: golcondaImg,
  },
  {
    id: 3,
    site: "Warangal Fort",
    location: "Warangal, Telangana",
    volunteer: "Volunteer 315",
    image: warangalImg,
  },
];

function AdminDashboard() {
  const [submissions, setSubmissions] = useState(initialSubmissions);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [search, setSearch] = useState("");

  const handleApprove = (id) => {
    setSubmissions(
      submissions.filter((submission) => submission.id !== id)
    );
  };

  const handleReject = (id) => {
    setSubmissions(
      submissions.filter((submission) => submission.id !== id)
    );
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
  };

  const filteredSubmissions = submissions.filter((submission) =>
    submission.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="page-title">Admin Dashboard</h1>
          <Link to="/admin/events" className="rounded-lg bg-[#b87519] px-4 py-2.5 font-sans text-sm font-bold text-white no-underline transition hover:bg-[#925a0e]">Manage event registrations</Link>
        </div>

        <h2 className="section-title">
          Pending Volunteer Submissions
        </h2>

        <input
          className="search-box"
          type="text"
          placeholder="Search heritage site..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="submission-table">

          <div className="table-header">
            <div>Site Image</div>
            <div>Metadata & Location</div>
            <div>Action Buttons</div>
          </div>

          {filteredSubmissions.length === 0 ? (

            <div className="empty-state">
              <h2>🎉 All Done!</h2>

              <p>
                No pending volunteer submissions.
              </p>
            </div>

          ) : (

            filteredSubmissions.map((submission) => (

              <div
                className="table-row"
                key={submission.id}
              >

                <div className="image-box">
                  <img
                    src={submission.image}
                    alt={submission.site}
                  />
                </div>

                <div className="metadata-box">

                  <h2>{submission.site}</h2>

                  <p>
                    📍 <strong>Location:</strong> {submission.location}
                  </p>

                  <p>
                    👤 <strong>Volunteer:</strong> {submission.volunteer}
                  </p>

                  <p>
                    ⏳ <strong>Status:</strong> Pending Review
                  </p>

                </div>

                <div className="action-box">

                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(submission.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(submission.id)}
                  >
                    Reject
                  </button>

                  <button
                    className="view-btn"
                    onClick={() => handleView(submission)}
                  >
                    View Details
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

        <HeritageModal
          submission={selectedSubmission}
          onClose={closeModal}
        />

      </div>
    </div>
  );
}

export default AdminDashboard;
