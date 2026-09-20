import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders a checkbox control", () => {
    render(<Checkbox aria-label="Accept terms" />);

    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeTruthy();
  });

  it("reflects checked state", () => {
    render(<Checkbox aria-label="Accept terms" checked />);

    expect(screen.getByRole("checkbox", { name: "Accept terms" }).getAttribute("aria-checked")).toBe("true");
  });

  it("does not fire changes while disabled", () => {
    const onCheckedChange = vi.fn();

    render(<Checkbox aria-label="Accept terms" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Accept terms" }));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
