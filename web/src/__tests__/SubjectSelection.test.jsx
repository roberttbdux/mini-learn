import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubjectSelection from "../pages/SubjectSelection";

describe("SubjectSelection", () => {
  it("shows subject options", () => {
    render(
      <SubjectSelection
        subject=""
        setSubject={() => {}}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    expect(screen.getByText("Select Subject")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "History" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Biology" })).toBeInTheDocument();
  });

  it("disables Continue when no subject is selected", () => {
    render(
      <SubjectSelection
        subject=""
        setSubject={() => {}}
        onBack={() => {}}
        onContinue={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("enables Continue after selecting a subject", async () => {
    const user = userEvent.setup();
    const setSubject = vi.fn();

    function Wrapper() {
      const [subject, updateSubject] = React.useState("");

      return (
        <SubjectSelection
          subject={subject}
          setSubject={(value) => {
            setSubject(value);
            updateSubject(value);
          }}
          onBack={() => {}}
          onContinue={() => {}}
        />
      );
    }

    render(<Wrapper />);

    await user.click(screen.getByRole("button", { name: "Biology" }));

    expect(setSubject).toHaveBeenCalledWith("Biology");
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });

  it("calls onBack and onContinue", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onContinue = vi.fn();

    render(
      <SubjectSelection
        subject="History"
        setSubject={() => {}}
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