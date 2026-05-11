import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LessonScreen from "../pages/LessonScreen";

describe("LessonScreen", () => {
  it("shows topic, difficulty, and lesson text", () => {
    render(
      <LessonScreen
        topic="Roman Empire"
        difficulty="Easy"
        lesson="The Roman Empire began in Rome and expanded across many regions."
        onBack={() => {}}
        onStartPractice={() => {}}
      />
    );

    expect(screen.getByText("Roman Empire - Easy")).toBeInTheDocument();
    expect(
      screen.getByText("The Roman Empire began in Rome and expanded across many regions.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start practice/i })
    ).toBeInTheDocument();
  });

  it("shows fallback text when no lesson is loaded", () => {
    render(
      <LessonScreen
        topic="Roman Empire"
        difficulty="Easy"
        lesson=""
        onBack={() => {}}
        onStartPractice={() => {}}
      />
    );

    expect(screen.getByText("No lesson loaded.")).toBeInTheDocument();
  });

  it("calls onBack and onStartPractice", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onStartPractice = vi.fn();

    render(
      <LessonScreen
        topic="Roman Empire"
        difficulty="Easy"
        lesson="Lesson text"
        onBack={onBack}
        onStartPractice={onStartPractice}
      />
    );

    await user.click(screen.getByRole("button", { name: /back/i }));
    await user.click(screen.getByRole("button", { name: /start practice/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onStartPractice).toHaveBeenCalledTimes(1);
  });
});