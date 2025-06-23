import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const ManageCart = () => {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API_BASE_URL}/orders`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Accept': 'application/json',
                    },
                });
                setCartData(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setError('Không thể tải dữ liệu giỏ hàng!');
                setCartData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Quản lý giỏ hàng</h2>
            {loading ? (
                <div>Đang tải dữ liệu...</div>
            ) : error ? (
                <div className="text-danger">{error}</div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID Đơn</th>
                            <th>ID User</th>
                            <th>Sản phẩm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartData.map((cart) => (
                            <tr key={cart.id}>
                                <td>{cart.id}</td>
                                <td>{cart.userId}</td>
                                <td>
                                    {!cart.items || cart.items.length === 0 ? (
                                        <span>Không có sản phẩm</span>
                                    ) : (
                                        <Table size="sm" bordered>
                                            <thead>
                                                <tr>
                                                    <th>Ảnh</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Size</th>
                                                    <th>Màu</th>
                                                    <th>Số lượng</th>
                                                    <th>Giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <img src={item.imageUrl} alt={item.name} style={{ width: 50, height: 50, objectFit: "cover" }} />
                                                        </td>
                                                        <td>{item.name}</td>
                                                        <td>{item.size}</td>
                                                        <td>{item.color}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.price?.toLocaleString()}₫</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ManageCart;
