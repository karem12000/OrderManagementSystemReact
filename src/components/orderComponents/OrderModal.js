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
        title: 'تنبيه',
        text: 'تأكد من إدخال الكمبة',
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
      title: 'تنبيه',
      text: 'هل تريد إزالة المنتج',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'إزاله',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setCart((prevCart) => {
          const updatedCart = prevCart.filter((item) => item.id !== id);
          if (updatedCart.length === 0) {
            Swal.fire({
              title: 'سلة التسوق فارغة',
              text: 'لقد تمت إزالة جميع المنتجات من السلة.',
              icon: 'info',
              confirmButtonText: 'موافق',
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
        <h2>إكمال الطلب</h2>
        <h3>البيانات الشخصية</h3>
        <form onSubmit={handleFormSubmit} className="user-info-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="الاسم"
              value={userInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={userInfo.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="phone"
              placeholder="رقم الهاتف"
              value={userInfo.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="العنوان"
              value={userInfo.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <input
              type="date"
              name="dob"
              placeholder="تاريخ الميلاد"
              value={userInfo.dob}
              onChange={handleInputChange}
            />
          </div>
  
          <h3>المنتجات المضافة إلى السلة:</h3>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>م</th>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>الإجراء</th>
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
                      إزالة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className="button-row">
            <button type="submit" className="submit-btn">إرسال الطلب</button>
            <button type="button" onClick={onClose} className="cancel-btn">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default OrderModal;
