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
        title: 'تنبيه',
        text: 'من فضلك أدخل جميع الحقول',
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        title: 'تنبيه',
        text: 'تأكيد كلمة المرور غير مطابق لكلمة المرور الجديدة',
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
     return false;
    }

    if (newPassword !== currentPassword) {
      Swal.fire({
        title: 'تنبيه',
        text: 'كلمة المرور الجديدة مطابقة لكلمة المرور الحالية',
        icon: 'error',
        confirmButtonText: 'موافق', 
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
        <h2>تغيير كلمة المرور</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">كلمة المرور الحالية</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">كلمة المرور الجديدة</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <div className="btn-container">
          <button type="submit" className="btn">حفظ</button>
          <button className="btn-cancel" onClick={onClose}>إغلاق</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
