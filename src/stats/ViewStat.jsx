import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function ViewStat() {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const headers = {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json'
        };
        const [overviewRes, revenueRes, topProductsRes, orderStatusRes, revenueByCatRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/stats/overview`, { headers }),
          axios.get(`${API_BASE_URL}/stats/revenue`, { params: { from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10) }, headers }),
          axios.get(`${API_BASE_URL}/stats/top-products?limit=5`, { headers }),
          axios.get(`${API_BASE_URL}/stats/order-status`, { headers }),
          axios.get(`${API_BASE_URL}/stats/revenue-by-category`, { headers })
        ]);
        setOverview(overviewRes.data);
        setRevenue(revenueRes.data);
        setTopProducts(topProductsRes.data);
        setOrderStatus(Object.entries(orderStatusRes.data).map(([name, value]) => ({ name, value })));
        setRevenueByCategory(revenueByCatRes.data);
      } catch (e) {
        setOverview(null);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Đảm bảo dữ liệu là array để tránh lỗi .map
  const safeRevenue = Array.isArray(revenue) ? revenue : [];
  const safeTopProducts = Array.isArray(topProducts) ? topProducts : [];
  const safeOrderStatus = Array.isArray(orderStatus) ? orderStatus : [];
  const safeRevenueByCategory = Array.isArray(revenueByCategory) ? revenueByCategory : [];

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (!overview) return <div className="text-danger text-center my-5">Không thể tải dữ liệu thống kê.</div>;

  return (
    <div>
      <h2 className="mb-4">Thống kê tổng quan</h2>
      <Row className="mb-4 g-3">
        <Col md={3}><Card body className="text-center"><div>Doanh thu</div><h4>{Number(overview.totalRevenue).toLocaleString()}₫</h4></Card></Col>
        <Col md={3}><Card body className="text-center"><div>Tổng đơn</div><h4>{overview.totalOrders}</h4></Card></Col>
        <Col md={3}><Card body className="text-center"><div>Khách hàng</div><h4>{overview.totalCustomers}</h4></Card></Col>
        <Col md={3}><Card body className="text-center"><div>Sản phẩm đã bán</div><h4>{overview.totalProductsSold}</h4></Card></Col>
      </Row>
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card body>
            <h5>Doanh thu 7 ngày gần nhất</h5>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={safeRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={6}>
          <Card body>
            <h5>Top 5 sản phẩm bán chạy</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={safeTopProducts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="productName" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="quantitySold" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card body>
            <h5>Tỷ lệ trạng thái đơn hàng</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={safeOrderStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {safeOrderStatus.map((entry, idx) => (
                    <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={6}>
          <Card body>
            <h5>Doanh thu theo danh mục</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={safeRevenueByCategory} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ViewStat;