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

// 2. Import component cần test
import SettingDashboard from "../src/features/admin/pages/settings/SettingDashboard";

// 3. SỬA LỖI MOCK: Đường dẫn phải đi từ thư mục testsadmin vào src
vi.mock("../src/features/admin/components/Sidebar", () => ({ 
  default: () => <div data-testid="sidebar">Sidebar Mock</div> 
}));

vi.mock("../src/features/admin/components/Topbar", () => ({ 
  default: () => <div data-testid="topbar">Topbar Mock</div> 
}));

// Mock SettingsContent (Lưu ý chữ 'd' ở cuối file SettingContend của bạn)
vi.mock("../src/features/admin/pages/settings/SettingContend", () => ({ 
  default: () => <div data-testid="settings-content">Settings Content Mock</div> 
}));

describe("SettingDashboard Layout (Fixed Paths)", () => {
  
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("nên hiển thị đầy đủ cấu trúc trang gồm Sidebar, Topbar và Nội dung cài đặt", () => {
    render(
      <BrowserRouter>
        <SettingDashboard />
      </BrowserRouter>
    );

    // Kiểm tra Sidebar Mock
    const sidebars = screen.getAllByTestId("sidebar");
    expect(sidebars[0]).toBeInTheDocument();
    expect(sidebars[0]).toHaveTextContent("Sidebar Mock");

    // Kiểm tra Topbar Mock
    const topbars = screen.getAllByTestId("topbar");
    expect(topbars[0]).toBeInTheDocument();

    // Kiểm tra Content Mock
    const content = screen.getAllByTestId("settings-content");
    expect(content[0]).toBeInTheDocument();
  });

  it("nên có container nền xám bg-gray-100", () => {
    render(
      <BrowserRouter>
        <SettingDashboard />
      </BrowserRouter>
    );

    // Tìm div có class bg-gray-100 (đặc trưng của layout dashboard admin của bạn)
    const container = screen.getByTestId("sidebar").closest('.bg-gray-100');
    expect(container).toBeInTheDocument();
  });
});