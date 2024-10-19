import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './ViewOrdersModal.css';
import Swal from 'sweetalert2';

const ViewOrdersModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); 

  const handleViewOrders = () => {
    if (!email) {
      Swal.fire({
        title: 'خطأ',
        text: 'الرجاء إدخال البريد الإلكتروني',
        icon: 'error',
        confirmButtonText: 'موافق',
        showCancelButton:false,
        showConfirmButton:false,
        timer: 2000
      });
      return;
    }

    navigate(`/orderList?email=${email}`);
    onClose();
  };

  return (
    <div className="viewOrderModal">
      <div className="viewOrderModal-content">
        <h2>قائمة الطلبات</h2>
        <div className="form-group">
          <label htmlFor="email">البريد الإلكتروني:</label>
          <input
            type="email"
            id="email"
            placeholder="أدخل البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="viewOrderModal-actions">
          <button className="add-product-button" onClick={handleViewOrders}>
            عرض الطلبات
          </button>
          <button className="close-button" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrdersModal;
