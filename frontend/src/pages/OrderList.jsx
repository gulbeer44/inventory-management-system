import { useEffect, useState } from "react";
import api from "../services/api";

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Order History
      </h1>

      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-3">Order ID</th>
              <th className="text-left p-3">Customer ID</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3 break-all">
                  {order.id}
                </td>

                <td className="p-3 break-all">
                  {order.customer_id}
                </td>

                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {order.status}
                  </span>
                </td>

                <td className="p-3 font-semibold text-blue-600">
                  ₹{order.total_amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="text-center mt-4 text-gray-500">
            No Orders Found
          </p>
        )}
      </div>
    </div>
  );
}

export default OrderList;