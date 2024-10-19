import React, { useState } from 'react';
import './AddProduct.css';
import API_BASE_URL from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getToken } from '../../Utility/cookieUtils';

const AddProduct = ({ onClose, onProductAdded }) => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const productData = {
            Name: productName,
            Price: parseFloat(price),
            StockQuantity: parseInt(quantity, 10),
        };

        if (!productName) {
            Swal.fire({
                title: 'Alert',
                text: 'Name is required',
                icon: 'error',
                confirmButtonText: 'ok', 
                timer: 2000,
                showCancelButton: false, 
                allowOutsideClick: false, 
              });
            setIsLoading(false);
            return;
        }

        if (price <= 0) {
            Swal.fire({
                title: 'Alert',
                text: 'The product price is incorrect',
                icon: 'error',
                confirmButtonText: 'ok', 
                timer: 2000,
                showCancelButton: false, 
                allowOutsideClick: false, 
              });
            setIsLoading(false);
            return;
        }

        if (quantity <= 0) {
            Swal.fire({
                title: 'Alert',
                text: 'Incorrect product quantity',
                icon: 'error',
                confirmButtonText: 'ok', 
                timer: 2000,
                showCancelButton: false, 
                allowOutsideClick: false, 
              });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}Guide/Product/CreateProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(productData),
            });

            const result = await response.json();
            if (result.status) {
                Swal.fire({
                    title: 'Alert',
                    text: result.message,
                    icon: 'success',
                    confirmButtonText: 'ok', 
                    timer: 2000,
                    showCancelButton: false, 
                    allowOutsideClick: false, 
                  });
                onProductAdded();
                setProductName('');
                setPrice('');
                setQuantity('');
            } else {
                Swal.fire({
                    title: 'Alert',
                    text: result.message,
                    icon: 'error',
                    confirmButtonText: 'ok', 
                    timer: 2000,
                    showCancelButton: false, 
                    allowOutsideClick: false, 
                  });
            }
        } catch (error) {
            Swal.fire({
                title: 'Alert',
                text: 'An error occurred',
                icon: 'error',
                confirmButtonText: 'ok', 
                timer: 2000,
                showCancelButton: false, 
                allowOutsideClick: false, 
              });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="addProductmodal">
            <div className="addProductmodal-content">
                <h2>Add Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">ProductName:</label>
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity in Stock:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div className="addProductmodal-actions">
                        <button type="submit" className="add-product-button" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add'}
                        </button>
                        <button type="button" className="close-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;