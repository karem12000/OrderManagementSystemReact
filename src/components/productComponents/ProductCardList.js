import React, { useState, useEffect } from 'react';
import './ProductCardList.css'; 
import API_BASE_URL from '../../config/apiConfig';
import OrderModal from '../orderComponents/OrderModal.js';
import { getToken } from '../../Utility/cookieUtils.js';
import Swal from 'sweetalert2'; 

const ProductCardList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; 

  const [isModalOpen, setModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
  });

  const fetchProducts = async (searchTerm, minPrice, maxPrice) => {
    try {
      const response = await fetch(`${API_BASE_URL}Guide/Product/GetAllProducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: null,
          page: currentPage,
          pageSize: itemsPerPage,
          search: searchTerm,
          minPrice: minPrice ? parseFloat(minPrice) : null,
          maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        }),
      });

      const data = await response.json();
      if (data.items) {
        const productsWithQuantity = data.items.map(product => ({
          ...product,
          requiredQuantity: 1, 
        }));
        setProducts(productsWithQuantity);
        const totalProducts = data.totalCount; 
        setTotalPages(Math.ceil(totalProducts / itemsPerPage));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleAddToCart = (product) => {
    if (product.requiredQuantity <= 0) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى إدخال كمية صحيحة',
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      return;
    }

    if (product.requiredQuantity > product.stockQuantity) {
      Swal.fire({
        title: 'تنبيه',
        text: 'الكمية المطلوبة أكبر من المتاحة في المخزون!',
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
      return;
    }

    const existingCartItem = cart.find(item => item.id === product.id);
    
    if (existingCartItem) {
      if (existingCartItem.requiredQuantity + product.requiredQuantity > existingCartItem.stockQuantity) {
        Swal.fire({
          title: 'تنبيه',
          text: 'لا يمكن إضافة الكمية المطلوبة. الكمية المطلوبة أكبر من المتاحة في المخزون!',
          icon: 'error',
          confirmButtonText: 'موافق', 
          timer: 2000,
          showCancelButton: false, 
          allowOutsideClick: false, 
        });
        return;
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === product.id 
            ? { ...item, requiredQuantity: item.requiredQuantity + product.requiredQuantity } 
            : item
        )
      );
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
        requiredQuantity: product.requiredQuantity,
      };
      setCart(prevCart => [...prevCart, cartItem]);
    }

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === product.id ? { ...p, requiredQuantity: 1 } : p
      )
    );

    Swal.fire({
      title: 'تنبيه',
      text: `تمت الإضافة بنجاح`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    });
  };

  const handleCompleteOrder = () => {
    setModalOpen(true);  
  };

  const handleOrderSubmit = async () => {
    const orderDetails = {
      CustomerInfo: {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        dateOfBirth: userInfo.dob,
      },
      OrderItems: cart.map(item => ({
        productId: item.id,
        quantity: item.requiredQuantity,
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}Guide/Order/PlaceOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(orderDetails),
      });

      const result = await response.json();
      if (result.status) {
        Swal.fire({
          title: 'تنبيه',
          text: `تم إكمال الطلب بنجاح!`,
          icon: 'success',
          confirmButtonText: 'موافق', 
          timer: 2000,
          showCancelButton: false, 
          allowOutsideClick: false, 
        });
        setCart([]); 
        setModalOpen(false); 
        setUserInfo({ name: '', email: '', phone: '', address: '', dob: '' }); 
      } else {
        Swal.fire({
          title: 'تنبيه',
          text: `خطأ في إكمال الطلب يرجاء المحاولة مرة أخري`,
          icon: 'error',
          confirmButtonText: 'موافق', 
          timer: 2000,
          showCancelButton: false, 
          allowOutsideClick: false, 
        });
      }     

    } catch (error) {
      Swal.fire({
        title: 'تنبيه',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'موافق', 
        timer: 2000,
        showCancelButton: false, 
        allowOutsideClick: false, 
      });
    }
  };

   const handleQuantityChange = (id, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, requiredQuantity: Math.max(1, value) } 
          : product
      )
    );
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchProducts(searchTerm, minPrice, maxPrice);
  };

  const handleClear = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    fetchProducts('', '', '');
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <div className="product-list">
      <h1>قائمة المنتجات</h1>
      
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="بحث في المنتجات..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="number"
          placeholder="الحد الأدنى للسعر"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="price-input"
        />
        <input
          type="number"
          placeholder="الحد الأقصى للسعر"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="price-input"
        />
        <button onClick={handleFilter} className="filter-btn">
          بحث
        </button>
        <button onClick={handleClear} className="clear-btn">
          مسح
        </button>
      </div>

      {products.length === 0 ? (
        <p className="no-products-message">لا توجد منتجات</p> 
      ) : (
        <div className="card-container">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>السعر: {product.price} جنيه</p>
              <p>الكمية المتاحة: {product.stockQuantity}</p>
              
              <div className="quantity-section">
                <label htmlFor={`quantity-${product.id}`}>الكمية المطلوبة</label>
                <input
                  type="number"
                  id={`quantity-${product.id}`}
                  min="1"
                  value={product.requiredQuantity}
                  onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                  className="quantity-input"
                />
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="add-to-cart-btn"
              >
                إضافة إلى السلة
              </button>
            </div>
          ))}
        </div>
      )}
  
      {cart.length > 0 && (
        <button className="complete-order-btn" onClick={handleCompleteOrder}>
          إكمال الطلب
        </button>
      )}
      
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
  
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleOrderSubmit}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        cart={cart} 
        setCart={setCart}
      />
    </div>
  );
};

export default ProductCardList;
