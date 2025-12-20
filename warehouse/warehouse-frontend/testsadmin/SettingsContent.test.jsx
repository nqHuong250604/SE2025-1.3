/** @vitest-environment jsdom */
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// 1. Mock window.location
Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000', hostname: 'localhost' },
  writable: true
});

// 2. Import Component (Đường dẫn chính xác theo file bạn gửi)
import SettingsContent from "../src/features/admin/pages/settings/SettingContend";

// 3. Mock Lucide Icons
vi.mock("lucide-react", () => ({
  ChevronDown: () => <span data-testid="chevron-down">Icon</span>,
  Search: () => <span>SearchIcon</span>,
  Edit2: () => <span>EditIcon</span>,
  Trash2: () => <span>TrashIcon</span>,
  Users: () => <span>UsersIcon</span>,
  CheckCircle: () => <span>CheckIcon</span>,
  DollarSign: () => <span>DollarIcon</span>,
  AlertTriangle: () => <span>AlertIcon</span>,
}));

describe("SettingsContent Component (Admin Settings)", () => {
  
  beforeEach(() => {
    cleanup(); // Dọn dẹp DOM cũ để tránh lỗi Multiple Elements
    vi.clearAllMocks();
  });

  it("nên hiển thị tiêu đề trang Cài đặt", () => {
    render(
      <BrowserRouter>
        <SettingsContent />
      </BrowserRouter>
    );

    // Sử dụng getAllBy...[0] để an toàn tuyệt đối
    const titles = screen.getAllByText(/Cài đặt/i);
    expect(titles[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Cấu hình hệ thống và thiết lập tài khoản/i)[0]).toBeInTheDocument();
  });

  it("nên hiển thị thông tin công ty mặc định trong tab Chung", () => {
    render(<BrowserRouter><SettingsContent /></BrowserRouter>);

    // Kiểm tra các giá trị mặc định (defaultValue)
    expect(screen.getByDisplayValue("LogiTrack Solutions")).toBeInTheDocument();
    expect(screen.getByDisplayValue("admin@logitrack.com")).toBeInTheDocument();
  });

  it("nên chuyển sang tab Bảo mật khi người dùng click", () => {
    render(<BrowserRouter><SettingsContent /></BrowserRouter>);

    // Tìm nút tab Bảo mật và click
    const securityTab = screen.getByRole("button", { name: /Bảo mật/i });
    fireEvent.click(securityTab);

    // Kiểm tra nội dung của tab Bảo mật hiện ra
    expect(screen.getByText("Cài đặt bảo mật")).toBeInTheDocument();
    expect(screen.getByText("Xác thực hai lớp (2FA)")).toBeInTheDocument();
    expect(screen.getByText("Mật khẩu hiện tại")).toBeInTheDocument();
  });

  it("nên chuyển sang tab Tích hợp và hiển thị trạng thái API", () => {
    render(<BrowserRouter><SettingsContent /></BrowserRouter>);

    const integrationTab = screen.getByRole("button", { name: /Tích hợp/i });
    fireEvent.click(integrationTab);

    // Kiểm tra danh sách API
    expect(screen.getByText("API vận chuyển")).toBeInTheDocument();
    expect(screen.getByText("Đã kết nối")).toBeInTheDocument();
    expect(screen.getAllByText("Kết nối").length).toBeGreaterThan(0);
  });

  it("nên hiển thị tab Giao diện với các tùy chọn ngôn ngữ", () => {
    render(<BrowserRouter><SettingsContent /></BrowserRouter>);

    const appearanceTab = screen.getByRole("button", { name: /Giao diện/i });
    fireEvent.click(appearanceTab);

    expect(screen.getByText("Cài đặt giao diện")).toBeInTheDocument();
    expect(screen.getByText("Chủ đề")).toBeInTheDocument();
    expect(screen.getByText("Tiếng Việt")).toBeInTheDocument();
  });

  it("nên hoạt động các nút gạt (switch) trong tùy chọn hệ thống", () => {
    render(<BrowserRouter><SettingsContent /></BrowserRouter>);

    // Tìm các checkbox (nút gạt toggle)
    const toggles = screen.getAllByRole("checkbox");
    
    // Giả lập click vào nút gạt đầu tiên
    fireEvent.click(toggles[0]);
    
    // Vì là checkbox, ta kiểm tra trạng thái checked
    // Trong code của bạn dùng defaultChecked, test sẽ check trạng thái thay đổi
    expect(toggles[0]).not.toBeChecked(); 
  });
});