import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap';
import ProductModal from './ProductModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

function ManageProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal
    const [modalShow, setModalShow] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Phân trang client cho product (phải đặt ở đầu function, không đặt sau return)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAdd = () => {
        setModalMode('add');
        setSelectedProduct(null);
        setModalShow(true);
    };
    const handleEdit = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setModalShow(true);
    };
    const handleDelete = (product) => {
        setModalMode('delete');
        setSelectedProduct(product);
        setModalShow(true);
    };
    const handleView = (product) => {
        setModalMode('view');
        setSelectedProduct(product);
        setModalShow(true);
    };
    const handleCloseModal = () => {
        setModalShow(false);
        setSelectedProduct(null);
    };

    const handleSaveProduct = () => {
        setModalShow(false);
        setSelectedProduct(null);
        fetchProducts();
    };

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            });
            setProducts(response.data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Render products table
    return (
        <div className="container">
            <h1 className='text-center mb-5'>QUẢN LÝ SẢN PHẨM</h1>
            <div className="d-flex justify-content-end ">

                <Button className='my-3 d-flex align-items-center gap-2' onClick={handleAdd}>
                    <i className="bi bi-plus-circle"></i>
                    Thêm
                </Button>
                <ProductModal show={modalShow} onHide={handleCloseModal} mode={modalMode} product={selectedProduct} onSave={handleSaveProduct} />

            </div>

            {
                Array.isArray(products) && products.length > 0 ? (
                    <>
                        <table className="table table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th className='text-center'>ID</th>
                                    <th className='text-center'>Tên sản phẩm</th>
                                    <th className='text-center'>Mô tả</th>
                                    <th className='text-center'>Giá</th>
                                    <th className='text-center'>Giảm giá</th>
                                    <th className='text-center'>Hình ảnh</th>
                                    <th className='text-center'>Danh mục</th>
                                    <th className='text-center'>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.price.toLocaleString()} VND</td>
                                        <td>{product.discount}%</td>
                                        <td>
                                            <img
                                                src={product.imageUrl?.startsWith('http') ? product.imageUrl : `${API_BASE_URL.replace(/\/$/, '')}${product.imageUrl}`}
                                                alt={product.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{product.category?.name}</td>
                                        <td>
                                            <div className='d-flex gap-2 justify-content-center'>
                                                <Button variant='outline-primary' onClick={() => {
                                                    setModalMode('view');
                                                    setSelectedProduct(product);
                                                    setModalShow(true);
                                                }}>
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                                <Button variant='secondary' onClick={() => handleEdit(product)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </Button>
                                                <Button variant='danger' onClick={() => handleDelete(product)}>
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                    <p>Không có dữ liệu sản phẩm</p>
                )
            }
        </div >
    );
}

export default ManageProduct;