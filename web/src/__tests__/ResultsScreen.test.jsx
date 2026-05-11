import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultsScreen from "../pages/ResultsScreen";

describe("ResultsScreen", () => {
  it("shows the original quiz score", () => {
    render(
      <ResultsScreen
        score={2}
        total={5}
        missedQuestions={[
          {
            question: "What helped the Roman Empire grow?",
            yourAnswer: "Religious influence",
            correctAnswer: "A strong army and government",
            explanation: "A strong army and government helped Rome control land.",
          },
        ]}
        weakConcept="You missed questions about Roman government."
        difficulty="Easy"
        onReviewMistakes={() => {}}
        onReturnHome={() => {}}
        onStudyAnotherTopic={() => {}}
      />
    );

    expect(screen.getByText("Original Quiz")).toBeInTheDocument();
    expect(screen.getByText("2/5")).toBeInTheDocument();
  });

  it("shows area missed when there are missed questions", () => {
    render(
      <ResultsScreen
        score={2}
        total={5}
        missedQuestions={[
          {
            question: "What helped the Roman Empire grow?",
            yourAnswer: "Religious influence",
            correctAnswer: "A strong army and government",
            explanation: "A strong army and government helped Rome control land.",
          },
        ]}
        weakConcept="You missed questions about Roman government."
        difficulty="Easy"
        onReviewMistakes={() => {}}
        onReturnHome={() => {}}
        onStudyAnotherTopic={() => {}}
      />
    );

    expect(screen.getByText("Area You Missed")).toBeInTheDocument();
    expect(
      screen.getByText("You missed questions about Roman government.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /review mistakes/i })
    ).toBeInTheDocument();
  });

  it("shows positive feedback when all questions are correct", () => {
    render(
      <ResultsScreen
        score={5}
        total={5}
        missedQuestions={[]}
        weakConcept="You did not miss any weak areas. Great job!"
        difficulty="Easy"
        onReviewMistakes={() => {}}
        onReturnHome={() => {}}
        onStudyAnotherTopic={() => {}}
      />
    );

    expect(screen.getByText("Quiz Feedback")).toBeInTheDocument();
    expect(
      screen.getByText("Great work! You answered all questions correctly.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /review mistakes/i })
    ).not.toBeInTheDocument();
  });

  it("calls onReviewMistakes when Review Mistakes is clicked", async () => {
    const user = userEvent.setup();
    const onReviewMistakes = vi.fn();

    render(
      <ResultsScreen
        score={2}
        total={5}
        missedQuestions={[
          {
            question: "What helped the Roman Empire grow?",
            yourAnswer: "Religious influence",
            correctAnswer: "A strong army and government",
            explanation: "A strong army and government helped Rome control land.",
          },
        ]}
        weakConcept="You missed questions about Roman government."
        difficulty="Easy"
        onReviewMistakes={onReviewMistakes}
        onReturnHome={() => {}}
        onStudyAnotherTopic={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /review mistakes/i }));

    expect(onReviewMistakes).toHaveBeenCalledTimes(1);
  });
});