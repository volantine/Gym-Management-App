import React, { useState } from 'react';
import '../styles/Profile.css';

const Profile = ({ username }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(`http://localhost:3000/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'username': username,
          'password': currentPassword,
          'newPassword': newPassword
        })
      });

      if (response.ok) {
        setSuccessMessage('Updated password');
        setCurrentPassword('');
        setNewPassword('');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to update password');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the password');
      setSuccessMessage('');
    }
  };

  return (
    <div className="update-password-container">
      <h2 className="update-password-title">Update Password</h2>
      <div>
        <label htmlFor="currentPassword" className="input-label">Current Password:</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="input-label">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-field"
        />
      </div>
      <button onClick={handleUpdatePassword} className="update-button">Update Password</button>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
};

export default Profile;
