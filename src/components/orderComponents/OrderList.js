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
    console.log(id)
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
        title: 'تنبيه',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'موافق', 
        timer: 1000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      fetchOrders();
      closeModal();
     }else{
      Swal.fire({
        title: 'تنبيه',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      closeModal();
     }
    }catch(e){
      Swal.fire({
        title: 'تنبيه',
        text: 'حدث خطأ',
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });

    }
  };
  
  const handleCancelOrder = async (id) => {
    console.log(id)
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
        title: 'تنبيه',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'موافق', 
        timer: 1000,
        showCancelButton: false, 
        showConfirmButton: false,
        allowOutsideClick: false, 
      });
      closeModal();
      fetchOrders();
     }else{
      Swal.fire({
        title: 'تنبيه',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        showConfirmButton:false,
        allowOutsideClick: false, 
      });
      closeModal();
     }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <div className="orders-table">
      <h1>قائمة الطلبات</h1>

      <table className="styled-table">
        <thead>
          <tr>
            <th>م</th>
            <th>اسم العميل</th>
            <th>تاريخ الطلب</th>
            <th>المبلغ الإجمالي</th>
            <th>الحالة</th>
            <th>الحدث</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                لا توجد طلبات
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
                    عرض تفاصيل الطلب
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
