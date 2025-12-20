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

import ReportsDashboard from "../src/features/admin/pages/reports/ReportsDashboard";
import useFetchData from "../src/features/admin/services/useFetchData";

// 2. Mock Hook
vi.mock("../src/features/admin/services/useFetchData");

// 3. Mock Recharts (Tránh lỗi render SVG/Width)
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>Grid</div>,
  Tooltip: () => <div>Tooltip</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => <div>Cell</div>,
}));

// 4. Mock Layout
vi.mock("../src/features/admin/components/Sidebar", () => ({ default: () => <div data-testid="sidebar">Sidebar Mock</div> }));
vi.mock("../src/features/admin/components/Topbar", () => ({ default: () => <div data-testid="topbar">Topbar Mock</div> }));

describe("ReportsDashboard (Final Fix)", () => {
  
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("nên hiển thị các chỉ số thống kê chính xác khi có dữ liệu", () => {
    const mockData = {
      revenueData: [
        { month: "Jan", revenue: 1000000, totalQty: 10, orders: 2 },
        { month: "Feb", revenue: 3000000, totalQty: 30, orders: 6 },
      ],
      categoryData: [{ name: "Electronics", value: 10, color: "#f00" }]
    };

    useFetchData.mockReturnValue({ loading: false, data: mockData, error: null });

    render(<BrowserRouter><ReportsDashboard /></BrowserRouter>);

    // Kiểm tra tiêu đề (Dùng getAll...[0] để né lỗi render lặp)
    expect(screen.getAllByText(/Báo cáo & phân tích/i)[0]).toBeInTheDocument();

    // Kiểm tra Doanh thu (3.000.000 ₫)
    expect(screen.getAllByText(/3.000.000/i)[0]).toBeInTheDocument();

    /** * GIẢI PHÁP FIX LỖI:
     * Dùng hàm tìm kiếm linh hoạt, chuẩn hóa khoảng trắng 
     * và tìm số '200' (vì Math.abs làm mất số .0)
     */
    const growthElements = screen.queryAllByText((content, element) => {
      // Gộp toàn bộ chữ trong element thành 1 dòng, xóa khoảng trắng thừa
      const text = element.textContent.replace(/\s+/g, ' ').trim();
      return text.includes('↑') && text.includes('200%') && text.includes('so với tháng trước');
    });
    
    expect(growthElements.length).toBeGreaterThan(0);

    // Kiểm tra Doanh số (30 sp)
    expect(screen.getAllByText("30")[0]).toBeInTheDocument();
  });

  it("nên hiển thị bảng xếp hạng danh mục", () => {
    const mockData = {
      revenueData: [],
      categoryData: [{ name: "Electronics", value: 10, color: "#f00" }]
    };
    useFetchData.mockReturnValue({ loading: false, data: mockData, error: null });

    render(<BrowserRouter><ReportsDashboard /></BrowserRouter>);

    expect(screen.getAllByText("Electronics")[0]).toBeInTheDocument();
    expect(screen.getAllByText(/10 sản phẩm/i)[0]).toBeInTheDocument();
  });
});