import React, { useState } from 'react';
import './ChangePassword.css'; 
import Swal from 'sweetalert2';

const ChangePassword = ({ onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const validatePasswords = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Swal.fire({
        title: 'Alert',
        text: 'Please enter all fields',
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        title: 'Alert',
        text: 'Confirm password does not match new password',
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
     return false;
    }

    if (newPassword !== currentPassword) {
      Swal.fire({
        title: 'Alert',
        text: 'New password matches current password',
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
     return false;
    }

    setNewPassword(newPassword);
    setConfirmNewPassword(confirmNewPassword);
    setCurrentPassword(currentPassword);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validatePasswords()) {
      
      onChangePassword({
        currentPassword,
        newPassword,
        confirmNewPassword
      });
    }
  };

  return (
    <div className="changePassword-modal">
      <div className="changePassword-modal-content">
        <h2>change password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm new password</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <div className="btn-container">
          <button type="submit" className="btn">Save</button>
          <button className="btn-cancel" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
