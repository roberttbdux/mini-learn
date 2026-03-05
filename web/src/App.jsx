import { useState } from "react";
import MainScreen from "./pages/MainScreen";
import SubjectSelection from "./pages/SubjectSelection";

export default function App() {
  const [screen, setScreen] = useState("main");
  const [subject, setSubject] = useState("");

  return (
    <>
      {screen === "main" && (
        <MainScreen onBegin={() => setScreen("subjects")} />
      )}

      {screen === "subjects" && (
        <SubjectSelection
          subject={subject}
          setSubject={setSubject}
          onBack={() => setScreen("main")}
          onContinue={() => alert(`Selected subject: ${subject}`)}
        />
      )}
    </>
  );
}