import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SidebarMenu from './layout/SidebarMenu';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import ManageUser from './user/ManageUser';
import ManageProduct from './product/ManageProduct';
import ManageOrder from './order/ManageOrder';
import ViewStat from './stats/ViewStat';
import ManageCategory from './category/ManageCategory';
import ManageCart from './order/ManageCart';
import Login from './components/Login';

function RequireAdmin({ children }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.admin) { // Sửa lại đúng trường backend trả về
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <RequireAdmin>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-2 p-0">
                    <SidebarMenu></SidebarMenu>
                  </div>
                  <div className="col-md-10 p-3">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/users" element={<ManageUser />} />
                      <Route path="/products" element={<ManageProduct />} />
                      <Route path="/carts" element={<ManageCart />} />
                      <Route path="/categories" element={<ManageCategory />} />
                      <Route path="/orders" element={<ManageOrder />} />
                      <Route path="/stats" element={<ViewStat />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

export default App