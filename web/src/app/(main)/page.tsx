import UserList from "@/components/user/UserList";
import { userList } from "@/libs/user";

export default async function HomePage() {
  const users = await userList();

  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="max-w-5xl w-full mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            환영합니다, 학생 여러분!
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/70">
            최고의 강사진과 함께 학습 여정을 시작하세요.
          </p>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="max-w-5xl w-full mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold">강사 목록</h1>
          <UserList users={users} basePath="/user" />
        </div>
      </section>
    </div>
  );
}
