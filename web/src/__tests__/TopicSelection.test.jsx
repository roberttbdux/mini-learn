import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopicSelection from "../pages/TopicSelection";

describe("TopicSelection", () => {
  it("shows preset topics for History", () => {
    render(
      <TopicSelection
        subject="History"
        topic=""
        setTopic={() => {}}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    expect(screen.getByText("World War 2")).toBeInTheDocument();
    expect(screen.getByText("Cold War")).toBeInTheDocument();
    expect(screen.getByText("Civil War")).toBeInTheDocument();
  });

  it("disables Continue when no topic is selected", () => {
    render(
      <TopicSelection
        subject="History"
        topic=""
        setTopic={() => {}}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("enables Continue when a preset topic is selected", async () => {
    const user = userEvent.setup();
    const setTopic = vi.fn();

    function Wrapper() {
      const [topic, updateTopic] = React.useState("");

      return (
        <TopicSelection
          subject="History"
          topic={topic}
          setTopic={(value) => {
            setTopic(value);
            updateTopic(value);
          }}
          onBack={() => {}}
          onContinue={() => {}}
        />
      );
    }

    render(<Wrapper />);

    await user.click(screen.getByRole("button", { name: "Cold War" }));

    expect(setTopic).toHaveBeenCalledWith("Cold War");
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });

  it("allows the user to type a custom topic", async () => {
    const user = userEvent.setup();
    const setTopic = vi.fn();

    function Wrapper() {
      const [topic, updateTopic] = React.useState("");

      return (
        <TopicSelection
          subject="History"
          topic={topic}
          setTopic={(value) => {
            setTopic(value);
            updateTopic(value);
          }}
          onBack={() => {}}
          onContinue={() => {}}
        />
      );
    }

    render(<Wrapper />);

    const input = screen.getByPlaceholderText("Example: Roman Empire");
    await user.type(input, "Roman Empire");

    expect(setTopic).toHaveBeenLastCalledWith("Roman Empire");
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });
});