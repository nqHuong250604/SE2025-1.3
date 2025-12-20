/** @vitest-environment jsdom */
import { vi, describe, it, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("../src/features/user/components/HeaderUser", () => ({ default: () => <div>Header</div> }));

import SettingUser from "../src/features/user/pages/SettingUser";

describe("SettingUser", () => {
  it("nên hiển thị tiêu đề Cài đặt tài khoản", () => {
    render(<SettingUser />);
    expect(screen.getByText(/Cài đặt tài khoản/i)).toBeInTheDocument();
  });
});