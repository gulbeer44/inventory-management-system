import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">
        Inventory System
      </h2>

      <ul className="space-y-4">
        <li>
          <Link
            to="/"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/products"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Products
          </Link>
        </li>

        <li>
          <Link
            to="/customers"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Customers
          </Link>
        </li>

        <li>
          <Link
            to="/orders"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Create Order
          </Link>
        </li>

        <li>
          <Link
            to="/orders-list"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Order History
          </Link>
        </li>
      </ul>

      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;