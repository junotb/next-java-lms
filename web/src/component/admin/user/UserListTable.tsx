import { User } from "@/schema/user/user";

interface UserListTableProps {
  users: User[];
  onUpdate: (userId: number) => void;
}

export default function UserListTable({ users, onUpdate }: UserListTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            이름
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
          >
            역할
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
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {user.lastName} {user.firstName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.role}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  user.status === "ACTIVE"
                    ? "px-4 py-2 bg-green-100 text-green-800"
                    : "px-4 py-2 bg-red-100 text-red-800"
                }`}
              >
                {user.status === "ACTIVE" ? "활성" : "비활성"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button
                onClick={() => onUpdate(user.id)}
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