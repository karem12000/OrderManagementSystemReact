import './login.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'alertifyjs/build/css/themes/bootstrap.css'; 
import API_BASE_URL from '../../config/apiConfig';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import ViewOrdersModal from '../orderComponents/ViewOrdersModal';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [isLoading,setIsLoading]  = useState(false);

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
                    title: 'Error',
                    text: 'Please enter login Data',
                    icon: 'error',
                    confirmButtonText: 'ok',
                    showConfirmButton:false,
                    showCancelButton:false, 
                    timer: 2000,
                });
            }else{
                setIsLoading(true);
                const response = await axios.post(`${API_BASE_URL}People/Customer/Login`, {
                    username,
                    password,
                });
                if(response.data.status){
                    if(response.data.results.token){
                        Cookies.set('token', response.data.results.token , { expires: 7 });
                        Cookies.set('userId', response.data.results.id , { expires: 7 });
                        if(response.data.results.isAdmin){
                            Cookies.set('userType', 'ad' , { expires: 7 });
                        }
                        navigate('/Products');
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'An error occurred',
                            icon: 'error',
                            confirmButtonText: 'ok',
                            showCancelButton:false,
                            showConfirmButton:false,
                            timer: 2000,
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.data.messages,
                        icon: 'error',
                        confirmButtonText: 'ok',
                        showCancelButton:false,
                        showConfirmButton:false,
                        timer: 2000,
                    });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
        }finally{
            setIsLoading(false);
        }
    };


    const handleOrderNavigation = () => {
        navigate('/ProductCardList');
    };

    const openRegisterModal = () => {
        setRegisterModalOpen(true);
    };

    const openOrderModal = (status,e) => {
        e.preventDefault();
        setShowOrdersModal(true);
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
                    title: 'Registered Successfully',
                    text: 'You have successfully registered, you can now log in',
                    icon: 'success',
                    confirmButtonText: 'ok',
                    showConfirmButton:false,
                    showCancelButton: false,
                    timer:2000
                });
                closeRegisterModal();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.data.messages,
                    icon: 'error',
                    confirmButtonText: 'ok',
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
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                    />
                </div>
                <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? 'Loging in...' : 'Login'}
                </button>
                <button onClick={handleOrderNavigation} className="order-button">
                  Order Products
                </button>
                <button onClick={(e) => openOrderModal(true,e)} className="order-button">
                    Follow Up Orders
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
                <h2>Registe New Password</h2>
                <form>
                    <div>
                        <label>FullName</label>
                        <input
                            type="text"
                            name="fullName"
                            value={registerInfo.fullName}
                            onChange={handleRegisterChange}
                            placeholder="Enter full name"
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={registerInfo.email}
                            onChange={handleRegisterChange}
                            placeholder="Enter Email"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={registerInfo.password}
                            onChange={handleRegisterChange}
                            placeholder="Enter Password"
                        />
                    </div>
                    <button type="button" onClick={handleRegisterSubmit}>
                        Register
                    </button>
                    <button type="button" onClick={closeRegisterModal}>
                        Cancel
                    </button>
                </form>
            </Modal>
            {showOrdersModal && (
        <ViewOrdersModal
          onClose={() => setShowOrdersModal(false)}
        />
      )}
        </div>
        
    );
};

export default Login;
