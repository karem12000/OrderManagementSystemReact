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
                title: 'تنبيه',
                text: 'الاسم مطلوب',
                icon: 'error',
                confirmButtonText: 'موافق',
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
                title: 'تنبيه',
                text: 'البريد الإلكتروني مطلوب',
                icon: 'error',
                confirmButtonText: 'موافق',
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
                title: 'تنبيه',
                text: 'رقم الهاتف مطلوب',
                icon: 'error',
                confirmButtonText: 'موافق',
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
                title: 'تنبيه',
                text: 'العنوان مطلوب',
                icon: 'error',
                confirmButtonText: 'موافق',
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
                title: 'تنبيه',
                text: 'تاريخ الميلاد مطلوب',
                icon: 'error',
                confirmButtonText: 'موافق',
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
                    title: 'تنبيه',
                    text: result.message,
                    icon: 'success',
                    confirmButtonText: 'موافق',
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
                    title: 'تنبيه',
                    text: result.message,
                    icon: 'error',
                    confirmButtonText: 'موافق',
                    showConfirmButton:false,
                    timer: 2000,
                    showCancelButton: false,
                    allowOutsideClick: false,
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'تنبيه',
                text: 'حدث خطأ',
                icon: 'error',
                confirmButtonText: 'موافق',
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
                <h2>إضافة عميل</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">الاسم:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">البريد الإلكتروني:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">رقم الهاتف:</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">العنوان:</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">تاريخ الميلاد:</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>
                    <div className="addCustomer-modal-actions">
                        <button type="submit" className="add-customer-button" disabled={isLoading}>
                            {isLoading ? 'جاري الإضافه...' : 'إضافة'}
                        </button>
                        <button type="button" className="close-button" onClick={onClose}>
                            إغلاق
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;
