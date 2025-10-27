"use client";

import TeacherCard from "@/components/teachers/TeacherCard";
import { Teacher } from "@/types/teacher";

type Props = {
  teachers: Teacher[];
  basePath: string;
};

export default function TeacherList({ teachers, basePath }: Props) {
  return (
    <section>
      {teachers.length === 0 && (
        <div className="text-sm text-gray-500">결과가 없습니다.</div>
      )}
  
      {teachers.length > 0 && (
        <div
          role="list"
          className="flex flex-wrap gap-4 justify-center items-stretch"
        >
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.email} href={`${basePath}/${teacher.email}`} email={teacher.email} firstName={teacher.firstName} lastName={teacher.lastName} />
          ))}
        </div>
      )}
    </section>
  );
}
