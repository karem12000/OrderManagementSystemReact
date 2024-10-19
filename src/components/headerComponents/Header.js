
import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../accountComponents/ChangePassword.js';
import ViewOrdersModal from '../orderComponents/ViewOrdersModal'; 
import API_BASE_URL from '../../config/apiConfig.js';
import Swal from 'sweetalert2';
import { getToken, getUserId, getUserType, removeCookies } from '../../Utility/cookieUtils.js';

const Header = () => {
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);


  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
    setIsUserAdmin(getUserType()==='ad')
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
        title: 'Alert',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'ok',
        showConfirmButton:false,
        timer: 1000,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      setShowChangePasswordModal(false);
    } else {
      Swal.fire({
        title: 'Alert',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'ok',
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
            {isLoggedIn  &&  (
              <>
                <li><a href="/products"><i className="fas fa-box"></i> Products</a></li>
                <li><a href="/orderList"><i className="fas fa-receipt"></i> Orders</a></li>
              </>
            )}

            {isUserAdmin && (
              <>
              <li><a href="/customers"><i className="fas fa-users"></i> Customers</a></li>
              <li><a href="/users"><i className="fas fa-user-shield"></i> Users</a></li>
              </>
            )}

            {!isLoggedIn && (
              <>
                <li><a href="/login"><i className="fas fa-sign-in-alt"></i> LogIn</a></li>
                <li>
                  <a href="#" onClick={() => setShowOrdersModal(true)}>
                    <i className="fas fa-list-alt"></i>Orders List
                  </a>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
               <li>
                  <a href="#" onClick={() => setShowChangePasswordModal(true)}>
                    <i className="fas fa-key"></i> Change Password
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> LogOut
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

