import { TeacherSchema } from '@/types/teacher';

describe('TeacherSchema', () => {
  it('유효한 데이터는 통과시킨다', () => {
    const valid = {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
    };

    const parsed = TeacherSchema.parse(valid);
    expect(parsed).toEqual(valid);
  });

  it('id가 없어도 통과시킨다.', () => {
    const valid = {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
    };

    const parsed = TeacherSchema.parse(valid);
    expect(parsed).toEqual(valid);
  });

  it('firstName이 비어 있으면 에러를 던진다', () => {
    const invalid = {
      firstName: '',
      lastName: 'Smith',
      email: 'bob@example.com',
    };

    expect(() => TeacherSchema.parse(invalid)).toThrow();
  })

  it('lastName이 비어 있으면 에러를 던진다', () => {
    const invalid = {
      firstName: 'Bob',
      lastName: '',
      email: 'bob@example.com',
    };

    expect(() => TeacherSchema.parse(invalid)).toThrow();
  });

  it('email 형식이 잘못되면 에러를 던진다', () => {
    const invalid = {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'not-an-email',
    };

    expect(() => TeacherSchema.parse(invalid)).toThrow();
  });
});
