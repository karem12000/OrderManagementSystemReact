import React, { useState, useEffect } from 'react';
import './UserList.css';
import API_BASE_URL from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import AddUser from './AddUser';
import EditUserModal from './EditUser';
import Swal from 'sweetalert2';
import { getToken, getUserId, getUserType } from '../../Utility/cookieUtils';

const UserTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const itemsPerPage = 10;
  const [userType, setUserType] = useState(null);

  const fetchUsers = async () => {
          try {
        const response = await fetch(`${API_BASE_URL}People/User/GetAllUsers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            ownerId: getUserId(),
            page: currentPage,
            pageSize: itemsPerPage,
            search: searchTerm,
          }),
        });

        const data = await response.json();
        
        setUsers(data.items);
        const totalUsers = data.totalCount;
        setTotalPages(Math.ceil(totalUsers / itemsPerPage));
      } catch (err) {
          
      } finally {
        setLoading(false);
      }
    
  };

  useEffect(() => {
    if (!getUserId()) {
      navigate('/login');
    } else if(getUserType()!=='ad'){
      navigate('/unauthorized');
    }else {
    fetchUsers();
    }
  }, [currentPage, searchTerm]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Process',
      text: 'Do you want to delete user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE_URL}People/User/DeleteUser?id=${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
          });

          const data = await response.json();
          if (data.status) {
            Swal.fire({
              title: 'Delete Process',
              text: data.message,
              icon: 'success',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton:false,
              allowOutsideClick: false,
            });
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          } else {
            Swal.fire({
              title: 'Error',
              text: data.message,
              icon: 'error',
              timer: 2000,
              showCancelButton: false,
              showConfirmButton:false,
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
    setSelectedUserId(id);
    setShowEditUserModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUserAdded = () => {
    setShowAddUserModal(false);
    setCurrentPage(1);
    setSearchTerm('');
    fetchUsers();
  };

  const handleUserUpdated = () => {
    setShowEditUserModal(false);
    setCurrentPage(1);
    setSearchTerm('');
    fetchUsers();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-table">
      <button onClick={() => setShowAddUserModal(true)} className="add-user-btn">
        Add User
      </button>
      {showAddUserModal && (
        <AddUser
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}

      {showEditUserModal && (
        <EditUserModal
          userId={selectedUserId}
          onClose={() => setShowEditUserModal(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}
            <h1 className="product-list-title">Users List</h1> 

      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <input
                type="text"
                placeholder="Search in users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </td>
          </tr>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No Users Found
              </td>
            </tr>
          ) : (
            users.map((user,index) => (
              <tr key={user.id}>
                <td>{index+1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.userName}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default UserTable;
