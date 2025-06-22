import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Modal, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'cancel' | 'delete'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [orderDetail, setOrderDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPaid, setFilterPaid] = useState('');
    const [searchOrderId, setSearchOrderId] = useState('');

    const statusOptions = [
        { value: 'Đang xử lý', label: 'Đang xử lý' },
        { value: 'Đang giao', label: 'Đang giao' },
        { value: 'Đã giao', label: 'Đã giao' }
    ];
    // Các trạng thái không cho phép đổi trạng thái (ví dụ: đã bị hủy)
    const isStatusEditable = (status) => {
        return statusOptions.some(opt => opt.value === status);
    };

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/orders`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError('Không thể tải đơn hàng');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleView = async (order) => {
        setShowDetailModal(true);
        setOrderDetail(null);
        setDetailLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/orders/${order.id}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });
            setOrderDetail(res.data);
        } catch (err) {
            setOrderDetail(null);
        } finally {
            setDetailLoading(false);
        }
    };
    const openModal = (type, order) => {
        setModalType(type);
        setSelectedOrder(order);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
        setSelectedOrder(null);
    };
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setOrderDetail(null);
    };
    const handleCancel = async (order) => {
        openModal('cancel', order);
    };
    const handleDelete = async (order) => {
        openModal('delete', order);
    };
    const confirmAction = async () => {
        if (!selectedOrder) return;
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        try {
            if (modalType === 'cancel') {
                await axios.put(`${API_BASE_URL}/orders/${selectedOrder.id}/cancel`, {}, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Accept': 'application/json'
                    }
                });
                setActionSuccess('Hủy đơn thành công!');
                setToast({ show: true, message: 'Hủy đơn thành công!', variant: 'success' });
            } else if (modalType === 'delete') {
                await axios.delete(`${API_BASE_URL}/orders/${selectedOrder.id}`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Accept': 'application/json'
                    }
                });
                setActionSuccess('Xóa đơn thành công!');
                setToast({ show: true, message: 'Xóa đơn thành công!', variant: 'success' });
            }
            fetchOrders();
            closeModal();
        } catch (err) {
            setActionError(modalType === 'cancel' ? 'Hủy đơn thất bại!' : 'Xóa đơn thất bại!');
            setToast({ show: true, message: modalType === 'cancel' ? 'Hủy đơn thất bại!' : 'Xóa đơn thất bại!', variant: 'danger' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setActionLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/orders/${orderId}/update`, { status: newStatus }, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setToast({ show: true, message: 'Cập nhật trạng thái thành công!', variant: 'success' });
            // Luôn fetch lại toàn bộ đơn hàng để đồng bộ dữ liệu với backend
            fetchOrders();
        } catch (err) {
            setToast({ show: true, message: 'Cập nhật trạng thái thất bại!', variant: 'danger' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkPaid = async (order) => {
        if (!window.confirm(`Xác nhận đơn hàng #${order.id} đã thanh toán?`)) return;
        setPayLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/orders/${order.id}/mark-paid`, {}, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });
            setToast({ show: true, message: 'Đã xác nhận thanh toán!', variant: 'success' });
            fetchOrders();
        } catch (err) {
            setToast({ show: true, message: 'Xác nhận thanh toán thất bại!', variant: 'danger' });
        } finally {
            setPayLoading(false);
        }
    };

    // Lọc đơn hàng theo trạng thái, thanh toán và mã đơn
    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus ? order.status === filterStatus : true;
        const matchPaid = filterPaid === '' ? true : (filterPaid === 'paid' ? order.paid : !order.paid);
        const matchOrderId = searchOrderId ? order.id.toString().includes(searchOrderId.trim()) : true;
        return matchStatus && matchPaid && matchOrderId;
    });

    // Phân trang client
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset trang về 1 khi filter thay đổi
    useEffect(() => { setCurrentPage(1); }, [filterStatus, filterPaid, searchOrderId]);

    if (loading) return <div className="text-center my-4"><Spinner animation="border" /></div>;
    if (error) return <div className="text-danger text-center my-4">{error}</div>;

    return (
        <div>
            <h1 className='text-center mb-5'>QUẢN LÝ ĐƠN HÀNG</h1>

            <div className="mb-3 d-flex gap-3 align-items-end">
                <div>
                    <label className="form-label mb-0">Tìm theo mã đơn</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nhập mã đơn..."
                        value={searchOrderId}
                        onChange={e => setSearchOrderId(e.target.value)}
                    />
                </div>
                <div className="d-flex gap-3 ms-auto">
                    <div>
                        <label className="form-label mb-0">Lọc trạng thái đơn</label>
                        <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">Tất cả</option>
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                            {/* Thêm các trạng thái khác nếu có */}
                            {orders && Array.from(new Set(orders.map(o => o.status))).filter(s => !statusOptions.some(opt => opt.value === s)).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label mb-0">Lọc thanh toán</label>
                        <select className="form-select form-select-sm" value={filterPaid} onChange={e => setFilterPaid(e.target.value)}>
                            <option value="">Tất cả</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="unpaid">Chưa thanh toán</option>
                        </select>
                    </div>
                    <div className="align-self-end">
                        <Button size="sm" variant="outline-secondary" onClick={() => { setFilterStatus(''); setFilterPaid(''); setSearchOrderId(''); }}>
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Tên người nhận</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Thanh toán</th>
                        <th>Tổng tiền</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.recipient || 'Chưa có'}</td>
                            <td>{order.phone || 'Chưa có'}</td>
                            <td>{order.address}</td>
                            <td>
                                {isStatusEditable(order.status) ? (
                                    <select
                                        className="form-select form-select-sm"
                                        value={statusOptions.some(opt => opt.value === order.status) ? order.status : statusOptions[0].value}
                                        onChange={e => {
                                            if (order.status !== e.target.value) {
                                                handleStatusChange(order.id, e.target.value);
                                            }
                                        }}
                                        disabled={actionLoading}
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="badge bg-secondary">{order.status}</span>
                                )}
                            </td>
                            <td>
                                {order.paid ? (
                                    <span className="badge bg-success">Đã thanh toán</span>
                                ) : (
                                    <Button size="sm" variant="success" onClick={() => handleMarkPaid(order)} disabled={payLoading}>
                                        Xác nhận đã thanh toán
                                    </Button>
                                )}
                            </td>
                            <td>{order.total?.toLocaleString()}₫</td>
                            <td>
                                <Button size="sm" variant="info" className="me-2" onClick={() => handleView(order)}>Xem</Button>
                                <Button size="sm" variant="warning" className="me-2" onClick={() => handleCancel(order)}>Hủy đơn</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(order)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {actionLoading && <div className="text-center text-info">Đang xử lý...</div>}
            {actionError && <div className="text-center text-danger">{actionError}</div>}

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center my-3">
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i + 1} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'cancel' ? 'Xác nhận hủy đơn' : 'Xác nhận xóa đơn'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'cancel' && (
                        <>Bạn có chắc muốn <b>hủy</b> đơn hàng #{selectedOrder?.id}?</>
                    )}
                    {modalType === 'delete' && (
                        <>Bạn có chắc muốn <b>xóa</b> đơn hàng #{selectedOrder?.id}?</>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal} disabled={actionLoading}>Hủy</Button>
                    <Button variant={modalType === 'cancel' ? 'warning' : 'danger'} onClick={confirmAction} disabled={actionLoading}>
                        {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDetailModal} onHide={closeDetailModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng #{orderDetail?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailLoading ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : orderDetail ? (
                        <>
                            <div><b>Người nhận:</b> {orderDetail.recipient || 'Chưa có'} | <b>SĐT:</b> {orderDetail.phone || 'Chưa có'}</div>
                            <div><b>Địa chỉ:</b> {orderDetail.address}</div>
                            <div><b>Trạng thái:</b> {orderDetail.status}</div>
                            <div><b>Tổng tiền:</b> {orderDetail.total?.toLocaleString()}₫</div>
                            <hr />
                            <Table bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Mã SP</th>
                                        <th>Tên SP</th>
                                        <th>Ảnh</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Size</th>
                                        <th>Màu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetail.items?.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.productId}</td>
                                            <td>{item.name}</td>
                                            <td><img src={item.imageUrl} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover' }} /></td>
                                            <td>{item.price?.toLocaleString()}₫</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.size}</td>
                                            <td>{item.color}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <div className="text-danger">Không thể tải chi tiết đơn hàng.</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDetailModal}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={2000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default ManageOrder