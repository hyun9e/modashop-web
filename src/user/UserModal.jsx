import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function UserModal({ show, onHide, mode, user, onSave }) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        address: '',
        phone: '',
        isAdmin: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

    useEffect(() => {
        if (user && mode === 'edit') {
            setForm({
                email: user.email || '',
                password: '',
                confirmPassword: '',
                fullName: user.fullName || '',
                address: user.address || '',
                phone: user.phone || '',
                isAdmin: user.isAdmin || false,
            });
        } else {
            setForm({
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                address: '',
                phone: '',
                isAdmin: false,
            });
        }
    }, [user, mode, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (mode === 'add') {
                await axios.post(`${API_BASE_URL}/users`, {
                    email: form.email,
                    password: form.password,
                    fullName: form.fullName,
                    address: form.address,
                    phone: form.phone,
                    enabled: true,
                    isAdmin: form.isAdmin,
                });
            } else if (mode === 'edit' && user) {
                const updateData = {
                    email: form.email,
                    fullName: form.fullName,
                    address: form.address,
                    phone: form.phone,
                    enabled: user.enabled,
                    isAdmin: form.isAdmin,
                };
                if (form.password) {
                    updateData.password = form.password;
                }
                await axios.put(`${API_BASE_URL}/users/${user.id}`, updateData);
            }
            if (onSave) onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_BASE_URL}/users/${user.id}`);
            if (onSave) onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    // Render modal based on mode
    return (
        <Modal size='lg' show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === 'add' && 'Thêm người dùng'}
                    {mode === 'edit' && 'Sửa người dùng'}
                    {mode === 'delete' && 'Xác nhận xóa người dùng'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {mode === 'delete' ? (
                    <div>
                        <p>Bạn có chắc chắn muốn xóa người dùng <b>{user?.email}</b>?</p>
                        {error && <div className="text-danger mb-2">{error}</div>}
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="danger" className='w-25' onClick={handleDelete} disabled={loading}>
                                {loading ? 'Đang xóa...' : 'Đồng ý'}
                            </Button>
                            <Button variant='secondary' className='w-25 ms-2' onClick={onHide} disabled={loading}>
                                Hủy
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit} className="d-flex flex-column">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email" name="email" value={form.email} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu" name="password" value={form.password} onChange={handleChange} required={mode === 'add'} />
                            {mode === 'edit' && <Form.Text className="text-muted">Để trống nếu không muốn đổi mật khẩu</Form.Text>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Xác nhận mật khẩu" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required={mode === 'add'} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicFullName">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control type="text" placeholder="Nhập họ tên" name="fullName" value={form.fullName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAddress">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control type="text" placeholder="Nhập địa chỉ" name="address" value={form.address} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control type="text" placeholder="Nhập số điện thoại" name="phone" value={form.phone} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAdmin">
                            <Form.Check type="checkbox" label="Cấp quyền Admin" name="isAdmin" checked={form.isAdmin} onChange={handleChange} />
                        </Form.Group>
                        {error && <div className="text-danger mb-2">{error}</div>}
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="primary" type="submit" disabled={loading} className='w-25'>
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                            <Button variant='secondary' className='w-25 ms-2' onClick={onHide} disabled={loading}>
                                Đóng
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal >
    );
}

export default UserModal;
