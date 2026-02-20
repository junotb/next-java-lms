import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  findCandidates,
  getCourseListForRegistration,
  registerCourse,
} from "@/lib/registration-api";
import {
  useCourseList,
  useFindCandidates,
  useRegisterCourse,
} from "../useRegistration";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

jest.mock("@/lib/registration-api", () => ({
  getCourseListForRegistration: jest.fn(),
  findCandidates: jest.fn(),
  registerCourse: jest.fn(),
}));

const mockGetCourseList = getCourseListForRegistration as jest.Mock;
const mockFindCandidates = findCandidates as jest.Mock;
const mockRegisterCourse = registerCourse as jest.Mock;

describe("useCourseList", () => {
  beforeEach(() => {
    mockGetCourseList.mockResolvedValue([
      { id: 1, title: "영어", status: "ACTIVE" },
    ]);
  });

  it("fetches course list on mount", async () => {
    const { result } = renderHook(() => useCourseList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetCourseList).toHaveBeenCalledWith({
      status: "ACTIVE",
      size: 100,
    });
    expect(result.current.data).toEqual([
      { id: 1, title: "영어", status: "ACTIVE" },
    ]);
  });
});

describe("useFindCandidates", () => {
  beforeEach(() => {
    mockFindCandidates.mockResolvedValue([
      { id: "t1", name: "김강사", availableSlots: [] },
    ]);
  });

  it("does not fetch when enabled is false", async () => {
    const params = {
      days: ["MONDAY"],
      startTime: "10:00",
      durationMinutes: 60,
    };
    const { result } = renderHook(
      () => useFindCandidates(params, false),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    expect(mockFindCandidates).not.toHaveBeenCalled();
  });

  it("fetches candidates when enabled and params valid", async () => {
    const params = {
      days: ["MONDAY", "WEDNESDAY"],
      startTime: "10:00",
      durationMinutes: 60,
    };
    const { result } = renderHook(
      () => useFindCandidates(params, true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFindCandidates).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual([
      { id: "t1", name: "김강사", availableSlots: [] },
    ]);
  });
});

describe("useRegisterCourse", () => {
  beforeEach(() => {
    mockRegisterCourse.mockResolvedValue({
      id: "reg1",
      status: "PENDING",
    });
  });

  it("mutates with payload and invalidates candidates", async () => {
    const invalidateSpy = jest.fn();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    queryClient.invalidateQueries = invalidateSpy;

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useRegisterCourse(), { wrapper });

    const payload = {
      courseId: 1,
      months: 3,
      days: ["MONDAY"],
      startTime: "10:00",
      durationMinutes: 60,
    };

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockRegisterCourse).toHaveBeenCalledWith(payload);
    expect(result.current.data).toEqual({ id: "reg1", status: "PENDING" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["teachers", "candidates"] });
  });
});
