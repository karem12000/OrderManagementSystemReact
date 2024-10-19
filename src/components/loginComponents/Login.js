import './login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/themes/bootstrap.css'; 
import API_BASE_URL from '../../config/apiConfig';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        email: '',
        password: '',
        fullName: ''
    });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if(!username || !password){
                Swal.fire({
                    title: 'خطأ!',
                    text: 'برجاء إدخال بيانات الدخول',
                    icon: 'error',
                    confirmButtonText: 'تم',
                    showConfirmButton:false,
                    showCancelButton:false, 
                    timer: 2000,
                });
            }else{
                const response = await axios.post(`${API_BASE_URL}People/Customer/Login`, {
                    username,
                    password,
                });
                if(response.data.status){
                    if(response.data.results.token){
                        Cookies.set('token', response.data.results.token , { expires: 7 });
                        Cookies.set('userId', response.data.results.id , { expires: 7 });
                        navigate('/Products');
                    } else {
                        Swal.fire({
                            title: 'خطأ!',
                            text: 'حدث خطأ',
                            icon: 'error',
                            confirmButtonText: 'تم',
                            showCancelButton:false,
                            showConfirmButton:false,
                            timer: 2000,
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'خطأ!',
                        text: response.data.messages,
                        icon: 'error',
                        confirmButtonText: 'تم',
                        showCancelButton:false,
                        showConfirmButton:false,
                        timer: 2000,
                    });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleOrderNavigation = () => {
        navigate('/ProductCardList');
    };

    const openRegisterModal = () => {
        setRegisterModalOpen(true);
    };

    const closeRegisterModal = () => {
        setRegisterModalOpen(false);
    };

    const handleRegisterChange = (e) => {
        setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}People/User/SaveUser`, {
                email: registerInfo.email,
                password: registerInfo.password,
                fullName: registerInfo.fullName,
            });

            if (response.data.status) {
                Swal.fire({
                    title: 'تم التسجيل بنجاح!',
                    text: 'تم تسجيلك بنجاح، يمكنك الآن تسجيل الدخول',
                    icon: 'success',
                    confirmButtonText: 'تم',
                    showConfirmButton:false,
                    showCancelButton: false,
                    timer:2000
                });
                closeRegisterModal();
            } else {
                Swal.fire({
                    title: 'خطأ!',
                    text: response.data.messages,
                    icon: 'error',
                    confirmButtonText: 'تم',
                    showConfirmButton:false,
                    showCancelButton:false,
                    timer: 2000,
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>تسجيل الدخول</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="أدخل البريد الإلكتروني"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                    />
                </div>
                <button type="submit">دخول</button>
                <button onClick={handleOrderNavigation} className="order-button">
                  طلب منتجات
                </button>
                {/* <button onClick={openRegisterModal} className="order-button">
                  تسجيل مستخدم
                </button> */}
            </form>

            <Modal
                isOpen={isRegisterModalOpen}
                onRequestClose={closeRegisterModal}
                contentLabel="تسجيل مستخدم جديد"
                className="register-modal"
                overlayClassName="register-modal-overlay"
            >
                <h2>تسجيل مستخدم جديد</h2>
                <form>
                    <div>
                        <label>الاسم الكامل</label>
                        <input
                            type="text"
                            name="fullName"
                            value={registerInfo.fullName}
                            onChange={handleRegisterChange}
                            placeholder="أدخل الاسم الكامل"
                        />
                    </div>
                    <div>
                        <label>البريد الإلكتروني</label>
                        <input
                            type="email"
                            name="email"
                            value={registerInfo.email}
                            onChange={handleRegisterChange}
                            placeholder="أدخل البريد الإلكتروني"
                        />
                    </div>
                    <div>
                        <label>كلمة المرور</label>
                        <input
                            type="password"
                            name="password"
                            value={registerInfo.password}
                            onChange={handleRegisterChange}
                            placeholder="أدخل كلمة المرور"
                        />
                    </div>
                    <button type="button" onClick={handleRegisterSubmit}>
                        تسجيل
                    </button>
                    <button type="button" onClick={closeRegisterModal}>
                        إلغاء
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Login;
