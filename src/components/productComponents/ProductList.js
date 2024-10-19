import React, { useState, useEffect, useRef } from 'react';
import './ProductList.css';
import API_BASE_URL from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import EditProductModal from './EditProduct';
import Swal from 'sweetalert2';
import { getToken, getUserId, getUserType } from '../../Utility/cookieUtils';

const ProductTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const itemsPerPage = 10;
  
  const searchInputRef = useRef(null); 

  const fetchProducts = async (searchTerm, minPrice, maxPrice) => {
    if (!getUserId()) {
      navigate('/login');
    } else {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}Guide/Product/GetAllProducts`, {
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
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
            isGetAll:getUserType()==='ad',
          }),
        });
        const data = await response.json();
        if(data.items){
          setProducts(data.items);
          const totalProducts = data.totalCount;
          setTotalPages(Math.ceil(totalProducts / itemsPerPage));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer); 
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(debouncedSearchTerm, minPrice, maxPrice);
  }, [currentPage]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete process',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE_URL}Guide/Product/DeleteProduct?id=${id}`, {
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
              confirmButtonText: 'ok',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton:false,
              allowOutsideClick: false,
            });
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
          } else {
            Swal.fire({
              title: 'Delete Process',
              text: data.message,
              icon: 'error',
              confirmButtonText: 'ok',
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
    setSelectedProductId(id);
    setShowEditProductModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProductAdded = () => {
    setShowAddProductModal(false);
    setCurrentPage(1);
    setSearchTerm('');
    fetchProducts('', minPrice, maxPrice);
  };

  const handleProductUpdated = () => {
    setShowEditProductModal(false);
    setCurrentPage(1);
    setSearchTerm('');
    fetchProducts(debouncedSearchTerm, minPrice, maxPrice);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchProducts(debouncedSearchTerm, minPrice, maxPrice);
  };

  const handleClear = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    fetchProducts('', '', '');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-table">
      <button onClick={() => setShowAddProductModal(true)} className="add-product-btn">
      Add Product
      </button>
      <h1 className="product-list-title">Products List</h1> 
      {showAddProductModal && (
        <AddProduct
          onClose={() => setShowAddProductModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}

      {showEditProductModal && (
        <EditProductModal
          productId={selectedProductId}
          onClose={() => setShowEditProductModal(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="filter-container">
                <input
                  type="text"
                  placeholder="Search in Products..."
                  value={searchTerm}
                  ref={searchInputRef}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="price-filter">
                  <input
                    type="number"
                    placeholder="Minimum Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Maximum Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <button onClick={handleFilter} className="filter-btn">
                    Search
                  </button>
                  <button onClick={handleClear} className="clear-btn">
                    Clear
                  </button>
                </div>
              </div>
            </td>
          </tr>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No Products Found
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <button onClick={() => handleEdit(product.id)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="delete-btn">
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

export default ProductTable;
