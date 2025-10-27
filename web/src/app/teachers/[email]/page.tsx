interface Props {
  params: {
    email: string;
  };
}

export default async function TeacherPage({ params }: Props) {
  const { email } = params;

  return (
    <main className="flex min-h-screen flex-col gap-8 justify-center items-center">
      <h1 className="text-2xl font-semibold">강사: {decodeURIComponent(email)}</h1>
    </main>
  );
}
