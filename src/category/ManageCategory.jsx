import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Toast, ToastContainer, Image } from 'react-bootstrap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
function ManageCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'delete'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [form, setForm] = useState({ name: '', imageUrl: '' });
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });


    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/categories`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });
            console.log('categories response:', res.data);
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError('Không thể tải danh mục');
            setCategories([]);
            console.error('categories error:', err);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchCategories();
        console.log('API_BASE_URL:', API_BASE_URL);

    }, []);

    const handleAdd = () => {
        setModalMode('add');
        setForm({ name: '', imageUrl: '' });
        setSelectedCategory(null);
        setModalShow(true);
    };
    const handleEdit = (cat) => {
        setModalMode('edit');
        setForm({ name: cat.name, imageUrl: cat.imageUrl });
        setSelectedCategory(cat);
        setModalShow(true);
    };
    const handleDelete = (cat) => {
        setModalMode('delete');
        setSelectedCategory(cat);
        setModalShow(true);
    };
    const handleCloseModal = () => {
        setModalShow(false);
        setSelectedCategory(null);
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSave = async () => {
        try {
            if (modalMode === 'add') {
                await axios.post(`${API_BASE_URL}/categories`, form);
                setToast({ show: true, message: 'Thêm danh mục thành công!', variant: 'success' });
            } else if (modalMode === 'edit' && selectedCategory) {
                await axios.put(`${API_BASE_URL}/categories/${selectedCategory.id}`, form);
                setToast({ show: true, message: 'Cập nhật danh mục thành công!', variant: 'success' });
            }
            fetchCategories();
            setModalShow(false);
        } catch (err) {
            setToast({ show: true, message: 'Có lỗi xảy ra!', variant: 'danger' });
        }
    };
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/categories/${selectedCategory.id}`);
            setToast({ show: true, message: 'Xóa danh mục thành công!', variant: 'success' });
            fetchCategories();
            setModalShow(false);
        } catch (err) {
            setToast({ show: true, message: 'Có lỗi xảy ra!', variant: 'danger' });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <h1 className="text-center mb-5">QUẢN LÝ DANH MỤC</h1>
            <Button variant="outline-success" className="my-3" onClick={handleAdd}>Thêm</Button>
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={2000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center">Tên danh mục</th>
                        <th className="text-center">Ảnh</th>
                        <th className="text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(categories) && categories.map(cat => (
                        <tr key={cat.id}>
                            <td className="text-center">{cat.id}</td>
                            <td>{cat.name}</td>
                            <td className="text-center">
                                <Image src={cat.imageUrl} alt={cat.name} style={{ width: 60, height: 60, objectFit: 'contain', background: '#fff' }} rounded />
                            </td>
                            <td className="text-center">
                                <Button variant="secondary" className="me-2" onClick={() => handleEdit(cat)}>
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(cat)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={modalShow} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' && 'Thêm danh mục'}
                        {modalMode === 'edit' && 'Cập nhật danh mục'}
                        {modalMode === 'delete' && 'Xóa danh mục'}
                    </Modal.Title>
                </Modal.Header>
                {modalMode !== 'delete' ? (
                    <Form>
                        <Modal.Body>
                            {modalMode === 'edit' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control value={selectedCategory?.id || ''} disabled readOnly />
                                </Form.Group>
                            )}
                            <Form.Group className="mb-3">
                                <Form.Label>Tên danh mục</Form.Label>
                                <Form.Control name="name" value={form.name} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ảnh (URL)</Form.Label>
                                <Form.Control name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
                            <Button variant="primary" onClick={handleSave}>Lưu</Button>
                        </Modal.Footer>
                    </Form>
                ) : (
                    <>
                        <Modal.Body>Bạn có chắc muốn xóa danh mục <b>{selectedCategory?.name}</b>?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
                            <Button variant="danger" onClick={handleConfirmDelete}>Xóa</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default ManageCategory;