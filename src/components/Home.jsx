import axios from 'axios';
import React, {useEffect, useState} from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

export default function Home() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      loadUsers();
    },[]);
    
    const loadUsers = async ()=> {
        setLoading(true);
        try{
            const result = await axios.get(`${API_BASE_URL}/users`);
            console.log('Kết quả API:', result);
            console.log('Response data:', result.data);
            if (Array.isArray(result.data)) {
                setUsers(result.data);
            } else {
                setUsers([]);
                setError('API trả về không phải mảng! Dữ liệu thực tế: ' + JSON.stringify(result.data));
                console.error('API trả về không phải mảng:', result.data);
            }
        }
        catch (error) {
            setUsers([]);
            setError(error.message || "Lỗi khi gọi API");
            console.error("Lỗi khi gọi API:", error);
        }
        setLoading(false);
    }

    return (
      <div className="container py-4">
        {error && <div className="alert alert-danger">Lỗi: {error}</div>}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered shadow">
              <thead>
                <tr>
                  <th scope="col">Mã</th>
                  <th scope="col">Email</th>
                  <th scope="col">Tên</th>
                  <th scope="col">SĐT</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">isAdmin</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>{user.admin ? "✔️" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
}
