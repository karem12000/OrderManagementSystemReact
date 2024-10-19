import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/loginComponents/Login';
import NotFound from './components/homeComponents/NotFound';
import AddProduct from './components/productComponents/AddProduct';
import ProductList from './components/productComponents/ProductList';
import EditProduct from './components/productComponents/EditProduct';
import ProductCardList from './components/productComponents/ProductCardList';
import OrdersList from './components/orderComponents/OrderList';
import Header from './components/headerComponents/Header';
import UserTable from './components/userComponents/UserList';
import AddCustomer from './components/customerComponents/AddCustomer';
import CustomerList from './components/customerComponents/CustomerList';
import { getToken } from './Utility/cookieUtils';
import { useEffect } from 'react';
import UnAutorized from './components/homeComponents/UnAuthorized';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    const isPublicRoute = location.pathname === '/ProductCardList' || location.pathname === '/orderList';

    if (!isPublicRoute && !token) {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  return (
    <div className="appContent">
      {location.pathname !== '/login' && <Header />}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/unauthorized" element={<UnAutorized />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/Products" element={<ProductList />} />
        <Route path="/EditProduct/:id" element={<EditProduct />} />
        <Route path="/ProductCardList" element={<ProductCardList />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/AddCustomer" element={<AddCustomer />} />
        <Route path="/users" element={<UserTable />} />
        <Route path="/orderList" element={<OrdersList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
