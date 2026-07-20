import { useNavigate } from "react-router-dom";
import "./VolunteerUploadDetails.css";

import charminarImg from "../assets/heritage/charminar.jpg";

function VolunteerUploadDetails() {
  const navigate = useNavigate();

  return (
    <div className="upload-details-page">
      <div className="upload-details-container">

        <button
          className="back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Back to Verification
        </button>

        <h1 className="details-title">
          Volunteer Upload Details
        </h1>

        <div className="details-card">

          <div className="image-section">
            <img
              src={charminarImg}
              alt="Charminar"
            />
          </div>

          <div className="info-section">

            <div className="info-grid">

              <div className="info-item">
                <h3>Heritage Site</h3>
                <p>Charminar</p>
              </div>

              <div className="info-item">
                <h3>Volunteer</h3>
                <p>Volunteer 101</p>
              </div>

              <div className="info-item">
                <h3>Location</h3>
                <p>Hyderabad, Telangana</p>
              </div>

              <div className="info-item">
                <h3>Category</h3>
                <p>Historical Monument</p>
              </div>

              <div className="info-item">
                <h3>Construction Era</h3>
                <p>16th Century</p>
              </div>

              <div className="info-item">
                <h3>Coordinates</h3>
                <p>17.3616° N, 78.4747° E</p>
              </div>

              <div className="info-item">
                <h3>Date Submitted</h3>
                <p>15 July 2026</p>
              </div>

              <div className="info-item">
                <h3>Status</h3>
                <p>Pending Review</p>
              </div>

            </div>

            <div className="description-section">

              <h3>Description</h3>

              <p>
                This heritage site has been submitted by a registered volunteer
                for inclusion in the INTACH Heritage Management System. The
                administrator should verify the uploaded information, confirm
                its authenticity, and either approve, reject, or remove the
                submission.
              </p>

            </div>

            <div className="action-buttons">

              <button className="approve-btn">
                Approve
              </button>

              <button className="reject-btn">
                Reject
              </button>

              <button className="delete-btn">
                Delete
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default VolunteerUploadDetails;