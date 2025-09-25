import React, { useEffect, useState } from "react";
import "../CSS/ProfileDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProfileDashboard() {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userdata, setUSerdata] = useState(null);

  const { UserInfo } = useSelector((state) => state.user);

 useEffect(() => {
  if (UserInfo) {
    setUSerdata(UserInfo);
    console.log("UserInfo:", UserInfo); // Check structure in devtools
  }
}, [UserInfo]);

  return (
    <div className="profile-dashboard">
      <section className="pd-header">
        <div className="pd-user">
          <div className="pd-user-meta">
            <h2 className="pd-name">
              {userdata ? userdata.firstName : "Loading"}

            </h2>
           <p className="pd-role">
             {userdata ? userdata.natureOfBuisness : "Loading"}
            </p>

            <div className="pd-tags">
              <span className="pd-tag">Verified</span>
              <span className="pd-tag pd-tag--accent">Business</span>
            </div>
          </div>
          <div className="pd-avatar-section">
                  <div className="pd-avatar" aria-hidden="true">
                    {userdata?.firstName && userdata?.lastName
                      ? userdata.firstName.charAt(0) + userdata.lastName.charAt(0)
                      : ""}
          </div>

            <div className="pd-avatar-actions">
              <label className="pd-btn pd-btn--ghost" htmlFor="avatarUpload">
                Upload
              </label>
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="pd-file"
              />
              <button className="pd-btn">Remove</button>
            </div>
          </div>
        </div>
        <div className="pd-actions">{/* actions reserved */}</div>
      </section>

      <div className="pd-card pd-card--single">
        <h3 className="pd-card-title">Account</h3>

        <div className="pd-section">
          <h4 className="pd-section-title">Company Details</h4>

          <div className="pd-row">
            <div className="pd-detail">
              <label>Buyer Email</label>
              <p>{userdata?.email || "Loading"}</p>

            </div>
            <div className="pd-detail">
              <label>Phone</label>
              <p>
                {userdata?.mobileNumber || "Loading"}
              </p>
            </div>
          </div>
          <div className="pd-detail">
            <label>Nature Of Buisness</label>
            <p>
              {userdata?.natureOfBuisness || "Loading"}
            </p>
          </div>
          <div className="pd-row">
            <div className="pd-detail">
              <label>Country</label>
              <p>{userdata?.country || "Loading"}</p>
            </div>
          </div>

          <div className="pd-actions-inline pd-actions-wrap">
            <button
              className="pd-btn pd-btn--primary"
              onClick={() => setIsCompanyModalOpen(true)}
            >
              Update Company Details
            </button>
          </div>
        </div>

        <div className="pd-divider" />

        <div className="pd-section">
          <h4 className="pd-section-title">Security</h4>
          <p className="pd-muted">
            For account security, use a strong password.
          </p>
          <div className="pd-actions-inline pd-actions-wrap">
            <button
              className="pd-btn pd-btn--primary"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {isCompanyModalOpen && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="companyModalTitle"
        >
          <div className="pd-dialog">
            <div className="pd-dialog-head">
              <h3 id="companyModalTitle">Update Company Details</h3>
              <button
                className="pd-icon-btn"
                onClick={() => setIsCompanyModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="pd-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                <span>Company Name</span>
                <input type="text" defaultValue="Acme Pharma Pvt. Ltd." />
              </label>
              <div className="pd-row">
                <label>
                  <span>Company Email</span>
                  <input type="email" defaultValue="contact@acmepharma.com" />
                </label>
                <label>
                  <span>Phone</span>
                  <input type="tel" defaultValue="+91 98765 43210" />
                </label>
              </div>
              <label>
                <span>Address</span>
                <input type="text" defaultValue="221B Baker Street" />
              </label>
              <div className="pd-row">
                <label>
                  <span>City</span>
                  <input type="text" defaultValue="Mumbai" />
                </label>
                <label>
                  <span>State</span>
                  <input type="text" defaultValue="Maharashtra" />
                </label>
              </div>
              <div className="pd-row">
                <label>
                  <span>Postal Code</span>
                  <input type="text" defaultValue="400001" />
                </label>
                <label>
                  <span>GST Number</span>
                  <input type="text" defaultValue="27ABCDE1234F1Z5" />
                </label>
              </div>
              <label>
                <span>Website</span>
                <input type="url" defaultValue="https://acmepharma.com" />
              </label>
              <div className="pd-actions-inline">
                <button className="pd-btn pd-btn--primary" type="submit">
                  Save
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div
          className="pd-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="passwordModalTitle"
        >
          <div className="pd-dialog">
            <div className="pd-dialog-head">
              <h3 id="passwordModalTitle">Change Password</h3>
              <button
                className="pd-icon-btn"
                onClick={() => setIsPasswordModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="pd-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                <span>Current Password</span>
                <input type="password" placeholder="••••••••" />
              </label>
              <label>
                <span>New Password</span>
                <input type="password" placeholder="At least 8 characters" />
              </label>
              <label>
                <span>Confirm New Password</span>
                <input type="password" placeholder="Re-type new password" />
              </label>
              <div className="pd-actions-inline">
                <button className="pd-btn pd-btn--primary" type="submit">
                  Update
                </button>
                <button
                  className="pd-btn pd-btn--ghost"
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
