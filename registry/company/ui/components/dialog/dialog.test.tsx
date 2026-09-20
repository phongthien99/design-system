import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../../primitives/button/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";

describe("Dialog", () => {
  it("opens dialog content from its trigger", async () => {
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open settings</Button>} />
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage preferences</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open settings" }));

    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(screen.getByText("Manage preferences")).toBeTruthy();
  });
});
