import "./HeritageModal.css";

function HeritageModal({ submission, onClose }) {
  if (!submission) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={submission.image}
          alt={submission.site}
          className="modal-image"
        />

        <div className="modal-content">

          <div className="modal-title-section">

            <h2>{submission.site}</h2>

            <span className="status-badge">
              Pending Review
            </span>

          </div>

          <div className="details-grid">

            <div className="detail-card">
              <h4>📍 Location</h4>
              <p>{submission.location}</p>
            </div>

            <div className="detail-card">
              <h4>👤 Volunteer</h4>
              <p>{submission.volunteer}</p>
            </div>

            <div className="detail-card">
              <h4>🏛 Monument Type</h4>
              <p>Historical Monument</p>
            </div>

            <div className="detail-card">
              <h4>📅 Construction</h4>
              <p>16th Century</p>
            </div>

            <div className="detail-card">
              <h4>🗺 Coordinates</h4>
              <p>17.3616° N, 78.4747° E</p>
            </div>

            <div className="detail-card">
              <h4>📌 Submission Status</h4>
              <p>Awaiting Approval</p>
            </div>

          </div>

          <div className="description-card">

            <h3>Description</h3>

            <p>
              This heritage monument was submitted by a verified volunteer for
              inclusion in the INTACH Heritage Portal. The administrator can
              inspect the details, verify the information, and approve or reject
              the submission before it becomes visible on the public heritage map.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HeritageModal;