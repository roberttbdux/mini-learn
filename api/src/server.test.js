import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "./server";

describe("Mini Learn API", () => {
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
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("questions");
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBeGreaterThan(0);
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
          userAnswer: "Pearl Harbor",
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
          userAnswer: "Pearl Harbor",
          correctAnswer: "Germany invading Poland",
        },
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("questions");
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBeGreaterThan(0);
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
});
