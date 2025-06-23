import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Table, Toast, ToastContainer, Modal } from 'react-bootstrap';
import UserModal from './UserModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
function ManageUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal
    const [modalShow, setModalShow] = useState(false);
    const [modalMode, setModalMode] = useState('add'); //  'add' | 'edit' | 'delete'
    const [selectedUser, setSelectedUser] = useState(null);

    const handleAdd = () => {
        setModalMode('add');
        setSelectedUser(null);
        setModalShow(true);
    };
    const handleEdit = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setModalShow(true);
    };
    const handleDelete = (user) => {
        setModalMode('delete');
        setSelectedUser(user);
        setModalShow(true);
    };
    const handleCloseModal = () => {
        setModalShow(false);
        setSelectedUser(null);
    };

    const handleSaveUser = () => {
        setModalShow(false);
        setSelectedUser(null);
        fetchUsers(); // chỉ reload khi lưu thành công
    };

    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [confirmModal, setConfirmModal] = useState({ show: false, user: null });
    const [pendingAction, setPendingAction] = useState(null);

    const handleToggleEnabled = async (user) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/users/${user.id}/toggle-enabled`);
            fetchUsers();
            setToast({
                show: true,
                message: response.data.enabled ? 'Kích hoạt tài khoản thành công!' : 'Vô hiệu hóa tài khoản thành công!',
                variant: 'success',
            });
        } catch (err) {
            setToast({ show: true, message: 'Có lỗi xảy ra!', variant: 'danger' });
        }
    };

    const handleConfirmToggle = (user) => {
        setConfirmModal({ show: true, user });
    };
    const handleModalClose = () => {
        setConfirmModal({ show: false, user: null });
    };
    const handleModalConfirm = () => {
        if (confirmModal.user) {
            handleToggleEnabled(confirmModal.user);
        }
        setConfirmModal({ show: false, user: null });
    };

    // Đưa fetchUsers ra ngoài để có thể gọi lại ở nhiều nơi
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });

            setUsers(response.data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Phân trang client cho user
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Render users table
    return (
        <div className="container">
            <h1 className='text-center mb-5'>QUẢN LÝ NGƯỜI DÙNG</h1>
            <div className='d-flex justify-content-end my-3'>
                <Button className='my-3 d-flex align-items-center gap-2' onClick={handleAdd}>
                    <i className="bi bi-plus-circle"></i>
                    Thêm
                </Button>
            </div>

            <UserModal show={modalShow} onHide={handleCloseModal} mode={modalMode} user={selectedUser} onSave={handleSaveUser} />

            <Modal show={confirmModal.show} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {confirmModal.user && confirmModal.user.enabled ? (
                        <span>Bạn có chắc muốn <b>vô hiệu hóa</b> tài khoản này không?</span>
                    ) : (
                        <span>Bạn có chắc muốn <b>kích hoạt</b> tài khoản này không?</span>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Hủy</Button>
                    <Button variant="primary" onClick={handleModalConfirm}>Xác nhận</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={2000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            {Array.isArray(users) && users.length > 0 ? (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className='text-center'>ID</th>
                                <th className='text-center'>Email</th>
                                <th className='text-center'>Họ và tên</th>
                                <th className='text-center'>Địa chỉ</th>
                                <th className='text-center'>Số điện thoại</th>
                                <th className='text-center'>Trạng thái</th>
                                <th className='text-center'>Quyền admin</th>
                                <th className='text-center'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.address}</td>
                                    <td>{user.phone}</td>
                                    <td className='text-center'>
                                        <Button variant="link" className="p-0 border-0" onClick={() => handleConfirmToggle(user)}>
                                            {user.enabled ? (
                                                <>
                                                    <i className="bi bi-unlock-fill text-success fs-5"></i>
                                                    <span className="ms-1 text-success">Hoạt động</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-lock-fill text-danger fs-5"></i>
                                                    <span className="ms-1 text-danger">Đã khóa</span>
                                                </>
                                            )}
                                        </Button>
                                    </td>
                                    <td className='text-center'>{user.admin ? '✔️' : '❌'}</td>
                                    <td>
                                        <div className='d-flex gap-2 justify-content-center'>
                                            <Button variant='secondary' onClick={() => handleEdit(user)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </Button>
                                            <Button variant='danger' onClick={() => handleDelete(user)}>
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
                </>
            ) : (
                <p>Không có dữ liệu người dùng</p>
            )}
        </div>
    );
}

export default ManageUser;