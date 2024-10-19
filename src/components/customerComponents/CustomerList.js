import React, { useState, useEffect } from 'react';
import './CustomerList.css';
import API_BASE_URL from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import AddCustomer from './AddCustomer';
import EditCustomerModal from './EditCustomer';
import Swal from 'sweetalert2';
import { getToken, getUserId, getUserType } from '../../Utility/cookieUtils';

const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const itemsPerPage = 10;

    const fetchCustomers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}People/Customer/GetAllCustomers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        page: currentPage,
                        pageSize: itemsPerPage,
                        search: searchTerm,
                    }),
                });

                const data = await response.json();
                setCustomers(data.items);
                const totalCustomers = data.totalCount;
                setTotalPages(Math.ceil(totalCustomers / itemsPerPage));
            } catch (err) {
                console.error('Failed to fetch customers', err);
            } finally {
                setLoading(false);
            }
    };

    useEffect(() => {
        if (!getUserId()) {
            navigate('/login');
        }else if(getUserType()!=='ad'){
            navigate('/unauthorized');
        }else {
        fetchCustomers();
        }
    }, [currentPage, searchTerm]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Process',
            text: 'Do you want to delete customer?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Close',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_BASE_URL}People/Customer/DeleteCustomer?id=${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                    });

                    const data = await response.json();
                    if (data.status) {
                        Swal.fire({
                            title: 'Delete process',
                            text: data.message,
                            icon: 'success',
                            timer: 1000,
                            showConfirmButton:false,
                            showCancelButton: false,
                            allowOutsideClick: false,
                        });
                        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
                    } else {
                        Swal.fire({
                            title: 'Alert',
                            text: data.message,
                            icon: 'error',
                            timer: 2000,
                            showConfirmButton:false,
                            showCancelButton: false,
                            allowOutsideClick: false,
                        });
                    }
                } catch (error) {
                    console.log('Error', 'An error occurred while deleting', 'error');
                }
            }
        });
    };

    const handleEdit = (id) => {
        setSelectedCustomerId(id);
        setShowEditCustomerModal(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCustomerAdded = () => {
        setShowAddCustomerModal(false);
        setCurrentPage(1);
        setSearchTerm('');
        fetchCustomers();
    };

    const handleCustomerUpdated = () => {
        setShowEditCustomerModal(false);
        setCurrentPage(1);
        setSearchTerm('');
        fetchCustomers();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="customer-list">
            <button onClick={() => setShowAddCustomerModal(true)} className="add-customer-btn">
            Add Customer
            </button>
            {showAddCustomerModal && (
                <AddCustomer
                    onClose={() => setShowAddCustomerModal(false)}
                    onCustomerAdded={handleCustomerAdded}
                />
            )}

            {showEditCustomerModal && (
                <EditCustomerModal
                    customerId={selectedCustomerId}
                    onClose={() => setShowEditCustomerModal(false)}
                    onCustomerUpdated={handleCustomerUpdated}
                />
            )}
            <h1 className="product-list-title">Customer List</h1> 
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Date Of Birth</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="7">
                            <input
                                type="text"
                                placeholder="Search in cutomers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </td>
                    </tr>
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>
                                No Customers Found
                            </td>
                        </tr>
                    ) : (
                        customers.map((customer, index) => (
                            <tr key={customer.id}>
                                <td>{index + 1}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.address}</td>
                                <td>{customer.dateOfBirthStr}</td>
                                <td>
                                    <button onClick={() => handleEdit(customer.id)} className="edit-btn">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(customer.id)} className="delete-btn">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {customers.length > 0 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={currentPage === number ? 'active' : ''}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerList;
