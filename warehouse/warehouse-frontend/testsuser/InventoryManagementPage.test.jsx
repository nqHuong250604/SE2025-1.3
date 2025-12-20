/** @vitest-environment jsdom */
import { vi, describe, it, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen } from "@testing-library/react";
import React from "react";

Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000' },
  writable: true
});

import InventoryManagementPage from "../src/features/user/pages/InventoryManagementPage";
import * as userService from "../src/features/user/services/userService";

vi.mock("../src/features/user/components/HeaderUser", () => ({ default: () => <div>Header</div> }));
vi.mock("../src/features/user/services/userService");

describe("InventoryManagementPage", () => {
  it("nên hiển thị tiêu đề Quản Lý Tồn Kho", async () => {
    userService.fetchInventoryWithDetails.mockResolvedValue([]);
    render(<InventoryManagementPage />);
    expect(screen.getByText(/Quản Lý Tồn Kho/i)).toBeInTheDocument();
  });
});