import { act, renderHook } from "@testing-library/react";
import { formatRemainingTime } from "@/lib/countdown";
import { useCountdown } from "../useCountdown";

jest.mock("@/lib/countdown", () => ({
  formatRemainingTime: jest.fn(),
}));

const mockFormatRemainingTime = formatRemainingTime as jest.Mock;

describe("useCountdown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFormatRemainingTime.mockReturnValue("01:30:00");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("returns initial value from formatRemainingTime", () => {
    mockFormatRemainingTime.mockReturnValue("02:15:30");

    const { result } = renderHook(() => useCountdown("2025-02-20T15:00:00Z"));

    expect(result.current).toBe("02:15:30");
  });

  it("updates every second via setInterval", () => {
    mockFormatRemainingTime.mockReturnValue("00:59:58");

    const { result } = renderHook(() => useCountdown("2025-02-20T15:00:00Z"));

    expect(result.current).toBe("00:59:58");

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockFormatRemainingTime).toHaveBeenCalled();
    expect(result.current).toBe("00:59:58");
  });

  it("calls formatRemainingTime with endsAt", () => {
    const endsAt = "2025-02-20T18:30:00Z";
    renderHook(() => useCountdown(endsAt));

    expect(mockFormatRemainingTime).toHaveBeenCalledWith(endsAt);
  });

  it("clears interval on unmount", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const { unmount } = renderHook(() =>
      useCountdown("2025-02-20T15:00:00Z")
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
