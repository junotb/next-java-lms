export default async function AdminPage() {
  return (
    <div className="w-full py-24 lg:py-32 bg-background">
      <div className="max-w-5xl w-full mx-auto px-4 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          대시보드
        </h1>
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 w-full">
          <li className="flex flex-col justify-center items-center border p-4 w-full rounded-xl">
            <p>학생 수</p>
            <p><span>150</span>명</p>
          </li>
          <li className="flex flex-col justify-center items-center border p-4 w-full rounded-xl">
            <p>강사 수</p>
            <p><span>25</span>명</p>
          </li>
          <li className="flex flex-col justify-center items-center border p-4 w-full rounded-xl">
            <p>수업 수</p>
            <p><span>40</span>개</p>
          </li>
          <li className="flex flex-col justify-center items-center border p-4 w-full rounded-xl">
            <p>피드백 수</p>
            <p><span>10</span>개</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
