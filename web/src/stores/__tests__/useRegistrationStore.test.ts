import { act, renderHook } from "@testing-library/react";
import { useRegistrationStore } from "../useRegistrationStore";

beforeEach(() => {
  useRegistrationStore.getState().reset();
});

describe("useRegistrationStore", () => {
  it("has initial step 1 and empty formData", () => {
    const { result } = renderHook(() => useRegistrationStore());

    expect(result.current.step).toBe(1);
    expect(result.current.formData).toEqual({});
  });

  it("setStep updates step", () => {
    const { result } = renderHook(() => useRegistrationStore());

    act(() => {
      result.current.setStep(2);
    });
    expect(result.current.step).toBe(2);

    act(() => {
      result.current.setStep(4);
    });
    expect(result.current.step).toBe(4);
  });

  it("updateFormData merges partial data", () => {
    const { result } = renderHook(() => useRegistrationStore());

    act(() => {
      result.current.updateFormData({ courseId: 1, months: 3 });
    });
    expect(result.current.formData).toEqual({ courseId: 1, months: 3 });

    act(() => {
      result.current.updateFormData({ days: ["MONDAY", "WEDNESDAY"] });
    });
    expect(result.current.formData).toEqual({
      courseId: 1,
      months: 3,
      days: ["MONDAY", "WEDNESDAY"],
    });
  });

  it("updateFormData overwrites same keys", () => {
    const { result } = renderHook(() => useRegistrationStore());

    act(() => {
      result.current.updateFormData({ courseId: 1 });
    });
    act(() => {
      result.current.updateFormData({ courseId: 2 });
    });
    expect(result.current.formData.courseId).toBe(2);
  });

  it("reset clears step and formData to initial state", () => {
    const { result } = renderHook(() => useRegistrationStore());

    act(() => {
      result.current.setStep(3);
      result.current.updateFormData({
        courseId: 1,
        months: 6,
        days: ["TUESDAY"],
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.step).toBe(1);
    expect(result.current.formData).toEqual({});
  });
});
