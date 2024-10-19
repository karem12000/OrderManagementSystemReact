import React from 'react';
import './OrderModal.css';
import Swal from 'sweetalert2';

const OrderModal = ({ isOpen, onClose, onSubmit, userInfo, setUserInfo, cart, setCart }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(); 
  };

  const handleQuantityChange = (id, quantity) => {
    if(quantity<=0 || isNaN(quantity)){
      Swal.fire({
        title: 'Alert',
        text: 'Make sure to enter the quantity',
        icon: 'error',
        showConfirmButton: false, 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      return;
    }
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === id ? { ...item, requiredQuantity: quantity } : item
      )
    );
  };

  const handleRemoveProduct = (id, e) => {
    e.preventDefault(); 
  
    Swal.fire({
      title: 'Alert',
      text: 'Do you want to remove the product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setCart((prevCart) => {
          const updatedCart = prevCart.filter((item) => item.id !== id);
          if (updatedCart.length === 0) {
            Swal.fire({
              title: 'Shopping cart is empty',
              text: 'All products have been removed from the cart.',
              icon: 'info',
              confirmButtonText: 'ok',
              showConfirmButton:false,
              showCancelButton:false,
              timer:2000
            }).then(() => {
              onClose();
            });
          }
          return updatedCart;
        });
      }
    });
  };
  

  return (
    <div className="orderModal-overlay">
      <div className="orderModal-content">
        <h2>Complete Order</h2>
        <h3>Personal Data</h3>
        <form onSubmit={handleFormSubmit} className="user-info-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userInfo.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={userInfo.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={userInfo.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <input
              type="date"
              name="dob"
              placeholder="Date Of Birth"
              value={userInfo.dob}
              onChange={handleInputChange}
            />
          </div>
  
          <h3>Products added to cart</h3>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.requiredQuantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value,10))} 
                    />
                  </td>
                  <td>
                    <button className="remove-btn" onClick={(e) => handleRemoveProduct(item.id,e)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className="button-row">
            <button type="submit" className="submit-btn">Submit Order</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default OrderModal;
