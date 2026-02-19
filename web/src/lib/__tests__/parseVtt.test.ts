import { parseVtt } from "../parseVtt";

describe("parseVtt", () => {
  it("returns empty array for empty string", () => {
    expect(parseVtt("")).toEqual([]);
  });

  it("skips WEBVTT header", () => {
    const vtt = `WEBVTT

00:00:00.000 --> 00:00:05.000
Hello world`;
    const result = parseVtt(vtt);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      start: 0,
      end: 5,
      name: "Speaker 1",
      text: "Hello world",
    });
  });

  it("parses time range correctly", () => {
    const vtt = `WEBVTT

00:01:30.500 --> 00:01:35.000
Test`;
    const result = parseVtt(vtt);
    expect(result[0].start).toBe(90.5);
    expect(result[0].end).toBe(95);
  });

  it("extracts speaker from [Speaker Name] format", () => {
    const vtt = `WEBVTT

00:00:00.000 --> 00:00:05.000
[김강사] 안녕하세요, 오늘 수업을 시작하겠습니다.`;
    const result = parseVtt(vtt);
    expect(result[0]).toEqual({
      start: 0,
      end: 5,
      name: "김강사",
      text: "안녕하세요, 오늘 수업을 시작하겠습니다.",
    });
  });

  it("handles multiple cues", () => {
    const vtt = `WEBVTT

00:00:00.000 --> 00:00:03.000
First line

00:00:04.000 --> 00:00:07.000
[Student] Second line`;
    const result = parseVtt(vtt);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      start: 0,
      end: 3,
      name: "Speaker 1",
      text: "First line",
    });
    expect(result[1]).toEqual({
      start: 4,
      end: 7,
      name: "Student",
      text: "Second line",
    });
  });

  it("handles CRLF line endings", () => {
    const vtt = "WEBVTT\r\n\r\n00:00:00.000 --> 00:00:01.000\r\nTest";
    const result = parseVtt(vtt);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Test");
  });

  it("uses Speaker 1 as default when no bracket format", () => {
    const vtt = `WEBVTT

00:00:00.000 --> 00:00:02.000
Plain text without speaker`;
    const result = parseVtt(vtt);
    expect(result[0].name).toBe("Speaker 1");
    expect(result[0].text).toBe("Plain text without speaker");
  });
});
