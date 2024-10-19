// src/components/Sidebar.js
import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import managementLogo from '../../assets/managementLogo.jpg'
import Cookies from 'js-cookie';

const Sidebar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('userId');
        navigate('/login');
    };
    return (
        <div className="sidebar">
            <img src={managementLogo} alt="Management Logo" className="sidebar-logo" />
            <ul>
                <li>
                    <Link to="/products">المنتجات</Link>
                </li>
                <li>
                    <Link to="/orderList">الطلبات</Link>
                </li>
                <li>
                    <Link to="/customers">العملاء</Link>
                </li>
                <li>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        تسجيل الخروج
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
