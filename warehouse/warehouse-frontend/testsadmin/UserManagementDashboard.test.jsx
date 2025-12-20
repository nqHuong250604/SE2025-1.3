/** @vitest-environment jsdom */
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// 1. Mock window.location
Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000', hostname: 'localhost' },
  writable: true
});

// 2. Import Component
import UserManagementDashboard from "../src/features/admin/pages/management/UserManagementDashboard";

// 3. Mock layout components
vi.mock("../src/features/admin/components/Sidebar", () => ({ 
  default: () => <div data-testid="sidebar">Sidebar Mock</div> 
}));
vi.mock("../src/features/admin/components/Topbar", () => ({ 
  default: () => <div data-testid="topbar">Topbar Mock</div> 
}));

// 4. Mock Lucide Icons toàn diện
vi.mock("lucide-react", () => ({
  Search: () => <span>SearchIcon</span>,
  Edit2: () => <span>EditIcon</span>,
  Trash2: () => <span>TrashIcon</span>,
  Users: () => <span>UsersIcon</span>,
  CheckCircle: () => <span>CheckIcon</span>,
  DollarSign: () => <span>DollarIcon</span>,
  AlertTriangle: () => <span>AlertIcon</span>,
  Home: () => <span>HomeIcon</span>,
  BarChart: () => <span>ChartIcon</span>,
  ShoppingCart: () => <span>CartIcon</span>,
  Package: () => <span>PackageIcon</span>,
  LogOut: () => <span>LogoutIcon</span>,
}));

describe("UserManagementDashboard (Quản lý người dùng)", () => {
  
  beforeEach(() => {
    cleanup(); // Dọn dẹp DOM trước mỗi lần test
    vi.clearAllMocks();
  });

  it("nên hiển thị tiêu đề và cấu trúc trang", () => {
    render(
      <BrowserRouter>
        <UserManagementDashboard />
      </BrowserRouter>
    );

    // Dùng getAllBy và chọn cái đầu tiên [0] để tránh lỗi multiple
    const titles = screen.getAllByText(/Quản lý người dùng/i);
    expect(titles[0]).toBeInTheDocument();
    
    expect(screen.getAllByTestId("sidebar")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("topbar")[0]).toBeInTheDocument();
  });

  it("nên hiển thị danh sách người dùng mẫu trong bảng", () => {
    render(
      <BrowserRouter>
        <UserManagementDashboard />
      </BrowserRouter>
    );

    // Kiểm tra John Smith (lấy bản ghi đầu tiên tìm thấy)
    const userNames = screen.getAllByText("John Smith");
    expect(userNames[0]).toBeInTheDocument();

    const emails = screen.getAllByText("john.smith@logitrack.com");
    expect(emails[0]).toBeInTheDocument();
    
    // Kiểm tra vai trò
    const roles = screen.getAllByText("Quản trị viên");
    expect(roles[0]).toBeInTheDocument();
  });

  it("nên hiển thị các thẻ thống kê", () => {
    render(
      <BrowserRouter>
        <UserManagementDashboard />
      </BrowserRouter>
    );

    // Kiểm tra nhãn thống kê
    const statLabels = screen.getAllByText("Tổng người dùng");
    expect(statLabels[0]).toBeInTheDocument();

    const statValues = screen.getAllByText("24");
    expect(statValues[0]).toBeInTheDocument();
  });

  it("nên hiển thị các thẻ quyền hạn ở dưới trang", () => {
    render(
      <BrowserRouter>
        <UserManagementDashboard />
      </BrowserRouter>
    );

    const permissionHeaders = screen.getAllByText("Quyền hạn theo vai trò");
    expect(permissionHeaders[0]).toBeInTheDocument();

    const permissionTexts = screen.getAllByText("Toàn quyền hệ thống");
    expect(permissionTexts[0]).toBeInTheDocument();
  });
});