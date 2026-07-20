import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (
      !profile.fullName ||
      !profile.email ||
      !profile.phone ||
      !profile.address ||
      !profile.city ||
      !profile.state ||
      !profile.pincode
    ) {
      alert("Please fill all the details.");
      return;
    }

    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-page">

      <header className="profile-header">
        <h1>INTACH Heritage Marketplace</h1>
        <p>Edit Profile</p>
      </header>

      <div className="profile-container">

        <div className="profile-card">

          <div className="profile-avatar">
            👤
          </div>

          <h2>My Profile</h2>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          <label>Street Address</label>
          <textarea
            rows="3"
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />

          <div className="profile-row">

            <div className="profile-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="profile-field">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

          </div>

          <label>PIN Code</label>
          <input
            type="text"
            name="pincode"
            value={profile.pincode}
            onChange={handleChange}
            placeholder="PIN Code"
          />

          <div className="profile-buttons">

            <button
              className="save-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>

            <button
              className="shop-btn"
              onClick={() => navigate("/shop")}
            >
              ← Back to Shop
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}