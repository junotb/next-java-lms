"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CourseStats from "@/component/admin/course/CourseStats";
import CourseListForm from "@/component/admin/course/CourseListForm";
import CourseInfoCard from "@/component/admin/course/CourseInfoCard";
import CourseListTable from "@/component/admin/course/CourseListTable";
import Loader from "@/component/common/Loader";
import Modal from "@/component/common/Modal";
import { useCourseList, useCourseDelete } from "@/hook/admin/useCourse";
import { CourseListRequest } from "@/schema/course/course";
import { Button } from "@/component/ui/button";

export default function AdminCoursesPage() {
  const [request, setRequest] = useState<CourseListRequest>({
    title: undefined,
    status: undefined,
  });

  const [courseId, setCourseId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: courses, isLoading, error } = useCourseList(request);
  const deleteMutation = useCourseDelete();

  const updateRequest = (newRequest: CourseListRequest) =>
    setRequest(newRequest);

  const openCreateModal = () => {
    setCourseId(null);
    setIsModalOpen(true);
  };

  const openUpdateModal = (id: number) => {
    setCourseId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCourseId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              강의 관리
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              교육 콘텐츠를 검색하고 관리합니다.
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={openCreateModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>강의 추가</span>
          </Button>
        </header>

        <section className="w-full">
          <CourseStats />
        </section>

        <div className="w-full">
          <CourseListForm onSubmit={updateRequest} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p className="text-center text-destructive">
              강의 목록을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : courses?.length ? (
            <CourseListTable
              courses={courses ?? []}
              onUpdate={openUpdateModal}
              onDelete={handleDelete}
            />
          ) : (
            <p className="text-center text-muted-foreground">강의가 없습니다.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <CourseInfoCard courseId={courseId} onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}
