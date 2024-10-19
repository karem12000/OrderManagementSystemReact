import React, { useState } from 'react';
import './AddCustomer.css';
import API_BASE_URL from '../../config/apiConfig';
import Swal from 'sweetalert2';
import { getToken } from '../../Utility/cookieUtils';

const AddCustomer = ({ onClose, onCustomerAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const customerData = {
            Name: name,
            Email: email,
            Phone: phone,
            Address: address,
            DateOfBirth: dateOfBirth,
        };

        if (!name) {
            Swal.fire({
                title: 'Alert',
                text: 'الاسم مطلوب',
                icon: 'error',
                confirmButtonText: 'ok',
                timer: 2000,
                showConfirmButton:false,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setIsLoading(false);
            return;
        }

        if (!email) {
            Swal.fire({
                title: 'Alert',
                text: 'البريد الإلكتروني مطلوب',
                icon: 'error',
                confirmButtonText: 'ok',
                showConfirmButton:false,
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setIsLoading(false);
            return;
        }

        if (!phone) {
            Swal.fire({
                title: 'Alert',
                text: 'Phone number required',
                icon: 'error',
                confirmButtonText: 'ok',
                showConfirmButton:false,
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setIsLoading(false);
            return;
        }

        if (!address) {
            Swal.fire({
                title: 'Alert',
                text: 'Address required',
                icon: 'error',
                confirmButtonText: 'ok',
                showConfirmButton:false,
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setIsLoading(false);
            return;
        }

        if (!dateOfBirth) {
            Swal.fire({
                title: 'Alert',
                text: 'Date of birth required',
                icon: 'error',
                confirmButtonText: 'ok',
                showConfirmButton:false,
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}People/Customer/SaveCustomer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(customerData),
            });

            const result = await response.json();
            if (result.status) {
                Swal.fire({
                    title: 'Alert',
                    text: result.message,
                    icon: 'success',
                    confirmButtonText: 'ok',
                    showConfirmButton:false,
                    timer: 1000,
                    showCancelButton: false,
                    allowOutsideClick: false,
                });
                onCustomerAdded();
                setName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setDateOfBirth('');
            } else {
                Swal.fire({
                    title: 'Alert',
                    text: result.message,
                    icon: 'error',
                    confirmButtonText: 'ok',
                    showConfirmButton:false,
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
                showConfirmButton:false,
                timer: 1000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/\D/g, '');
        setPhone(numericValue);
    };

    return (
        <div className="addCustomer-modal">
            <div className="addCustomer-modal-content">
                <h2>Add Customer</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone: </label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address: </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date Of Birth: </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>
                    <div className="addCustomer-modal-actions">
                        <button type="submit" className="add-customer-button" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add'}
                        </button>
                        <button type="button" className="close-button" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;
