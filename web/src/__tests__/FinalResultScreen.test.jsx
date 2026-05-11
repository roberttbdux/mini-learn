import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FinalResultsScreen from "../pages/FinalResultsScreen";

describe("FinalResultsScreen", () => {
  it("shows original quiz and reinforcement scores", () => {
    render(
      <FinalResultsScreen
        originalScore={2}
        originalTotal={5}
        reinforcementScore={3}
        reinforcementTotal={3}
        weakConcept="You corrected the areas you missed during reinforcement."
        difficulty="Easy"
        missedQuestions={[]}
        onReviewMissedQuestions={() => {}}
        onReturnHome={() => {}}
        onStudyAnotherTopic={() => {}}
      />
    );

    expect(screen.getByText("Original Quiz")).toBeInTheDocument();
    expect(screen.getByText("Reinforcement")).toBeInTheDocument();
    expect(screen.getByText("2/5")).toBeInTheDocument();
    expect(screen.getByText("3/3")).toBeInTheDocument();
  });

  it("shows reinforcement feedback when no missed questions remain", () => {
    render(
      <FinalResultsScreen
        originalScore={2}
        originalTotal={5}
        reinforcementScore={3}
        reinforcementTotal={3}
        weakConcept="You corrected the areas you missed during reinforcement."
        difficulty="Easy"
        missedQuestions={[]}
        onReviewMissedQuestions={() => {}}
        onReturnHome={() => {}}
        onStudyAnotherTopic={() => {}}
      />
    );

    expect(screen.getByText("Reinforcement Feedback")).toBeInTheDocument();
    expect(
      screen.getByText("You corrected the areas you missed during reinforcement.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /review missed questions/i })
    ).not.toBeInTheDocument();
  });

  it("shows area still missed and review button when reinforcement questions are missed", () => {
    render(
      <FinalResultsScreen
        originalScore={1}
        originalTotal={5}
        reinforcementScore={2}
        reinforcementTotal={4}
        weakConcept="You missed questions about mitochondria and cell signals."
        difficulty="Hard"
        missedQuestions={[
          {
            question: "How do mitochondria support cells?",
            yourAnswer: "By controlling genes",
            correctAnswer: "By generating energy",
            explanation: "Mitochondria provide energy for cells.",
          },
        ]}
        onReviewMissedQuestions={() => {}}
        onReturnHome={() => {}}
        onStudyAnotherTopic={() => {}}
      />
    );

    expect(screen.getByText("Area You Still Missed")).toBeInTheDocument();
    expect(
      screen.getByText("You missed questions about mitochondria and cell signals.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /review missed questions/i })
    ).toBeInTheDocument();
  });

  it("calls navigation handlers when buttons are clicked", async () => {
    const user = userEvent.setup();
    const onReviewMissedQuestions = vi.fn();
    const onReturnHome = vi.fn();
    const onStudyAnotherTopic = vi.fn();

    render(
      <FinalResultsScreen
        originalScore={1}
        originalTotal={5}
        reinforcementScore={2}
        reinforcementTotal={4}
        weakConcept="You missed questions about mitochondria and cell signals."
        difficulty="Hard"
        missedQuestions={[
          {
            question: "How do mitochondria support cells?",
            yourAnswer: "By controlling genes",
            correctAnswer: "By generating energy",
            explanation: "Mitochondria provide energy for cells.",
          },
        ]}
        onReviewMissedQuestions={onReviewMissedQuestions}
        onReturnHome={onReturnHome}
        onStudyAnotherTopic={onStudyAnotherTopic}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /review missed questions/i })
    );
    await user.click(screen.getByRole("button", { name: /return to home/i }));
    await user.click(screen.getByRole("button", { name: /study another topic/i }));

    expect(onReviewMissedQuestions).toHaveBeenCalledTimes(1);
    expect(onReturnHome).toHaveBeenCalledTimes(1);
    expect(onStudyAnotherTopic).toHaveBeenCalledTimes(1);
  });
});