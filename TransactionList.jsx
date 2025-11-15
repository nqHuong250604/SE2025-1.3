import { useEffect, useState } from 'react';
import { transactionAPI } from '../../services/api';

export default function TransactionList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await transactionAPI.getAll(); // Gọi GET /transactions/

        // Debug log for real-time API documentation
        console.log("GET /transactions response:", res);

        setData(res.data);

      } catch (err) {

        // Better error handling
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail[0]?.msg || "Failed to load transactions");
        } else {
          setError(detail || "Failed to load transactions");
        }

      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h3>Transaction History</h3>

      {/* Error display */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.product_id}</td>
                <td style={{ color: t.type === 'import' ? 'green' : 'orange' }}>{t.type}</td>
                <td>{t.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}