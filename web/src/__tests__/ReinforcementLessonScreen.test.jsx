import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReinforcementLessonScreen from "../pages/ReinforcementLessonScreen";

describe("ReinforcementLessonScreen", () => {
  it("shows topic and reinforcement lessons", () => {
    render(
      <ReinforcementLessonScreen
        topic="Cells"
        lessons={[
          "Mitochondria convert nutrients into usable energy for the cell.",
          "Ligands bind to receptors and start internal signaling pathways.",
        ]}
        onBack={() => {}}
        onStartQuestions={() => {}}
      />
    );

    expect(screen.getByText("Review Missed Concepts")).toBeInTheDocument();
    expect(screen.getByText("Topic: Cells")).toBeInTheDocument();
    expect(
      screen.getByText("Mitochondria convert nutrients into usable energy for the cell.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ligands bind to receptors and start internal signaling pathways.")
    ).toBeInTheDocument();
  });

  it("calls onStartQuestions when Start Reinforcement Questions is clicked", async () => {
    const user = userEvent.setup();
    const onStartQuestions = vi.fn();

    render(
      <ReinforcementLessonScreen
        topic="Cells"
        lessons={["Mitochondria convert nutrients into usable energy for the cell."]}
        onBack={() => {}}
        onStartQuestions={onStartQuestions}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /start reinforcement questions/i })
    );

    expect(onStartQuestions).toHaveBeenCalledTimes(1);
  });

  it("calls onBack when Back is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <ReinforcementLessonScreen
        topic="Cells"
        lessons={["Mitochondria convert nutrients into usable energy for the cell."]}
        onBack={onBack}
        onStartQuestions={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});