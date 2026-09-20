import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a native button with its label", () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });

    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
  });

  it("marks loading buttons as busy and disabled", () => {
    render(
      <Button aria-busy={false} isLoading>
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Save" });

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.querySelector(".ds-button-spinner")).not.toBeNull();
  });

  it("does not fire clicks while disabled", () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
