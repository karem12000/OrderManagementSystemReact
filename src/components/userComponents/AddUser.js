import React, { useState } from 'react';
import './AddUser.css';
import API_BASE_URL from '../../config/apiConfig';
import Swal from 'sweetalert2';
import { getToken } from '../../Utility/cookieUtils';

const AddUser = ({ onClose, onUserAdded }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userData = {
            FullName: fullName,
            Email: email,
            Password: password,
        };

        if (!fullName) {
            Swal.fire({
                title: 'تنبيه',
                text: 'الاسم مطلوب',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 2000,
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
                confirmButtonText: 'OK',
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setIsLoading(false);
            return;
        }

        if (!password) {
            Swal.fire({
                title: 'تنبيه',
                text: 'كلمة المرور مطلوبه',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}People/User/SaveUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();
            if (result.status) {
                Swal.fire({
                    title: 'تنبيه',
                    text: result.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    showCancelButton: false,
                    allowOutsideClick: false,
                });
                onUserAdded();
                setFullName('');
                setEmail('');
                setPassword('');
            } else {
                Swal.fire({
                    title: 'تنبيه',
                    text: result.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
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
                confirmButtonText: 'OK',
                timer: 2000,
                showCancelButton: false,
                allowOutsideClick: false,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="addUserModal">
            <div className="addUserModal-content">
                <h2>إضافة مستخدم</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">الاسم:</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">البريد الإلكتروني:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">كلمة المرور:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="addUserModal-actions">
                        <button type="submit" className="add-user-button" disabled={isLoading}>
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

export default AddUser;
