import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/apiConfig';
import './EditProduct.css'; 
import Swal from 'sweetalert2';
import { getToken } from '../../Utility/cookieUtils';

const EditProductModal = ({ productId, onClose, onProductUpdated }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}Guide/Product/GetProductById?id=${productId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        if (data.status) {
          setProduct(data.data);
        } else {
          Swal.fire({
            title: 'Alert',
            text:data.message,
            icon: 'error',
            confirmButtonText: 'ok', 
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

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!product.name) {
      Swal.fire({
        title: 'Alert',
        text: 'Name is required',
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      setLoading(false);
      return;
    }

    if (product.price <= 0) {
      Swal.fire({
        title: 'Alert',
        text: 'The product price is incorrect',
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      setLoading(false);
      return;
    }

    if (product.stockQuantity <= 0) {
      Swal.fire({
        title: 'Alert',
        text: 'Incorrect product quantity',
        icon: 'error',
        confirmButtonText: 'ok', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}Guide/Product/UpdateProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          stockQuantity: product.stockQuantity,
        }),
      });

       const data = await response.json();
      if (data.status) {
        Swal.fire({
          title: 'Alert',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'ok', 
          timer: 2000,
          showCancelButton: false, 
          allowOutsideClick: false, 
        });
        onProductUpdated();
        onClose(); 
      } else {
        Swal.fire({
          title: 'Alert',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'ok', 
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="editProductModal">
      <div className="editProductModal-content">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              value={product.stockQuantity}
              onChange={(e) => setProduct({ ...product, stockQuantity: parseInt(e.target.value, 10) })}
            />
          </div>
          <div className="editProductModal-buttons">
          <button type="submit" className="update-btn">Edit</button>
            <button type="button" onClick={onClose} className="close-btn">Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;

