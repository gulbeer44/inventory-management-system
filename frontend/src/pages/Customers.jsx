import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    api
      .get("/api/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await api.put(
          `/api/customers/${editingId}`,
          formData
        );

        setCustomers(
          customers.map((customer) =>
            customer.id === editingId
              ? response.data
              : customer
          )
        );

        setEditingId(null);
      } else {
        const response = await api.post(
          "/api/customers",
          formData
        );

        setCustomers([
          ...customers,
          response.data,
        ]);
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

    } catch (error) {
      console.error(error);
      alert("Operation failed");
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/customers/${id}`);

      setCustomers(
        customers.filter(
          (customer) => customer.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Customers
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId
            ? "Update Customer"
            : "Add Customer"}
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Search by Name or Email..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                Name
              </th>

              <th className="p-2 text-left">
                Email
              </th>

              <th className="p-2 text-left">
                Phone
              </th>

              <th className="p-2 text-left">
                Address
              </th>

              <th className="p-2 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map(
              (customer) => (
                <tr
                  key={customer.id}
                  className="border-b"
                >
                  <td className="p-2">
                    {customer.name}
                  </td>

                  <td className="p-2">
                    {customer.email}
                  </td>

                  <td className="p-2">
                    {customer.phone}
                  </td>

                  <td className="p-2">
                    {customer.address}
                  </td>

                  <td className="p-2 space-x-2">
                    <button
                      onClick={() =>
                        handleEdit(customer)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          customer.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No Customers Found
          </p>
        )}
      </div>
    </div>
  );
}

export default Customers;