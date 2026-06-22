import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const customerRes = await api.get("/api/customers");
      const productRes = await api.get("/api/products");

      setCustomers(customerRes.data);
      setProducts(productRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const selectedProduct = products.find(
    (product) => product.id === productId
  );

  const totalAmount = selectedProduct
    ? selectedProduct.price * quantity
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/orders", {
        customer_id: customerId,
        items: [
          {
            product_id: productId,
            quantity: Number(quantity),
          },
        ],
      });

      alert("Order Created Successfully");

      setCustomerId("");
      setProductId("");
      setQuantity(1);
    } catch (error) {
      console.error(error);
      alert("Failed to create order");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Order</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer</label>
          <br />
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Product</label>
          <br />
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (₹{product.price})
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Quantity</label>
          <br />
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        <br />

        <div>
          <strong>Total Amount: ₹{totalAmount}</strong>
        </div>

        <br />

        <button type="submit">
          Create Order
        </button>
      </form>
    </div>
  );
}

export default Orders;