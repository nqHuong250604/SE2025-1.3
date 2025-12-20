/** @vitest-environment jsdom */
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// 1. Mock window.location
Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000', hostname: 'localhost' },
  writable: true
});

// 2. Import Component và Service
import NotificationDashboard from "../src/features/admin/pages/notifications/NotificationDashboard";
import * as adminService from "../src/features/admin/services/adminServices";

// 3. Mock Service
vi.mock("../src/features/admin/services/adminServices");

// 4. Mock Layout (Dùng data-testid và đường dẫn chính xác)
vi.mock("../src/features/admin/components/Sidebar", () => ({ default: () => <div data-testid="sidebar">Sidebar Mock</div> }));
vi.mock("../src/features/admin/components/Topbar", () => ({ default: () => <div data-testid="topbar">Topbar Mock</div> }));

// 5. Mock Icons
vi.mock("react-icons/fi", () => ({
  FiAlertTriangle: () => <span>AlertIcon</span>,
  FiPackage: () => <span>PackageIcon</span>,
  FiRefreshCw: () => <span>RefreshIcon</span>,
  FiTrash2: () => <span>TrashIcon</span>,
  FiCheck: () => <span>CheckIcon</span>,
  FiBell: () => <span>BellIcon</span>,
  FiClock: () => <span>ClockIcon</span>,
}));

describe("NotificationDashboard (Final Fix)", () => {
  const mockNotifications = [
    {
      id: "low-stock-1",
      title: "Tồn kho thấp",
      message: "Sản phẩm A còn 5 item",
      priority: "high",
      type: "low_stock",
      unread: true,
    }
  ];

  beforeEach(() => {
    cleanup(); // Dọn dẹp DOM cũ
    vi.clearAllMocks();
    // Giả lập localStorage
    const store = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k) => store[k] || null,
        setItem: (k, v) => { store[k] = v; },
      },
      writable: true
    });
  });

  it("nên hiển thị tiêu đề và danh sách thông báo", async () => {
    adminService.getSystemNotifications.mockResolvedValue(mockNotifications);
    render(<BrowserRouter><NotificationDashboard /></BrowserRouter>);

    await waitFor(() => {
      // Dùng getAllBy để chấp nhận việc có nhiều phần tử lặp
      const titles = screen.getAllByText(/Thông báo/i);
      expect(titles[0]).toBeInTheDocument();
      
      const contents = screen.getAllByText(/Sản phẩm A còn 5 item/i);
      expect(contents[0]).toBeInTheDocument();
    });
  });

  it("nên có thể nhấn nút đánh dấu đã đọc", async () => {
    adminService.getSystemNotifications.mockResolvedValue(mockNotifications);
    render(<BrowserRouter><NotificationDashboard /></BrowserRouter>);

    // Đợi item hiện ra
    await waitFor(() => expect(screen.getAllByText(/Tồn kho thấp/i)[0]).toBeInTheDocument());

    // Tìm tất cả các nút có title này và nhấn cái đầu tiên
    const markBtns = screen.getAllByTitle(/Đánh dấu đã đọc/i);
    fireEvent.click(markBtns[0]);

    // Kiểm tra xem nút đó có biến mất không (logic unread: false)
    await waitFor(() => {
      const remainingBtns = screen.queryAllByTitle(/Đánh dấu đã đọc/i);
      expect(remainingBtns.length).toBeLessThan(markBtns.length);
    });
  });

  it("nên có thể nhấn nút xóa", async () => {
    adminService.getSystemNotifications.mockResolvedValue(mockNotifications);
    render(<BrowserRouter><NotificationDashboard /></BrowserRouter>);

    await waitFor(() => expect(screen.getAllByText(/Tồn kho thấp/i)[0]).toBeInTheDocument());

    const deleteBtns = screen.getAllByTitle(/Xóa/i);
    fireEvent.click(deleteBtns[0]);

    // Xác nhận thông báo biến mất
    await waitFor(() => {
      expect(screen.queryByText(/Sản phẩm A còn 5 item/i)).not.toBeInTheDocument();
    });
  });
});