import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    ordersToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Lấy tổng số sản phẩm
        const productRes = await axios.get('http://localhost:8080/products');
        // Lấy tổng số user không phải admin
        const userRes = await axios.get('http://localhost:8080/users');
        // Lấy đơn hàng hôm nay
        const orderRes = await axios.get('http://localhost:8080/orders');
        const today = new Date().toISOString().slice(0, 10);
        const ordersToday = orderRes.data.filter(o => o.orderDate && o.orderDate.startsWith(today)).length;
        setStats({
          products: productRes.data.length,
          users: userRes.data.filter(u => !u.admin).length,
          ordersToday,
        });
      } catch (err) {
        // Có thể xử lý lỗi ở đây nếu muốn
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-5">Chào mừng đến trang quản trị website thời trang MODA!</h2>
      <p className="mb-4">Tổng quan:</p>
      <div className="row g-4">
        <div className="col-md-4">
          <Link to="/products" className="text-decoration-none">
            <div className="card text-center shadow h-100 hover-shadow">
              <div className="card-body">
                <i className="bi bi-handbag fs-1 text-primary"></i>
                <h5 className="card-title mt-2">Tổng sản phẩm</h5>
                <p className="card-text fs-3 fw-bold">{stats.products}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/users" className="text-decoration-none">
            <div className="card text-center shadow h-100 hover-shadow">
              <div className="card-body">
                <i className="bi bi-people fs-1 text-success"></i>
                <h5 className="card-title mt-2">Tổng số người dùng</h5>
                <p className="card-text fs-3 fw-bold">{stats.users}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/orders" className="text-decoration-none">
            <div className="card text-center shadow h-100 hover-shadow">
              <div className="card-body">
                <i className="bi bi-receipt fs-1 text-danger"></i>
                <h5 className="card-title mt-2">Đơn hàng hôm nay</h5>
                <p className="card-text fs-3 fw-bold">{stats.ordersToday}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;