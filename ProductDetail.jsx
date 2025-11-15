import { useEffect, useState } from 'react';
import { productAPI } from '../../services/api';

// Giả định component nhận product ID qua props hoặc URL
export default function ProductDetail({ productId, onProductUpdated, onProductDeleted }) {
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // --- Load Product Detail ---
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      setLoading(true);
      setError('');
      try {
        const res = await productAPI.getById(productId); // Gọi GET /products/{id}
        setProduct(res.data);
        setForm({ 
          name: res.data.name, 
          sku: res.data.sku, 
          description: res.data.description 
        });
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // --- Update Handlers ---
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await productAPI.update(productId, form); // Gọi PUT /products/{id}
      console.log("Update response:", res);
      
      setProduct(res.data);
      setIsEditing(false);
      alert("Product updated successfully!");
      if (onProductUpdated) onProductUpdated(res.data); // Notify parent component

    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update product"); // Xử lý lỗi FastAPI
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Handler ---
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    setError('');
    try {
      await productAPI.delete(productId); // Gọi DELETE /products/{id}
      alert("Product deleted successfully!");
      if (onProductDeleted) onProductDeleted(productId); // Notify parent component (e.g., redirect to list)

    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error && !product) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h3>Product: {product.name}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" disabled={loading} />
          <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" disabled={loading} />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" disabled={loading} />
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => setIsEditing(false)} disabled={loading}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Quantity:</strong> {product.quantity}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} disabled={loading}>Delete</button>
        </div>
      )}
    </div>
  );
}