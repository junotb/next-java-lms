import { CourseRegistrationSchema, DAYS_OF_WEEK } from "../registration-request";

describe("CourseRegistrationSchema", () => {
  const validPayload = {
    courseId: 1,
    months: 3,
    days: ["MONDAY", "WEDNESDAY"],
    startTime: "10:00",
    durationMinutes: 60,
  };

  it("parses valid payload", () => {
    const result = CourseRegistrationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it("rejects when courseId is missing or invalid", () => {
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, courseId: undefined })
    ).toMatchObject({ success: false });
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, courseId: 0 })
    ).toMatchObject({ success: false });
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, courseId: -1 })
    ).toMatchObject({ success: false });
  });

  it("rejects when months is invalid", () => {
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, months: 0 })
    ).toMatchObject({ success: false });
  });

  it("rejects when days is empty array", () => {
    const result = CourseRegistrationSchema.safeParse({
      ...validPayload,
      days: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects when days contains invalid value", () => {
    const result = CourseRegistrationSchema.safeParse({
      ...validPayload,
      days: ["INVALID_DAY"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts all DAYS_OF_WEEK values", () => {
    for (const day of DAYS_OF_WEEK) {
      const result = CourseRegistrationSchema.safeParse({
        ...validPayload,
        days: [day],
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects startTime not in HH:MM format", () => {
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, startTime: "9:00" })
    ).toMatchObject({ success: false });
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, startTime: "invalid" })
    ).toMatchObject({ success: false });
  });

  it("accepts valid HH:MM formats", () => {
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, startTime: "00:00" })
    ).toMatchObject({ success: true });
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, startTime: "23:59" })
    ).toMatchObject({ success: true });
  });

  it("rejects when durationMinutes is zero or negative", () => {
    expect(
      CourseRegistrationSchema.safeParse({ ...validPayload, durationMinutes: 0 })
    ).toMatchObject({ success: false });
  });
});
