import React from "react";

const cartData = [
    {
        id: 2,
        userId: 1,
        items: [
            {
                id: 3,
                productId: 1,
                name: "Áo thun trắng basic",
                imageUrl: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lx82v9ifjahlb1",
                price: 150000.0,
                size: "S",
                color: "Trắng",
                quantity: 2,
            },
        ],
    },
    {
        id: 1,
        userId: 2,
        items: [
            {
                id: 1,
                productId: 1,
                name: "Áo thun trắng basic",
                imageUrl: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lx82v9ifjahlb1",
                price: 150000.0,
                size: "M",
                color: "Trắng",
                quantity: 2,
            },
            {
                id: 2,
                productId: 1,
                name: "Áo thun trắng basic",
                imageUrl: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lx82v9ifjahlb1",
                price: 150000.0,
                size: "M",
                color: "Trắng",
                quantity: 4,
            },
        ],
    },
    {
        id: 3,
        userId: 3,
        items: [],
    },
];

const ManageCart = () => {
    return (
        <div>
            <h2>Quản lý giỏ hàng</h2>
            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID Giỏ</th>
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
                                {cart.items.length === 0 ? (
                                    <span>Không có sản phẩm</span>
                                ) : (
                                    <table border="1" cellPadding="4" style={{ width: "100%", margin: 0 }}>
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
                                                    <td>{item.price.toLocaleString()}₫</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageCart;
