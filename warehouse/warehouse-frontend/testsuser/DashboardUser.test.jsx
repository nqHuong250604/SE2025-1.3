/** @vitest-environment jsdom */
import { vi, describe, it, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers); // Cài đặt thủ công toBeInTheDocument

import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

// Mock window.location trước khi import service
Object.defineProperty(window, 'location', {
  value: { host: 'localhost:3000', hostname: 'localhost' },
  writable: true
});

import DashboardUser from "../src/features/user/pages/DashboardUser";
import * as userService from "../src/features/user/services/userService";

vi.mock("../src/features/user/components/HeaderUser", () => ({ default: () => <div>Header</div> }));
vi.mock("../src/features/user/services/userService");

describe("DashboardUser", () => {
  it("nên hiển thị tổng tồn kho từ API", async () => {
    userService.listTransactions.mockResolvedValue({ data: { items: [] } });
    userService.listRawInventory.mockResolvedValue({
      data: [{ product_id: 1, available_quantity: 150 }]
    });

    render(<DashboardUser />);
    await waitFor(() => {
      expect(screen.getByText(/150 SP/i)).toBeInTheDocument();
    });
  });
});