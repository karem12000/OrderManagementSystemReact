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
                    <Link to="/products">Products</Link>
                </li>
                <li>
                    <Link to="/orderList">Orders</Link>
                </li>
                <li>
                    <Link to="/customers">Customers</Link>
                </li>
                <li>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        Log out
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
