import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:8080/login', { email, password });
            const user = res.data;
            if (user.admin) { // Sửa lại đúng trường backend trả về
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
            } else {
                setError('Chỉ tài khoản admin mới được đăng nhập!');
            }
        } catch (err) {
            setError('Sai email hoặc mật khẩu!');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow" style={{ minWidth: 320 }}>
                <h3 className="mb-3 text-center">Đăng nhập Admin</h3>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
            </form>
        </div>
    );
}

export default Login;
