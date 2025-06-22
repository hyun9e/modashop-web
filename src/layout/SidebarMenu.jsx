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
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="bg-primary col-auto min-vh-100 w-100 justify-content-between d-flex flex-column p-3 text-white sidebar-custom">
                        <div>
                            <Link to="/" className="text-decoration-none text-white d-flex align-items-center ms-3 mt-2">
                                <span className="ms-1 fs-1 fw-bold">MODA</span>
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
                        <div>
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
                </div>
            </div>
        </>

    )
}

export default SidebarMenu