import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config/apiConfig';
import './EditCustomer.css';
import Swal from 'sweetalert2';
import { getToken } from '../../Utility/cookieUtils';

const EditCustomerModal = ({ customerId, onClose, onCustomerUpdated }) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}People/Customer/GetCustomerById?id=${customerId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });

                const data = await response.json();
                if (data) {
                    setCustomer(data);
                } else {
                    Swal.fire({
                        title: 'تنبيه',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'موافق',
                        timer: 2000,
                        showConfirmButton:false,
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

        fetchCustomer();
    }, [customerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!customer.name) {
            Swal.fire({
                title: 'تنبيه',
                text: 'الاسم مطلوب',
                icon: 'error',
                confirmButtonText: 'موافق',
                showConfirmButton:false,
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setLoading(false);
            return;
        }

        if (!customer.email) {
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
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}People/Customer/UpdateCustomer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    dateOfBirth: customer.dateOfBirth,
                }),
            });

            const data = await response.json();
            if (data.status) {
                Swal.fire({
                    title: 'نجاح',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'موافق',
                    showConfirmButton:false,
                    timer: 1000,
                    showCancelButton: false,
                    allowOutsideClick: false,
                });
                onCustomerUpdated();
                onClose();
            } else {
                Swal.fire({
                    title: 'تنبيه',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'موافق',
                    showConfirmButton:false,
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

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/\D/g, '');
        setCustomer({ ...customer, phone: numericValue });
    };

    if (loading) {
        return <div>جاري التحميل...</div>;
    }

    if (error) {
        return <div>خطأ: {error}</div>;
    }

    return (
        <div className="editCustomer-modal">
            <div className="editCustomer-modal-content">
                <h2>تعديل العميل</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>الاسم:</label>
                        <input
                            type="text"
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>البريد الإلكتروني:</label>
                        <input
                            type="email"
                            value={customer.email}
                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>رقم الهاتف:</label>
                        <input
                            type="text"
                            value={customer.phone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>العنوان:</label>
                        <input
                            type="text"
                            value={customer.address}
                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>تاريخ الميلاد:</label>
                        <input
                            type="date"
                            value={customer.dateOfBirthStr}
                            onChange={(e) => setCustomer({ ...customer, dateOfBirth: e.target.value })}
                        />
                    </div>
                    <div className="editCustomer-modal-buttons">
                        <button type="submit" className="update-btn">تعديل</button>
                        <button type="button" onClick={onClose} className="close-btn">إغلاق</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomerModal;
