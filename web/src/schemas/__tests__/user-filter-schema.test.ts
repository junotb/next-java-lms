import { UserFilterSchema } from "@/schemas/user-filter-schema";

describe('UserFilterSchema', () => {
  it('유효한 데이터는 통과시킨다', () => {
    const valid = {
      role: "TEACHER",
      firstName: "Alice",
      lastName: "Johnson",
      status: "ACTIVE",
    };

    const parsed = UserFilterSchema.parse(valid);
    expect(parsed).toEqual(valid);
  });

  it('role이 없으면 에러를 던진다', () => {
    const invalid = {
      firstName: "Bob",
      lastName: "Smith",
      status: "INACTIVE",
    };

    expect(() => UserFilterSchema.parse(invalid)).toThrow();
  });

  it('status가 없으면 에러를 던진다', () => {
    const invalid = {
      role: "STUDENT",
      firstName: "Charlie",
      lastName: "Brown",
    };

    expect(() => UserFilterSchema.parse(invalid)).toThrow();
  });
});
    