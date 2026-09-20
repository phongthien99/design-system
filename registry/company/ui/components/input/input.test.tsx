import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input with provided attributes", () => {
    render(<Input aria-label="Email" placeholder="name@example.com" />);

    const input = screen.getByRole("textbox", { name: "Email" });

    expect(input.getAttribute("placeholder")).toBe("name@example.com");
  });

  it("sets aria-invalid when invalid", () => {
    render(<Input aria-label="Email" isInvalid />);

    expect(screen.getByRole("textbox", { name: "Email" }).getAttribute("aria-invalid")).toBe("true");
  });

  it("supports disabled state", () => {
    render(<Input aria-label="Email" disabled />);

    expect((screen.getByRole("textbox", { name: "Email" }) as HTMLInputElement).disabled).toBe(true);
  });
});
