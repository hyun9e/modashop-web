import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import './SidebarMenu.css'; // Thêm file css custom nếu cần

function SidebarMenu() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', position: 'fixed', left: 0, top: 0, width: 240, background: '#0d6efd', color: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 0' }}>
            <div>
                <Link to="/" className="text-decoration-none d-flex flex-column align-items-center justify-content-center mb-4 mt-2 gap-1" style={{ minHeight: 60 }}>
                    <span className="fw-bold fs-2" style={{ letterSpacing: 2 }}>
                        <span style={{ color: '#222' }}>MO</span><span style={{ color: '#fff' }}>DA</span>
                    </span>
                    <span className="fw-semibold" style={{ color: '#eee', fontSize: 14, letterSpacing: 1 }}>Dashboard</span>
                </Link>
                <ul className="nav nav-pills flex-column mt-4 gap-2">
                    <li className="nav-item">
                        <Link to='/' className='nav-link text-white fs-5 sidebar-link'>
                            <i className="bi bi-house me-2"></i>
                            <span className="d-none d-sm-inline">Home</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/users' className='nav-link text-white fs-5 sidebar-link'>
                            <i className="bi bi-person-vcard-fill me-2"></i>
                            <span className="d-none d-sm-inline">User</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/products' className='nav-link text-white fs-5 sidebar-link'>
                            <i className="bi bi-handbag me-2"></i>
                            <span className="d-none d-sm-inline">Product</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/categories' className='nav-link text-white fs-5 sidebar-link'>
                            <i className="bi bi-grid me-2"></i>
                            <span className="d-none d-sm-inline">Category</span>
                        </Link>
                    </li>
                    {/* <li className="nav-item">
                        <Link to='/carts' className='nav-link text-white fs-5 sidebar-link'>
                            <i className="bi bi-cart me-2"></i>
                            <span className="d-none d-sm-inline">Manage Cart</span>
                        </Link>
                    </li> */}
                    <li className="nav-item">
                        <Link to='/orders' className='nav-link text-white fs-5 sidebar-link'>
                            <i className="bi bi-receipt me-2"></i>
                            <span className="d-none d-sm-inline">Order</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/stats' className='nav-link text-white fs-5 sidebar-link'>
                            <i className="bi bi-reception-4 me-2"></i>
                            <span className="d-none d-sm-inline">Stats</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mb-3">
                <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="text-white p-3 sidebar-user" style={{ textDecoration: 'none' }}>
                        <i className="fs-4 bi bi-person"></i>
                        <span className="ms-2 fs-5">Admin</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleLogout}>
                            Đăng xuất
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default SidebarMenu