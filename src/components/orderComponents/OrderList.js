import React, { useState, useEffect } from 'react';
import './OrderList.css'; 
import API_BASE_URL from '../../config/apiConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken, getUserId } from '../../Utility/cookieUtils';
import OrderDetailsModal from './OrderDetailsModal'; 
import Swal from 'sweetalert2';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const fetchOrders = async () => {
    const email = queryParams.get('email');
    try {
      const ownerId = getUserId();
      let response;

      if (ownerId) {
        response = await fetch(`${API_BASE_URL}Guide/Order/GetAllOrdersByOwnerId?id=${ownerId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
      } else {
        response = await fetch(`${API_BASE_URL}Guide/Order/GetAllOrdersByCustomerEmail?email=${email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
      }

      const data = await response.json();
      setOrders(data.data);
      const totalOrders = data.totalCount;
      setTotalPages(Math.ceil(totalOrders / itemsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleAcceptOrder = async (id) => {
    try{
    const response = await fetch(`${API_BASE_URL}Guide/Order/AcceptOrder?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });

     var result = await response.json();
     if (result.status) {
      Swal.fire({
        title: 'Alert',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'ok', 
        timer: 1000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      fetchOrders();
      closeModal();
     }else{
      Swal.fire({
        title: 'Alert',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      closeModal();
     }
    }catch(e){
      Swal.fire({
        title: 'Alert',
        text: 'An error occurred',
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });

    }
  };
  
  const handleCancelOrder = async (id) => {
    const response = await fetch(`${API_BASE_URL}Guide/Order/CancelOrder?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });

     var result = await response.json();
     if (result.status) {
      Swal.fire({
        title: 'Alert',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'ok', 
        timer: 1000,
        showCancelButton: false, 
        showConfirmButton: false,
        allowOutsideClick: false, 
      });
      closeModal();
      fetchOrders();
     }else{
      Swal.fire({
        title: 'Alert',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        showConfirmButton:false,
        allowOutsideClick: false, 
      });
      closeModal();
     }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="orders-table">
      <h1>Orders List</h1>

      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No Orders Found
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{order.customerName}</td>
                <td>{order.orderDateStr}</td>
                <td>{order.totalAmount}</td>
                <td>{order.statusStr}</td>
                <td>
                  <button onClick={() => handleShowOrderDetails(order)} className="show-order-details-btn">
                    Show Order Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {orders.length > 0 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}
        </div>
      )}
      <OrderDetailsModal 
      isOpen={isModalOpen}
       onAccept={handleAcceptOrder}
        onCancel={handleCancelOrder}
         onClose={closeModal}
          order={selectedOrder} />

      
    </div>
  );
};

export default OrderList;
