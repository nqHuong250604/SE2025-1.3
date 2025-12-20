/** @vitest-environment jsdom */
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// 1. Mock window.location
Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000', hostname: 'localhost' },
  writable: true
});

// 2. Import Component và Service (Đảm bảo đường dẫn đúng folder dashboard)
import Dashboard from "../src/features/admin/pages/dashboard/DashBoard";
import * as adminService from "../src/features/admin/services/adminServices";

// 3. Mock Service
vi.mock("../src/features/admin/services/adminServices");

// 4. Mock layout components (Dùng data-testid)
vi.mock("../src/features/admin/components/Sidebar", () => ({ default: () => <div data-testid="sidebar">Sidebar</div> }));
vi.mock("../src/features/admin/components/Topbar", () => ({ default: () => <div data-testid="topbar">Topbar</div> }));

// 5. Mock Lucide Icons
vi.mock("lucide-react", () => ({
  Package: () => <span>PackageIcon</span>,
  Users: () => <span>UsersIcon</span>,
  DollarSign: () => <span>DollarIcon</span>,
  PlusCircle: () => <span>PlusIcon</span>,
  Search: () => <span>SearchIcon</span>,
  UserPlus: () => <span>UserPlusIcon</span>,
  AlertTriangle: () => <span>AlertIcon</span>,
  CheckCircle: () => <span>CheckIcon</span>,
}));

describe("Admin Dashboard Component", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Giá trị mặc định cho các mock
    adminService.getDashboardKPIs.mockResolvedValue({});
    adminService.getAllTransactions.mockResolvedValue([]);
    adminService.getRecentTransactions.mockResolvedValue([]);
  });

  it("nên hiển thị dữ liệu KPIs và giao dịch khi API thành công", async () => {
    adminService.getDashboardKPIs.mockResolvedValue({
      active_deliveries: 15,
      total_customers: 120,
      revenue: 15000000
    });
    adminService.getAllTransactions.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]);
    adminService.getRecentTransactions.mockResolvedValue([{
      id: "TX99", performed_by: "Nguyễn Văn A", notes: "Xuất kho linh kiện", transaction_type: "OUT"
    }]);

    render(<BrowserRouter><Dashboard /></BrowserRouter>);

    await waitFor(() => {
      // SỬA LỖI MULTIPLE: Dùng queryAllBy và kiểm tra length > 0
      expect(screen.queryAllByText(/Trang chủ/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText("5").length).toBeGreaterThan(0);
      expect(screen.queryAllByText("120").length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/15,000,000 ₫/i).length).toBeGreaterThan(0);
      
      // Kiểm tra giao dịch
      expect(screen.queryAllByText(/#TX99/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/Nguyễn Văn A/i).length).toBeGreaterThan(0);
    });
  });

  it("nên render đúng cấu trúc Sidebar và Topbar", async () => {
    render(<BrowserRouter><Dashboard /></BrowserRouter>);

    await waitFor(() => {
      // SỬA LỖI MULTIPLE: Dùng getAllByTestId thay vì getByTestId
      const sidebars = screen.getAllByTestId("sidebar");
      const topbars = screen.getAllByTestId("topbar");
      
      expect(sidebars.length).toBeGreaterThan(0);
      expect(topbars.length).toBeGreaterThan(0);
    });
  });
});