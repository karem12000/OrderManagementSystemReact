import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/apiConfig';
import Cookies from 'js-cookie';
import './EditUser.css';
import Swal from 'sweetalert2';
import { getToken } from '../../Utility/cookieUtils';

const EditUserModal = ({ userId, onClose, onUserUpdated }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}People/User/GetUserById?id=${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        if (data.status) {
          setUser(data.data);
        } else {
          Swal.fire({
            title: 'تنبيه',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'موافق',
            timer: 2000,
            showCancelButton: false,
            allowOutsideClick: false,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user.fullName) {
      Swal.fire({
        title: 'تنبيه',
        text: 'الاسم مطلوب',
        icon: 'error',
        confirmButtonText: 'موافق',
        timer: 2000,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      setLoading(false);
      return;
    }

    if (!user.email) {
      Swal.fire({
        title: 'تنبيه',
        text: 'البريد الإلكتروني مطلوب',
        icon: 'error',
        confirmButtonText: 'موافق',
        timer: 2000,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}User/UpdateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
        }),
      });

      const data = await response.json();
      if (data.status) {
        Swal.fire({
          title: 'تنبيه',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'موافق',
          timer: 2000,
          showCancelButton: false,
          allowOutsideClick: false,
        });
        onUserUpdated();
        onClose();
      } else {
        Swal.fire({
          title: 'تنبيه',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'موافق',
          timer: 2000,
          showCancelButton: false,
          allowOutsideClick: false,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <div className="editUserModal">
      <div className="editUserModal-content">
        <h2>تعديل المستخدم</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>الاسم:</label>
            <input
              type="text"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>البريد الإلكتروني:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="editUserModal-buttons">
            <button type="submit" className="update-btn">تعديل</button>
            <button type="button" onClick={onClose} className="close-btn">إغلاق</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
