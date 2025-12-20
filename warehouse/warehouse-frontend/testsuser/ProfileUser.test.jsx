/** @vitest-environment jsdom */
import { vi, describe, it, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000' },
  writable: true
});

import ProfileUser from "../src/features/user/pages/ProfileUser";
import * as authServices from "../src/features/auth/authServices";

vi.mock("../src/features/user/components/HeaderUser", () => ({ default: () => <div>Header</div> }));
vi.mock("../src/features/auth/authServices");

describe("ProfileUser", () => {
  it("nên hiển thị tên người dùng sau khi tải dữ liệu", async () => {
    authServices.getCurrentUserAPI.mockResolvedValue({
      full_name: "Nguyễn Minh Dương",
      email: "duong@test.com"
    });

    render(<ProfileUser />);
    await waitFor(() => {
      // Sửa lỗi "Found multiple elements": Tìm chính xác thẻ h2 chứa tên
      const nameHeading = screen.getByRole('heading', { name: /Nguyễn Minh Dương/i, level: 2 });
      expect(nameHeading).toBeInTheDocument();
    });
  });
});