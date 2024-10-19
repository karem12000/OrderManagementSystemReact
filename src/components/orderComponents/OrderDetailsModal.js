import React from 'react';
import './OrderDetailsModal.css';
import { getToken } from '../../Utility/cookieUtils';

const OrderDetailsModal = ({ isOpen, onClose, order, onAccept, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="orderDetails-overlay">
      <div className="orderDetails-overlay-content">
        <h2>تفاصيل الطلب</h2>
        {order ? (
          <div className="order-details">
            <p><strong>اسم العميل:</strong> {order.customerName}</p>
            <p><strong>رقم الهاتف:</strong> {order.phone}</p>
            <p><strong>العنوان:</strong> {order.address}</p>
            <p><strong>الإجمالي:</strong> {order.totalAmount} جنيه</p>
            <h3>تفاصيل العناصر:</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>م</th>
                  <th>اسم المنتج</th>
                  <th>العدد</th>
                  <th>سعر الوحده</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={`${item.productId}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice} جنيه</td>
                    <td>{item.quantity * item.unitPrice} جنيه</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-details-buttons">
            {order.status === 1 && getToken() && ( 
                <>
                  <button className="order-button accept" onClick={() => onAccept(order.orderId)}>
                    قبول الطلب
                  </button>
                  <button className="order-button cancel" onClick={() => onCancel(order.orderId)}>
                    إلغاء الطلب
                  </button>
                </>
                )}
              <button className="order-button close" onClick={onClose}>
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <p>جاري التحميل...</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
