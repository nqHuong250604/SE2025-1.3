import { useState } from 'react';
import { productAPI } from '../../services/api';

export default function ProductForm() {
  const [form, setForm] = useState({ name:'', sku:'', description:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // 1. Validation
    if (!form.name.trim()) return setError("Product name is required");
    if (!form.sku.trim()) return setError("SKU is required");

    setLoading(true);

    try {

      // 2. Logging for real-time API documentation
      console.log("POST /products body:", form);

      const res = await productAPI.create(form);

      console.log("Response:", res);

      alert("Created: " + res.data.name);

      // 3. Reset form
      setForm({ name:'', sku:'', description:'' });

    } catch(err) {

      // 4. Parse FastAPI error
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Invalid input");
      } else {
        setError(detail || "Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Product</h3>
      {error && <p style={{color:'red'}}>{error}</p>}

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        disabled={loading}
      />

      <input
        name="sku"
        placeholder="SKU"
        value={form.sku}
        onChange={handleChange}
        disabled={loading}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Create'}
      </button>
    </form>
  );
}
