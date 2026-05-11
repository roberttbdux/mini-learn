import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DifficultySelection from "../pages/DifficultySelection";

describe("DifficultySelection", () => {
  it("shows topic and difficulty options", () => {
    render(
      <DifficultySelection
        topic="Cold War"
        difficulty=""
        setDifficulty={() => {}}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    expect(screen.getByText("Cold War")).toBeInTheDocument();
    expect(screen.getByText("Select Difficulty:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Easy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Intermediate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hard" })).toBeInTheDocument();
  });

  it("disables Continue when no difficulty is selected", () => {
    render(
      <DifficultySelection
        topic="Cold War"
        difficulty=""
        setDifficulty={() => {}}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("enables Continue after selecting a difficulty", async () => {
    const user = userEvent.setup();
    const setDifficulty = vi.fn();

    function Wrapper() {
      const [difficulty, updateDifficulty] = React.useState("");

      return (
        <DifficultySelection
          topic="Cold War"
          difficulty={difficulty}
          setDifficulty={(value) => {
            setDifficulty(value);
            updateDifficulty(value);
          }}
          onBack={() => {}}
          onContinue={() => {}}
        />
      );
    }

    render(<Wrapper />);

    await user.click(screen.getByRole("button", { name: "Hard" }));

    expect(setDifficulty).toHaveBeenCalledWith("Hard");
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });

  it("calls onBack and onContinue", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onContinue = vi.fn();

    render(
      <DifficultySelection
        topic="Cold War"
        difficulty="Easy"
        setDifficulty={() => {}}
        onBack={onBack}
        onContinue={onContinue}
      />
    );

    await user.click(screen.getByRole("button", { name: /back/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});