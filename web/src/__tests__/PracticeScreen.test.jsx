import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PracticeScreen from "../pages/PracticeScreen";

const sampleQuestions = [
  {
    question: "What city did the Roman Empire start from?",
    choices: ["Carthage", "Rome", "Athens", "Alexandria"],
    answerIndex: 1,
    explanation: "The Roman Empire started from Rome.",
  },
  {
    question: "Who made important decisions for the Roman Empire?",
    choices: ["The army generals", "The senators", "The governors", "The emperor"],
    answerIndex: 3,
    explanation: "The emperor made important decisions.",
  },
];

describe("PracticeScreen", () => {
  it("shows topic, difficulty, question text, and answer choices", () => {
    render(
      <PracticeScreen
        topic="Roman Empire"
        difficulty="Easy"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={() => {}}
      />
    );

    expect(screen.getByText("Roman Empire - Easy")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByText("What city did the Roman Empire start from?")
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Carthage" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rome" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Athens" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alexandria" })).toBeInTheDocument();
  });

  it("keeps Next Question disabled until an answer is selected", async () => {
    const user = userEvent.setup();

    render(
      <PracticeScreen
        topic="Roman Empire"
        difficulty="Easy"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={() => {}}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next question/i });
    expect(nextButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Rome" }));

    expect(nextButton).not.toBeDisabled();
  });

  it("moves to the next question after selecting an answer", async () => {
    const user = userEvent.setup();

    render(
      <PracticeScreen
        topic="Roman Empire"
        difficulty="Easy"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: "Rome" }));
    await user.click(screen.getByRole("button", { name: /next question/i }));

    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByText("Who made important decisions for the Roman Empire?")
    ).toBeInTheDocument();
  });

  it("calls onFinish after the last question", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();

    render(
      <PracticeScreen
        topic="Roman Empire"
        difficulty="Easy"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={onFinish}
      />
    );

    await user.click(screen.getByRole("button", { name: "Rome" }));
    await user.click(screen.getByRole("button", { name: /next question/i }));

    await user.click(screen.getByRole("button", { name: "The emperor" }));
    await user.click(screen.getByRole("button", { name: /view results/i }));

    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledWith([1, 3]);
  });

  it("calls onBack when Back is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <PracticeScreen
        topic="Roman Empire"
        difficulty="Easy"
        questions={sampleQuestions}
        onBack={onBack}
        onFinish={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});