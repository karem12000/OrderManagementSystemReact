import React, { useEffect, useState } from 'react';
import './OrderDetailsModal.css';
import { getToken } from '../../Utility/cookieUtils';
import API_BASE_URL from '../../config/apiConfig';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [allAccepted, setAllAccepted] = useState(false);

  useEffect(() => {
    setUpdatedOrder(order);
  }, [order]);

  if (!isOpen) return null;

  const handleAcceptProduct = async (product, orderId) => {
    const productToAccept = {
      productId: product.productId,
      productName: product.productName,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      status: product.status
    };

    try {
      const response = await fetch(`${API_BASE_URL}Guide/order/AcceptOneOrderProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ product: productToAccept, orderId }),
      });

      const data = await response.json();
      if (data.status) {
        const updatedItems = updatedOrder.items.map(item => {
          if (item.productId === product.productId) {
            return { ...item, status: 2, statusStr: 'Accepted' };
          }
          return item;
        });
        setUpdatedOrder({ ...updatedOrder, items: updatedItems });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelProduct = async (product, orderId) => {
    const productToCancel = {
      productId: product.productId,
      productName: product.productName,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      status: product.status
    };

    try {
      const response = await fetch(`${API_BASE_URL}Guide/order/CancelOneOrderProducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ product: productToCancel, orderId }),
      });

      const data = await response.json();
      if (data.status) {
        const updatedItems = updatedOrder.items.map(item => {
          if (item.productId === product.productId) {
            return { ...item, status: 3, statusStr: 'Cancelled' };
          }
          return item;
        });
        setUpdatedOrder({ ...updatedOrder, items: updatedItems });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAcceptAll = async (orderId) => {
    const productsToAccept = updatedOrder.items.filter(item => item.status === 1).map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      status: item.status
    }));

    try {
      const response = await fetch(`${API_BASE_URL}Guide/order/AcceptOrderProducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ products: productsToAccept, orderId }),
      });

      const data = await response.json();
      if (data.status) {
        const updatedItems = updatedOrder.items.map(item => {
          return { ...item, status: 2, statusStr: 'Accepted' };
        });
        setUpdatedOrder({ ...updatedOrder, items: updatedItems });
        setAllAccepted(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelAll = async (orderId) => {
    const productsToCancel = updatedOrder.items.filter(item => item.status === 1).map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      status: item.status
    }));

    try {
      const response = await fetch(`${API_BASE_URL}Guide/order/CancelOrderProducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ products: productsToCancel, orderId }),
      });

      const data = await response.json();
      if (data.status) {
        const updatedItems = updatedOrder.items.map(item => {
          return { ...item, status: 3, statusStr: 'Cancelled' };
        });
        setUpdatedOrder({ ...updatedOrder, items: updatedItems });
        setAllAccepted(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="orderDetails-overlay">
      <div className="orderDetails-overlay-content">
        <h2>Order Details</h2>
        {updatedOrder ? (
          <div className="order-details">
            <p><strong>Customer Name:</strong> {updatedOrder.customerName}</p>
            <p><strong>Phone:</strong> {updatedOrder.phone}</p>
            <p><strong>Address:</strong> {updatedOrder.address}</p>
            <p><strong>Total:</strong> {updatedOrder.totalAmount}$</p>
            <h3>Items Details:</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Count</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  {getToken() && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {updatedOrder.items.map((item, index) => (
                  <tr key={`${item.productId}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice}$</td>
                    <td>{item.quantity * item.unitPrice}$</td>
                    <td>{item.statusStr}</td>
                    {getToken() && item.status === 1 && (
                      <td>
                        <button
                          className="order-button accept"
                          onClick={() => handleAcceptProduct(item, updatedOrder.orderId)}
                        >
                          Accept
                        </button>
                        <button
                          className="order-button cancel"
                          onClick={() => handleCancelProduct(item, updatedOrder.orderId)}
                        >
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* {updatedOrder.items.length > 1 && getToken() && !allAccepted && (
              <div className="order-details-buttons">
                <button className="order-button accept" onClick={() => handleAcceptAll(updatedOrder.orderId)}>
                  Accept All
                </button>
                <button className="order-button cancel" onClick={() => handleCancelAll(updatedOrder.orderId)}>
                  Cancel All
                </button>
              </div>
            )} */}
            <div className="order-details-buttons">
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
