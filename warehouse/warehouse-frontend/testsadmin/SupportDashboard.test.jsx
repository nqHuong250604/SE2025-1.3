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

// 2. Import đúng đường dẫn
import SupportDashboard from "../src/features/admin/pages/support/SupportDashboard";

// 3. Mock Layout Components
vi.mock("../src/features/admin/components/Sidebar", () => ({ 
  default: () => <div data-testid="sidebar">Sidebar Mock</div> 
}));
vi.mock("../src/features/admin/components/Topbar", () => ({ 
  default: () => <div data-testid="topbar">Topbar Mock</div> 
}));

// 4. Mock Lucide Icons (Toàn bộ icons được dùng trong SupportDashboard)
vi.mock("lucide-react", () => ({
  Search: () => <span>SearchIcon</span>,
  Mail: () => <span>MailIcon</span>,
  Phone: () => <span>PhoneIcon</span>,
  MessageCircle: () => <span>ChatIcon</span>,
  Book: () => <span>BookIcon</span>,
  PlayCircle: () => <span>PlayIcon</span>,
  FileText: () => <span>FileIcon</span>,
  Code: () => <span>CodeIcon</span>,
  ChevronDown: () => <span>DownIcon</span>,
  ChevronUp: () => <span>UpIcon</span>,
  Home: () => <span>HomeIcon</span>,
  BarChart: () => <span>ChartIcon</span>,
  ShoppingCart: () => <span>CartIcon</span>,
  Package: () => <span>PackageIcon</span>,
  LogOut: () => <span>LogoutIcon</span>,
}));

describe("SupportDashboard (Trợ giúp & Hỗ trợ)", () => {
  
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("nên hiển thị tiêu đề và cấu trúc layout chính", () => {
    render(
      <BrowserRouter>
        <SupportDashboard />
      </BrowserRouter>
    );

    // Kiểm tra tiêu đề chính (Sử dụng getAllBy...[0] để né lỗi render lặp)
    const titles = screen.getAllByText(/Trợ giúp & Hỗ trợ/i);
    expect(titles[0]).toBeInTheDocument();

    // Kiểm tra Sidebar/Topbar mock
    expect(screen.getAllByTestId("sidebar")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("topbar")[0]).toBeInTheDocument();
  });

  it("nên hiển thị danh sách các liên kết nhanh", () => {
    render(<BrowserRouter><SupportDashboard /></BrowserRouter>);

    expect(screen.getAllByText("Hướng dẫn bắt đầu")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Tài liệu người dùng")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Video hướng dẫn")[0]).toBeInTheDocument();
  });

  it("nên hoạt động tính năng đóng/mở FAQ (Accordion)", () => {
    render(<BrowserRouter><SupportDashboard /></BrowserRouter>);

    const questionText = "Làm thế nào để theo dõi đơn hàng?";
    const answerText = /Hệ thống sẽ hiển thị trạng thái và vị trí đơn hàng theo thời gian thực/i;

    // 1. Ban đầu câu trả lời không được hiển thị (vì openIndex = null)
    expect(screen.queryByText(answerText)).not.toBeInTheDocument();

    // 2. Click vào câu hỏi
    const questionButton = screen.getAllByText(questionText)[0];
    fireEvent.click(questionButton);

    // 3. Bây giờ câu trả lời phải hiện ra
    expect(screen.getAllByText(answerText)[0]).toBeInTheDocument();

    // 4. Click lại một lần nữa để đóng
    fireEvent.click(questionButton);
    expect(screen.queryByText(answerText)).not.toBeInTheDocument();
  });

  it("nên hiển thị trạng thái hệ thống ổn định", () => {
    render(<BrowserRouter><SupportDashboard /></BrowserRouter>);

    expect(screen.getAllByText("Tất cả hệ thống hoạt động bình thường")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Ổn định")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Đã kết nối")[0]).toBeInTheDocument();
  });

  it("nên hiển thị thông tin giờ hỗ trợ và liên hệ", () => {
    render(<BrowserRouter><SupportDashboard /></BrowserRouter>);

    expect(screen.getAllByText(/Chat trực tiếp/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Thứ 2 - Thứ 6: 9:00 - 18:00/i)[0]).toBeInTheDocument();
  });
});