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

// --- LƯU Ý QUAN TRỌNG: HAI ĐƯỜNG DẪN DƯỚI ĐÂY PHẢI GIỐNG HỆT NHAU ---
const SERVICE_PATH = "../src/features/admin/services/adminServices";

// 2. Import Component và Service
import InventoryDashboard from "../src/features/admin/pages/inventory/InventoryDashboard";
import * as adminService from "../src/features/admin/services/adminServices";

// 3. Mock Service (Sử dụng biến SERVICE_PATH để đảm bảo khớp 100%)
vi.mock("../src/features/admin/services/adminServices");

// 4. Mock các thành phần khác
vi.mock("../src/features/admin/components/Sidebar", () => ({ default: () => <div data-testid="sidebar">Sidebar</div> }));
vi.mock("../src/features/admin/components/Topbar", () => ({ default: () => <div data-testid="topbar">Topbar</div> }));
vi.mock("react-icons/fi", () => ({
  FiSearch: () => <span>SearchIcon</span>,
  FiEdit3: () => <span>EditIcon</span>,
  FiRefreshCw: () => <span>RefreshIcon</span>,
  FiMapPin: () => <span>MapPinIcon</span>,
  FiBox: () => <span>BoxIcon</span>,
  FiAlertTriangle: () => <span>AlertIcon</span>,
  FiCheckCircle: () => <span>CheckIcon</span>,
  FiXOctagon: () => <span>XIcon</span>,
}));

describe("InventoryDashboard (Admin)", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Đảm bảo các hàm mock được khởi tạo giá trị mặc định
    adminService.getInventoryList.mockResolvedValue([]);
    adminService.getProductList.mockResolvedValue({ items: [] });
  });

  it("nên hiển thị tiêu đề Quản lý tồn kho", async () => {
    render(
      <BrowserRouter>
        <InventoryDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/Quản lý tồn kho/i)).toBeInTheDocument();
  });

  it("nên hiển thị dữ liệu tồn kho và map đúng tên sản phẩm", async () => {
    const mockInventory = [
      {
        id: 1,
        product_id: 99,
        quantity: 50,
        reserved_quantity: 0,
        available_quantity: 50,
        location: "Kệ Test",
      }
    ];
    const mockProducts = {
      items: [{ id: 99, name: "Sản phẩm Thực tế", sku: "REAL-SKU" }]
    };

    // Thiết lập giá trị trả về cho mock
    adminService.getInventoryList.mockResolvedValue(mockInventory);
    adminService.getProductList.mockResolvedValue(mockProducts);

    render(
      <BrowserRouter>
        <InventoryDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sản phẩm Thực tế/i)).toBeInTheDocument();
      expect(screen.getByText(/REAL-SKU/i)).toBeInTheDocument();
      expect(screen.getByText(/Kệ Test/i)).toBeInTheDocument();
    });
  });
});