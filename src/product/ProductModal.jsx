import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'

function ProductModal({ show, onHide, mode, product, onSave }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryId: '',
        discount: '',
    });
    const [categories, setCategories] = useState([]);
    const [variants, setVariants] = useState([{ size: '', color: '', stock: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

    useEffect(() => {
        // fetch categories
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/categories`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Accept': 'application/json'
                    }
                });
                setCategories(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, [API_BASE_URL]);

    useEffect(() => {
        if (product && mode === 'edit') {
            setForm({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                imageUrl: product.imageUrl || '',
                categoryId: product.categoryId || '',
                discount: product.discount || '',
            });
            setVariants(product.variants && Array.isArray(product.variants) && product.variants.length > 0
                ? product.variants.map(v => ({
                    id: v.id, // giữ lại id nếu có
                    size: v.size || '',
                    color: v.color || '',
                    stock: v.stock || 0
                }))
                : [{ size: '', color: '', stock: '' }]);
        } else {
            setForm({
                name: '',
                description: '',
                price: '',
                imageUrl: '',
                categoryId: '',
                discount: '',
            });
            setVariants([{ size: '', color: '', stock: '' }]);
        }
    }, [product, mode, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (idx, e) => {
        const { name, value } = e.target;
        setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [name]: value } : v));
    };
    const handleAddVariant = () => {
        setVariants(prev => [...prev, { size: '', color: '', stock: '' }]);
    };
    const handleRemoveVariant = (idx) => {
        setVariants(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                discount: form.discount ? parseFloat(form.discount) : 0,
                categoryId: parseInt(form.categoryId),
                variants: variants.map(v => ({
                    ...(v.id ? { id: v.id } : {}),
                    size: v.size,
                    color: v.color,
                    stock: parseInt(v.stock) || 0
                })),
            };
            if (mode === 'add') {
                await axios.post(`${API_BASE_URL}/products`, payload);
            } else if (mode === 'edit' && product) {
                await axios.put(`${API_BASE_URL}/products/${product.id}`, payload);
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
            await axios.delete(`${API_BASE_URL}/products/${product.id}`);
            if (onSave) onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal scrollable size='lg' show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === 'add' && 'Thêm sản phẩm'}
                    {mode === 'edit' && 'Sửa sản phẩm'}
                    {mode === 'delete' && 'Xác nhận xóa sản phẩm'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {mode === 'delete' ? (
                    <div>
                        <p>Bạn có chắc chắn muốn xóa sản phẩm <b>{product?.name}</b>?</p>
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
                ) : mode === 'view' ? (
                    <div>
                        <div className="mb-2"><b>ID:</b> {product?.id}</div>
                        <div className="mb-2"><b>Tên sản phẩm:</b> {product?.name}</div>
                        <div className="mb-2"><b>Mô tả:</b> {product?.description}</div>
                        <div className="mb-2"><b>Giá:</b> {product?.price?.toLocaleString()} VND</div>
                        <div className="mb-2"><b>Giảm giá:</b> {product?.discount}%</div>
                        <div className="mb-2"><b>Hình ảnh:</b><br />
                            {product?.imageUrl && (
                                <img
                                    src={product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL.replace(/\/$/, '')}${product.imageUrl}`}
                                    alt={product?.name}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <div className="mb-2"><b>Danh mục:</b> {product?.category?.name}</div>
                        {Array.isArray(product?.variants) && (
                            <div className="mb-2">
                                <b>Biến thể:</b>
                                {product.variants.length > 0 && product.variants.some(v => v.size || v.color || v.stock) ? (
                                    <ul>
                                        {product.variants.filter(v => v.size || v.color || v.stock).map((v, idx) => (
                                            <li key={idx}>Size: {v.size}, Màu: {v.color}, Tồn kho: {v.stock}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>Không có</span>
                                )}
                            </div>
                        )}
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant='secondary' className='w-25' onClick={onHide}>Đóng</Button>
                        </div>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit} className="d-flex flex-column">
                        {mode === 'edit' && (
                            <Form.Group className="mb-3" controlId="formProductId">
                                <Form.Label>ID sản phẩm</Form.Label>
                                <Form.Control type="text" value={product?.id} disabled readOnly />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3" controlId="formProductName">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductDescription">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductPrice">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control type="number" step="1000" name="price" value={form.price} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductImageUrl">
                            <Form.Label>Ảnh sản phẩm</Form.Label>
                            <div className="mb-2">
                                {form.imageUrl && (
                                    <img
                                        src={form.imageUrl.startsWith('http') ? form.imageUrl : `${API_BASE_URL.replace(/\/$/, '')}${form.imageUrl}`}
                                        alt="preview"
                                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            <Form.Control type="file" accept="image/*" onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('file', file);
                                try {
                                    const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
                                        headers: {
                                            'ngrok-skip-browser-warning': 'true',
                                            'Content-Type': 'multipart/form-data',
                                        },
                                    });
                                    if (res.data && typeof res.data === 'string') {
                                        setForm(prev => ({ ...prev, imageUrl: res.data }));
                                    } else {
                                        setError('Upload ảnh thất bại!');
                                    }
                                } catch (err) {
                                    setError('Upload ảnh thất bại!');
                                }
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductCategory">
                            <Form.Label>Danh mục</Form.Label>
                            <Form.Select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                                <option value="">-- Chọn danh mục --</option>
                                {Array.isArray(categories) && categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductDiscount">
                            <Form.Label>Giảm giá (%)</Form.Label>
                            <Form.Control type="number" step="1" name="discount" value={form.discount} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductVariants">
                            <Form.Label>Biến thể sản phẩm</Form.Label>
                            <div>
                                {variants.map((variant, idx) => (
                                    <div key={idx} className="d-flex align-items-center mb-2 gap-2">
                                        <Form.Control
                                            type="text"
                                            name="size"
                                            placeholder="Size"
                                            value={variant.size}
                                            onChange={e => handleVariantChange(idx, e)}
                                            className="me-2"
                                        />
                                        <Form.Control
                                            type="text"
                                            name="color"
                                            placeholder="Màu"
                                            value={variant.color}
                                            onChange={e => handleVariantChange(idx, e)}
                                            className="me-2"
                                        />
                                        <Form.Control
                                            type="number"
                                            name="stock"
                                            placeholder="Tồn kho"
                                            value={variant.stock}
                                            onChange={e => handleVariantChange(idx, e)}
                                            className="me-2"
                                            min={0}
                                        />
                                        <Button variant="danger" size="sm" onClick={() => handleRemoveVariant(idx)} disabled={variants.length === 1}>-</Button>
                                    </div>
                                ))}
                                <Button variant="success" onClick={handleAddVariant}>+ Thêm biến thể</Button>
                            </div>
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
    )
}

export default ProductModal