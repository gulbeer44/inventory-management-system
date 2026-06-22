import { useEffect, useState } from "react";
import api from "../services/api";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsResponse = await api.get("/api/products");
      const customersResponse = await api.get("/api/customers");
      const ordersResponse = await api.get("/api/orders");

      setProductCount(productsResponse.data.length);
      setCustomerCount(customersResponse.data.length);

      const orders = ordersResponse.data;

      setOrderCount(orders.length);

      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.total_amount,
        0
      );

      setRevenue(totalRevenue);

      setRecentOrders(
        [...orders].reverse().slice(0, 5)
      );

      const analytics = [
        {
          name: "Products",
          count: productsResponse.data.length,
        },
        {
          name: "Customers",
          count: customersResponse.data.length,
        },
        {
          name: "Orders",
          count: orders.length,
        },
      ];

      setChartData(analytics);

    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-gray-500">
            Total Products
          </h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {productCount}
          </p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-gray-500">
            Total Customers
          </h2>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {customerCount}
          </p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-gray-500">
            Total Orders
          </h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            {orderCount}
          </p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-gray-500">
            Total Revenue
          </h2>
          <p className="text-4xl font-bold text-red-600 mt-2">
            ₹{revenue.toLocaleString()}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            System Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                {
                  name: "Revenue",
                  revenue,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="mt-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Recent Orders
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">
                Order ID
              </th>

              <th className="text-left p-2">
                Status
              </th>

              <th className="text-left p-2">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b"
              >
                <td className="p-2">
                  {order.id}
                </td>

                <td className="p-2">
                  {order.status}
                </td>

                <td className="p-2 font-semibold">
                  ₹{order.total_amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recentOrders.length === 0 && (
          <p className="mt-4 text-gray-500">
            No recent orders found
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;