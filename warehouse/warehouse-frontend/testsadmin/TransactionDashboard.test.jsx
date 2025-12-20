/** @vitest-environment jsdom */
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// 1. Mock window methods
window.confirm = vi.fn(() => true);
window.alert = vi.fn();

// 2. Mock window.location
Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000', hostname: 'localhost' },
  writable: true
});

import TransactionDashboard from "../src/features/admin/pages/transactions/TransactionDashboard";
import useFetchData from "../src/features/admin/services/useFetchData";
import * as adminService from "../src/features/admin/services/adminServices";

// 3. Mock Custom Hook & Services
vi.mock("../src/features/admin/services/useFetchData");
vi.mock("../src/features/admin/services/adminServices");

// 4. Mock Icons & Layout
vi.mock("react-icons/fi", () => ({
  FiShoppingCart: () => <span>CartIcon</span>,
  FiArrowUpRight: () => <span>UpIcon</span>,
  FiArrowDownLeft: () => <span>DownIcon</span>,
  FiDollarSign: () => <span>DollarIcon</span>,
  FiSearch: () => <span>SearchIcon</span>,
  FiEye: () => <span>EyeIcon</span>,
  FiLoader: () => <span>LoaderIcon</span>,
  FiTag: () => <span>TagIcon</span>,
  FiTrash2: () => <span>TrashIcon</span>,
  FiX: () => <span>XIcon</span>,
  FiUser: () => <span>UserIcon</span>,
  FiCalendar: () => <span>CalendarIcon</span>,
  FiPlus: () => <span>PlusIcon</span>,
}));

vi.mock("../src/features/admin/components/Sidebar", () => ({ default: () => <div data-testid="sidebar">Sidebar Mock</div> }));
vi.mock("../src/features/admin/components/Topbar", () => ({ default: () => <div data-testid="topbar">Topbar Mock</div> }));

describe("TransactionDashboard (Final Fix)", () => {
  const mockTransactions = [
    {
      id: 1,
      reference_number: "TXN-001",
      product_id: 101,
      performed_by: "Admin User",
      created_at: "2024-03-20T10:00:00Z",
      quantity: 50,
      total_amount: 5000000,
      transaction_type: "IN"
    }
  ];

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Trả về dữ liệu mặc định cho hook
    useFetchData.mockReturnValue({ loading: false, data: mockTransactions, reload: vi.fn() });
  });

  it("nên hiển thị danh sách giao dịch và KPI", async () => {
    render(<BrowserRouter><TransactionDashboard /></BrowserRouter>);
    expect(screen.getAllByText(/Quản lý giao dịch/i)[0]).toBeInTheDocument();
    expect(screen.getByText("TXN-001")).toBeInTheDocument();
  });

  it("nên mở modal tạo mới và có thể điền form", async () => {
    render(<BrowserRouter><TransactionDashboard /></BrowserRouter>);

    const createBtn = screen.getByText(/Tạo giao dịch/i);
    fireEvent.click(createBtn);

    // Kiểm tra modal hiện ra
    expect(screen.getAllByText(/Tạo giao dịch mới/i)[0]).toBeInTheDocument();

    /** * GIẢI PHÁP FIX LỖI LABEL:
     * Vì Label và Input không liên kết ID, ta tìm thẻ Label trước, 
     * sau đó tìm ô Input nằm ngay sau nó hoặc trong cùng thẻ cha.
     */
    const idLabel = screen.getByText(/ID Sản phẩm \*/i);
    const idInput = idLabel.parentElement.querySelector('input');
    
    fireEvent.change(idInput, { target: { value: "202" } });
    expect(idInput.value).toBe("202");

    // Điền thử trường Mã tham chiếu (tìm bằng placeholder)
    const refInput = screen.getByPlaceholderText(/ADM-TXN-.../i);
    fireEvent.change(refInput, { target: { value: "TEST-REF-123" } });
    expect(refInput.value).toBe("TEST-REF-123");
  });

  it("nên gọi hàm xóa khi người dùng xác nhận", async () => {
    const reloadMock = vi.fn();
    useFetchData.mockReturnValue({ loading: false, data: mockTransactions, reload: reloadMock });
    adminService.deleteTransaction.mockResolvedValue({});

    render(<BrowserRouter><TransactionDashboard /></BrowserRouter>);

    const deleteBtn = screen.getAllByTitle(/Xóa giao dịch/i)[0];
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(adminService.deleteTransaction).toHaveBeenCalledWith(1);
    });
  });

  it("nên lọc dữ liệu khi nhập vào ô tìm kiếm", async () => {
    render(<BrowserRouter><TransactionDashboard /></BrowserRouter>);
    const searchInput = screen.getByPlaceholderText(/Tìm theo mã giao dịch/i);
    
    fireEvent.change(searchInput, { target: { value: "KHONG-TON-TAI" } });
    expect(screen.getByText(/Không tìm thấy giao dịch nào/i)).toBeInTheDocument();
  });
});