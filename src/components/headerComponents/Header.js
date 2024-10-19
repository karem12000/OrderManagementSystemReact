
import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../accountComponents/ChangePassword.js';
import ViewOrdersModal from '../orderComponents/ViewOrdersModal'; 
import API_BASE_URL from '../../config/apiConfig.js';
import Swal from 'sweetalert2';
import { getToken, getUserId, removeCookies } from '../../Utility/cookieUtils.js';

const Header = () => {
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    removeCookies();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleChangePassword = async (passwordData) => {
    const changePasswordDto = {
      UserId: getUserId(),
      CurrentPassword: passwordData.currentPassword,
      NewPassword: passwordData.newPassword,
      ConfirmNewPassword: passwordData.confirmNewPassword,
    };

    const response = await fetch(`${API_BASE_URL}People/User/ChangePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(changePasswordDto),
    });

    var result = await response.json();
    if (result.status) {
      Swal.fire({
        title: 'تنبيه',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'موافق',
        showConfirmButton:false,
        timer: 1000,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      setShowChangePasswordModal(false);
    } else {
      Swal.fire({
        title: 'تنبيه',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'موافق',
        showConfirmButton:false,
        timer: 2000,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <header className="header">
        <nav>
          <ul className="nav-links">
            {isLoggedIn && (
              <>
                <li><a href="/products"><i className="fas fa-box"></i> المنتجات</a></li>
                <li><a href="/customers"><i className="fas fa-users"></i> العملاء</a></li>
                <li><a href="/users"><i className="fas fa-user-shield"></i> المستخدمين</a></li>
                <li><a href="/orderList"><i className="fas fa-receipt"></i> الطلبات</a></li>
                <li>
                  <a href="#" onClick={() => setShowChangePasswordModal(true)}>
                    <i className="fas fa-key"></i> تغيير كلمة المرور
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
                  </a>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li><a href="/login"><i className="fas fa-sign-in-alt"></i> تسجيل الدخول</a></li>
                <li>
                  <a href="#" onClick={() => setShowOrdersModal(true)}>
                    <i className="fas fa-list-alt"></i> قائمة الطلبات
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {showChangePasswordModal && (
        <ChangePassword
          onClose={() => setShowChangePasswordModal(false)}
          onChangePassword={handleChangePassword}
        />
      )}

      {showOrdersModal && (
        <ViewOrdersModal
          onClose={() => setShowOrdersModal(false)}
        />
      )}
    </>
  );
};

export default Header;

