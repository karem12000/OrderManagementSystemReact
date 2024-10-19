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
        title: 'Error',
        text: 'Please enter your email',
        icon: 'error',
        confirmButtonText: 'ok',
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
        <h2>Orders List</h2>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="viewOrderModal-actions">
          <button className="show-orders-btn" onClick={handleViewOrders}>
            Show Orders
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrdersModal;
