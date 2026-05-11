import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "./server";

describe("Mini Learn API", () => {

  function expectValidQuestion(question) {
    expect(question).toHaveProperty("question");
    expect(typeof question.question).toBe("string");
    expect(question.question.length).toBeGreaterThan(0);

    expect(question).toHaveProperty("choices");
    expect(Array.isArray(question.choices)).toBe(true);
    expect(question.choices).toHaveLength(4);

    question.choices.forEach((choice) => {
      expect(typeof choice).toBe("string");
      expect(choice.length).toBeGreaterThan(0);
    });

    expect(question).toHaveProperty("answerIndex");
    expect(Number.isInteger(question.answerIndex)).toBe(true);
    expect(question.answerIndex).toBeGreaterThanOrEqual(0);
    expect(question.answerIndex).toBeLessThan(4);

    expect(question).toHaveProperty("explanation");
    expect(typeof question.explanation).toBe("string");
    expect(question.explanation.length).toBeGreaterThan(0);
  }
  it("GET /health should return running status", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
  });

  it("POST /api/lesson should return a lesson for valid input", async () => {
    const res = await request(app).post("/api/lesson").send({
      subject: "History",
      topic: "Cold War",
      difficulty: "Intermediate",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("subject", "History");
    expect(res.body).toHaveProperty("topic", "Cold War");
    expect(res.body).toHaveProperty("difficulty", "Intermediate");
    expect(res.body).toHaveProperty("lesson");
    expect(typeof res.body.lesson).toBe("string");
    expect(res.body.lesson.length).toBeGreaterThan(0);
  }, 15000);

  it("POST /api/quiz should return questions for valid input", async () => {
    const res = await request(app).post("/api/quiz").send({
      subject: "History",
      topic: "Cold War",
      difficulty: "Intermediate",
      lesson:
      "The Cold War was a political conflict between the United States and the Soviet Union. The two sides competed through alliances, weapons, and influence instead of direct war.",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("questions");
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBeGreaterThan(0);

    res.body.questions.forEach(expectValidQuestion);
  }, 15000);

  it("POST /api/lesson should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/lesson").send({
      subject: "History",
      topic: "Cold War",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/quiz should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/quiz").send({
      subject: "History",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

    it("POST /api/reinforcement-lesson should return lessons for valid input", async () => {
    const res = await request(app).post("/api/reinforcement-lesson").send({
      subject: "History",
      topic: "World War 2",
      difficulty: "Easy",
      missedQuestions: [
        {
          question: "What event started World War II?",
          yourAnswer: "Pearl Harbor",
          correctAnswer: "Germany invading Poland",
        },
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("lessons");
    expect(Array.isArray(res.body.lessons)).toBe(true);
    expect(res.body.lessons.length).toBeGreaterThan(0);
  });

  it("POST /api/reinforcement should return questions for valid input", async () => {
    const res = await request(app).post("/api/reinforcement").send({
      subject: "History",
      topic: "World War 2",
      difficulty: "Easy",
      missedQuestions: [
        {
          question: "What event started World War II?",
          yourAnswer: "Pearl Harbor",
          correctAnswer: "Germany invading Poland",
        },
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("questions");
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBeGreaterThan(0);

    res.body.questions.forEach(expectValidQuestion);
  });

  it("POST /api/reinforcement-lesson should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/reinforcement-lesson").send({
      subject: "History",
      topic: "World War 2",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/reinforcement should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/reinforcement").send({
      subject: "History",
      topic: "World War 2",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/missed-explanations should return explanations for valid input", async () => {
    const res = await request(app).post("/api/missed-explanations").send({
      subject: "History",
      topic: "World War 2",
      difficulty: "Easy",
      missedQuestions: [
        {
          question: "What event started World War II?",
          yourAnswer: "Pearl Harbor",
          correctAnswer: "Germany invading Poland",
          explanation: "Original explanation",
        },
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("missedQuestions");
    expect(Array.isArray(res.body.missedQuestions)).toBe(true);
    expect(res.body.missedQuestions.length).toBe(1);
    expect(res.body.missedQuestions[0]).toHaveProperty("question");
    expect(res.body.missedQuestions[0]).toHaveProperty("yourAnswer");
    expect(res.body.missedQuestions[0]).toHaveProperty("correctAnswer");
    expect(res.body.missedQuestions[0]).toHaveProperty("explanation");
    expect(typeof res.body.missedQuestions[0].explanation).toBe("string");
    expect(res.body.missedQuestions[0].explanation.length).toBeGreaterThan(0);
  }, 15000);

  it("POST /api/missed-explanations should return an empty array when no questions were missed", async () => {
    const res = await request(app).post("/api/missed-explanations").send({
      subject: "History",
      topic: "World War 2",
      difficulty: "Easy",
      missedQuestions: [],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("missedQuestions");
    expect(Array.isArray(res.body.missedQuestions)).toBe(true);
    expect(res.body.missedQuestions).toHaveLength(0);
  });

  it("POST /api/missed-explanations should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/missed-explanations").send({
      subject: "History",
      topic: "World War 2",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/weak-summary should return a weak summary for valid input", async () => {
    const res = await request(app).post("/api/weak-summary").send({
      subject: "History",
      topic: "World War 2",
      difficulty: "Easy",
      missedQuestions: [
        {
          question: "What event started World War II?",
          yourAnswer: "Pearl Harbor",
          correctAnswer: "Germany invading Poland",
          explanation: "Pearl Harbor happened after World War II already started.",
        },
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("weakSummary");
    expect(typeof res.body.weakSummary).toBe("string");
    expect(res.body.weakSummary.length).toBeGreaterThan(0);
  }, 15000);

  it("POST /api/weak-summary should return a positive message when no questions were missed", async () => {
    const res = await request(app).post("/api/weak-summary").send({
      subject: "History",
      topic: "World War 2",
      difficulty: "Easy",
      missedQuestions: [],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "weakSummary",
      "You did not miss any weak areas. Great job!"
    );
  });

  it("POST /api/weak-summary should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/weak-summary").send({
      subject: "History",
      topic: "World War 2",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
