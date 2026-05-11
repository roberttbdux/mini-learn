import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReinforcementScreen from "../pages/ReinforcementScreen";

const sampleQuestions = [
  {
    question: "How do mitochondria primarily support cellular activities?",
    choices: [
      "By generating energy through the conversion of nutrients",
      "By producing ligands for receptor activation",
      "By transmitting external signals into the nucleus",
      "By regulating the expression of all cellular genes",
    ],
    answerIndex: 0,
    explanation: "Mitochondria generate energy for cells.",
  },
  {
    question: "What happens when a ligand binds to a receptor?",
    choices: [
      "It stops all cell activity",
      "It triggers internal signaling pathways",
      "It destroys the mitochondria",
      "It blocks all communication",
    ],
    answerIndex: 1,
    explanation: "Ligand binding can trigger internal signaling pathways.",
  },
];

describe("ReinforcementScreen", () => {
  it("shows topic, question text, and answer choices", () => {
    render(
      <ReinforcementScreen
        topic="Cells"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={() => {}}
      />
    );

    expect(screen.getByText("Review Missed Concept")).toBeInTheDocument();
    expect(screen.getByText("Topic: Cells")).toBeInTheDocument();
    expect(screen.getByText("Reinforcement Question 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByText("How do mitochondria primarily support cellular activities?")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "By generating energy through the conversion of nutrients",
      })
    ).toBeInTheDocument();
  });

  it("keeps Next Question disabled until an answer is selected", async () => {
    const user = userEvent.setup();

    render(
      <ReinforcementScreen
        topic="Cells"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={() => {}}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next question/i });
    expect(nextButton).toBeDisabled();

    await user.click(
      screen.getByRole("button", {
        name: "By generating energy through the conversion of nutrients",
      })
    );

    expect(nextButton).not.toBeDisabled();
  });

  it("moves to the next reinforcement question", async () => {
    const user = userEvent.setup();

    render(
      <ReinforcementScreen
        topic="Cells"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={() => {}}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "By generating energy through the conversion of nutrients",
      })
    );
    await user.click(screen.getByRole("button", { name: /next question/i }));

    expect(screen.getByText("Reinforcement Question 2 of 2")).toBeInTheDocument();
    expect(
      screen.getByText("What happens when a ligand binds to a receptor?")
    ).toBeInTheDocument();
  });

  it("calls onFinish after the last reinforcement question", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();

    render(
      <ReinforcementScreen
        topic="Cells"
        questions={sampleQuestions}
        onBack={() => {}}
        onFinish={onFinish}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "By generating energy through the conversion of nutrients",
      })
    );
    await user.click(screen.getByRole("button", { name: /next question/i }));

    await user.click(
      screen.getByRole("button", { name: "It triggers internal signaling pathways" })
    );
    await user.click(screen.getByRole("button", { name: /view final results/i }));

    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledWith([0, 1]);
  });

  it("calls onBack when Back is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <ReinforcementScreen
        topic="Cells"
        questions={sampleQuestions}
        onBack={onBack}
        onFinish={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});