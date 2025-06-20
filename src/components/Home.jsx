import axios from 'axios';
import React, {useEffect, useState} from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
      console.log("Xin chao");
      loadUsers();
    },[]);
    
    const loadUsers = async ()=> {
        try{
            const result = await axios.get(`${API_BASE_URL}/users`);
            console.log(result.data);
            setUsers(result.data);
        }
        catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }


    
  return (
    <div className="container py-4">
        <div
            className="table-responsive"
        >
            <table
                className="table table-bordered shadow"
            >
                <thead>
                    <tr>
                        {/* <th scope="col">STT</th> */}
                        <th scope="col">Mã</th>
                        <th scope="col">Email</th>
                        <th scope="col">Tên</th>
                        <th scope="col">SĐT</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">isAdmin</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) =>(
                            <tr key={index}>
                                {/* <td>{index + 1}</td> */}
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.fullName}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>{user.admin ? "✔️" : "❌"}</td>
                                <td>
                                    <button className="btn btn-outline-primary">Sửa</button>
                                    <button className='btn btn-danger ms-2'>Xóa</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
        
    </div>
  )
}
