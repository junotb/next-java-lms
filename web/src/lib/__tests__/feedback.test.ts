import { parseFeedbackContent } from "../feedback";

const validFeedbackData = {
  feedback_summary: {
    opening_message: "안녕하세요.",
    closing_message: "수고하세요.",
  },
  corrections: [
    {
      id: 1,
      original_sentence: "I goed",
      better_expression: "I went",
      feedback_detail: "과거형 수정",
    },
  ],
};

describe("parseFeedbackContent", () => {
  it("returns null for null or undefined", () => {
    expect(parseFeedbackContent(null)).toBeNull();
    expect(parseFeedbackContent(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseFeedbackContent("")).toBeNull();
    expect(parseFeedbackContent("   ")).toBeNull();
  });

  it("returns object as-is when valid FeedbackData object passed", () => {
    const result = parseFeedbackContent(validFeedbackData);
    expect(result).toEqual(validFeedbackData);
  });

  it("returns parsed object for valid JSON string", () => {
    const json = JSON.stringify(validFeedbackData);
    expect(parseFeedbackContent(json)).toEqual(validFeedbackData);
  });

  it("strips markdown code block wrapper", () => {
    const wrapped = "```json\n" + JSON.stringify(validFeedbackData) + "\n```";
    expect(parseFeedbackContent(wrapped)).toEqual(validFeedbackData);
  });

  it("handles escaped JSON string (double-quoted)", () => {
    const escaped = JSON.stringify(JSON.stringify(validFeedbackData));
    expect(parseFeedbackContent(escaped)).toEqual(validFeedbackData);
  });

  it("returns null for invalid JSON string", () => {
    expect(parseFeedbackContent("not json")).toBeNull();
    expect(parseFeedbackContent("{ invalid }")).toBeNull();
  });

  it("returns null when feedback_summary is missing", () => {
    const invalid = { corrections: [] };
    expect(parseFeedbackContent(JSON.stringify(invalid))).toBeNull();
  });

  it("returns null when corrections is not array", () => {
    const invalid = {
      feedback_summary: validFeedbackData.feedback_summary,
      corrections: "not-array",
    };
    expect(parseFeedbackContent(JSON.stringify(invalid))).toBeNull();
  });

  it("returns null for array input", () => {
    expect(parseFeedbackContent([])).toBeNull();
  });

  it("returns null for number input", () => {
    expect(parseFeedbackContent(123 as unknown as string)).toBeNull();
  });
});
