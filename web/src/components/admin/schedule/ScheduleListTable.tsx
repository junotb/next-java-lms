import { Schedule } from "@/schemas/schedule";

interface ScheduleListTableProps {
  schedules: Schedule[];
  onUpdate: (scheduleId: number) => void;
}

export default function ScheduleListTable({ schedules, onUpdate }: ScheduleListTableProps) {
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      SCHEDULED: "예정됨",
      ATTENDED: "출석",
      ABSENT: "결석",
      CANCELLED: "취소됨",
    };
    return statusMap[status] || "알 수 없음";
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            사용자 고유번호
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            시작 시간
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            종료 시간
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            상태
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {schedule.userId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {schedule.startsAt}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {schedule.endsAt}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  schedule.status === "SCHEDULED"
                    ? "px-4 py-2 bg-green-100 text-green-800"
                    : schedule.status === "ATTENDED"
                      ? "px-4 py-2 bg-blue-100 text-blue-800"
                      : "px-4 py-2 bg-red-100 text-red-800"
                }`}
              >
                {getStatusLabel(schedule.status)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button
                onClick={() => onUpdate(schedule.id)}
                className="border border-blue-600 bg-blue-600 text-white px-2 lg:px-4 py-2 text-sm rounded-md hover:bg-blue-700 cursor-pointer"
              >
                수정
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}