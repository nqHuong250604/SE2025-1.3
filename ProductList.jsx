import { useEffect, useState } from 'react';
import { productAPI } from '../../services/api';

export default function ProductList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');   // <-- added

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productAPI.getAll();

        // Debug log for real-time API documentation
        console.log("GET /products response:", res);

        setData(res.data);

      } catch (err) {

        // Better error handling
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail[0]?.msg || "Failed to load products");
        } else {
          setError(detail || "Failed to load products");
        }

      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Products</h3>

      {/* Error display */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {data.map(p => (
          <li key={p.id}>{p.name} - {p.sku}</li>
        ))}
      </ul>
    </div>
  );
}
