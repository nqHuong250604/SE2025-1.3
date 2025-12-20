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

import TransactionPage from "../src/features/user/pages/TransactionPage";
import * as userService from "../src/features/user/services/userService";

vi.mock("../src/features/user/components/HeaderUser", () => ({ default: () => <div>Header</div> }));
vi.mock("../src/features/user/services/userService");
vi.mock("../src/services/AuthContext", () => ({
  useAuth: () => ({ user: { full_name: "Admin" } })
}));

describe("TransactionPage", () => {
  it("nên render tiêu đề quản lý giao dịch", async () => {
    userService.listTransactions.mockResolvedValue({ data: [] });
    render(<TransactionPage />);
    expect(screen.getByText(/Quản lý Giao dịch Kho/i)).toBeInTheDocument();
  });
});