import { useState } from 'react';
import { transactionAPI } from '../../services/api';

export default function TransactionForm() {
  const [qty,setQty]=useState('');
  const [productId, setProductId] = useState(''); // <-- BỔ SUNG
  const [type,setType]=useState('import');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation
    if (!qty || Number(qty) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    // <-- BỔ SUNG: Validation cho Product ID
    if (!productId || Number(productId) <= 0) {
      setError("Product ID must be a valid number");
      return;
    }

    setLoading(true);

    try {
      // 2. Cập nhật body: Thêm product_id theo yêu cầu API
      const body = { 
        quantity: Number(qty), 
        product_id: Number(productId) // <-- BỔ SUNG
      };

      console.log("Request body:", body); // Debug log

      const res = type === 'import'
        ? await transactionAPI.import(body)
        : await transactionAPI.export(body);

      console.log("API response:", res);

      alert("Transaction OK");

      // 3. Reset form
      setQty('');
      setProductId(''); // <-- BỔ SUNG reset
      setType('import');

    } catch (err) {
      // 4. Better FastAPI error handling
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
      <h3>Transaction</h3>

      {error && <p style={{color:'red'}}>{error}</p>}

      {/* BỔ SUNG: Input cho Product ID */}
      <input
        placeholder="Product ID (e.g., 1)"
        value={productId}
        onChange={e=>setProductId(e.target.value)}
        disabled={loading}
      />

      <input
        placeholder="Quantity"
        value={qty}
        onChange={e=>setQty(e.target.value)}
        disabled={loading}
      />

      <select
        value={type}
        onChange={e=>setType(e.target.value)}
        disabled={loading}
      >
        <option value="import">Import</option>
        <option value="export">Export</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
}