import React from 'react';
import './OrderDetailsModal.css';
import { getToken } from '../../Utility/cookieUtils';

const OrderDetailsModal = ({ isOpen, onClose, order, onAccept, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="orderDetails-overlay">
      <div className="orderDetails-overlay-content">
        <h2>Order Details</h2>
        {order ? (
          <div className="order-details">
            <p><strong>Customer Name:</strong> {order.customerName}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Total:</strong> {order.totalAmount}$</p>
            <h3>Items Details:</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Count</th>
                  <th>Unit Priceh</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={`${item.productId}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice}$</td>
                    <td>{item.quantity * item.unitPrice}$</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-details-buttons">
            {order.status === 1 && getToken() && ( 
                <>
                  <button className="order-button accept" onClick={() => onAccept(order.orderId)}>
                    Accept Order
                  </button>
                  <button className="order-button cancel" onClick={() => onCancel(order.orderId)}>
                    Cancel Order
                  </button>
                </>
                )}
              <button className="order-button close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
