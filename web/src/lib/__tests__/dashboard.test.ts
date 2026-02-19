import api from "@/lib/api";
import {
  getStudyDashboard,
  getTeachDashboard,
} from "@/lib/dashboard";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const validStudyDashboard = {
  nextClass: {
    scheduleId: 1,
    courseTitle: "영어",
    startsAt: "2025-02-20T10:00:00",
    endsAt: "2025-02-20T11:00:00",
    instructorName: "김강사",
    studentName: "이학생",
    meetLink: null,
  },
  stats: {
    activeCourseCount: 2,
    completedClassCount: 5,
  },
  recentSchedules: [],
};

const validTeachDashboard = {
  nextClass: {
    scheduleId: 1,
    courseTitle: "영어",
    startsAt: "2025-02-20T10:00:00",
    endsAt: "2025-02-20T11:00:00",
    instructorName: "김강사",
    studentName: "이학생",
    meetLink: null,
  },
  stats: {
    todayClassCount: 3,
    upcomingClassCount: 5,
  },
  todaySchedules: [],
  recentCompletedSchedules: [],
};

describe("getStudyDashboard", () => {
  it("returns parsed study dashboard when API responds valid data", async () => {
    mockedApi.get.mockResolvedValue({ data: validStudyDashboard });

    const result = await getStudyDashboard();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/v1/study/dashboard");
    expect(result).toEqual(validStudyDashboard);
    expect(result.stats.activeCourseCount).toBe(2);
  });

  it("throws when API returns invalid schema", async () => {
    mockedApi.get.mockResolvedValue({
      data: { nextClass: null, stats: { wrongField: 1 }, recentSchedules: [] },
    });

    await expect(getStudyDashboard()).rejects.toThrow();
  });
});

describe("getTeachDashboard", () => {
  it("returns parsed teach dashboard when API responds valid data", async () => {
    mockedApi.get.mockResolvedValue({ data: validTeachDashboard });

    const result = await getTeachDashboard();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/v1/teach/dashboard");
    expect(result).toEqual(validTeachDashboard);
    expect(result.stats.todayClassCount).toBe(3);
  });

  it("throws with descriptive message when schema validation fails", async () => {
    mockedApi.get.mockResolvedValue({
      data: { nextClass: null, stats: {}, todaySchedules: [] },
    });

    await expect(getTeachDashboard()).rejects.toThrow("대시보드 응답 형식 오류");
  });
});
