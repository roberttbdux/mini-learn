import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewMissedQuestionsScreen from "../pages/ReviewMissedQuestionsScreen";

describe("ReviewMissedQuestionsScreen", () => {
  it("shows a message when there are no missed questions", () => {
    render(
      <ReviewMissedQuestionsScreen
        missedQuestions={[]}
        onBack={() => {}}
      />
    );

    expect(screen.getByText("Review Missed Questions")).toBeInTheDocument();
    expect(
      screen.getByText("No missed questions to review. Great job!")
    ).toBeInTheDocument();
  });

  it("shows missed question details", () => {
    render(
      <ReviewMissedQuestionsScreen
        missedQuestions={[
          {
            question: "How do mitochondria support cellular activities?",
            yourAnswer: "By controlling genes",
            correctAnswer: "By generating energy through nutrients",
            explanation:
              "Mitochondria provide energy by turning nutrients into fuel that cells need.",
          },
        ]}
        onBack={() => {}}
      />
    );

    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(
      screen.getByText("How do mitochondria support cellular activities?")
    ).toBeInTheDocument();
    expect(screen.getByText(/Your answer:/i)).toBeInTheDocument();
    expect(screen.getByText("By controlling genes")).toBeInTheDocument();
    expect(screen.getByText(/Correct answer:/i)).toBeInTheDocument();
    expect(
      screen.getByText("By generating energy through nutrients")
    ).toBeInTheDocument();
    expect(screen.getByText(/Why:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Mitochondria provide energy by turning nutrients into fuel that cells need."
      )
    ).toBeInTheDocument();
  });

  it("shows multiple missed questions", () => {
    render(
      <ReviewMissedQuestionsScreen
        missedQuestions={[
          {
            question: "Question one?",
            yourAnswer: "Wrong one",
            correctAnswer: "Correct one",
            explanation: "Explanation one.",
          },
          {
            question: "Question two?",
            yourAnswer: "Wrong two",
            correctAnswer: "Correct two",
            explanation: "Explanation two.",
          },
        ]}
        onBack={() => {}}
      />
    );

    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
    expect(screen.getByText("Question one?")).toBeInTheDocument();
    expect(screen.getByText("Question two?")).toBeInTheDocument();
  });

  it("calls onBack when Back to Final Results is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <ReviewMissedQuestionsScreen
        missedQuestions={[
          {
            question: "Question one?",
            yourAnswer: "Wrong one",
            correctAnswer: "Correct one",
            explanation: "Explanation one.",
          },
        ]}
        onBack={onBack}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /back to final results/i })
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});