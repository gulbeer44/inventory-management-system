import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock_quantity: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/api/products")
      .then((res) => setProducts(res.data))
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
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
      };

      if (editingId) {
        const response = await api.put(
          `/api/products/${editingId}`,
          payload
        );

        setProducts(
          products.map((product) =>
            product.id === editingId
              ? response.data
              : product
          )
        );

        setEditingId(null);
      } else {
        const response = await api.post(
          "/api/products",
          payload
        );

        setProducts([...products, response.data]);
      }

      setFormData({
        name: "",
        sku: "",
        description: "",
        price: "",
        stock_quantity: "",
      });

    } catch (error) {
      console.error(error);
      alert("Operation failed");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      price: product.price,
      stock_quantity: product.stock_quantity,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await api.delete(`/api/products/${id}`);

      setProducts(
        products.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.sku
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Products
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="stock_quantity"
            placeholder="Stock Quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Search by Product Name or SKU..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">
                Name
              </th>
              <th className="text-left p-2">
                SKU
              </th>
              <th className="text-left p-2">
                Price
              </th>
              <th className="text-left p-2">
                Stock
              </th>
              <th className="text-left p-2">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map(
              (product) => (
                <tr
                  key={product.id}
                  className="border-b"
                >
                  <td className="p-2">
                    {product.name}
                  </td>

                  <td className="p-2">
                    {product.sku}
                  </td>

                  <td className="p-2">
                    ₹{product.price}
                  </td>

                  <td className="p-2">
                    {product.stock_quantity}
                  </td>

                  <td className="p-2 space-x-2">
                    <button
                      onClick={() =>
                        handleEdit(product)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          product.id
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

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No Products Found
          </p>
        )}
      </div>
    </div>
  );
}

export default Products;