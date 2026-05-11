import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainScreen from "../pages/MainScreen";

describe("MainScreen", () => {
  it("shows app title, subtitle, and begin button", () => {
    render(<MainScreen onBegin={() => {}} />);

    expect(screen.getByText("Mini Learn")).toBeInTheDocument();
    expect(
      screen.getByText("Short lessons • Quick practice • Adaptive review")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /begin/i })).toBeInTheDocument();
  });

  it("calls onBegin when Begin is clicked", async () => {
    const user = userEvent.setup();
    const onBegin = vi.fn();

    render(<MainScreen onBegin={onBegin} />);

    await user.click(screen.getByRole("button", { name: /begin/i }));

    expect(onBegin).toHaveBeenCalledTimes(1);
  });
});