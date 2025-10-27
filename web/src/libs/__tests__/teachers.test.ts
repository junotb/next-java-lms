import { getTeachers } from '@/libs/teachers';
import { apiFetch } from '@/libs/client';

jest.mock('@/libs/client', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('@/types/teacher', () => {
  const parseMock = jest.fn();
  return {
    TeacherSchema: {
      array: () => ({
        parse: parseMock,
      }),
    },
    __parseMock: parseMock,
  }
});

const { __parseMock: parseMock } = jest.requireMock('@/types/teacher') as {
  __parseMock: jest.Mock;
}

type Teacher = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
};

describe('getTeachers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('apiFetch 결과를 스키마로 파싱해 반환한다 (성공 경로)', async () => {
    const raw: unknown = [
      { email: 'a@ex.com', firstName: 'A', lastName: 'B' },
      { email: 'c@ex.com', firstName: 'C', lastName: 'D' },
    ];
    const parsed: Teacher[] = [
      { email: 'a@ex.com', firstName: 'A', lastName: 'B' },
      { email: 'c@ex.com', firstName: 'C', lastName: 'D' },
    ];

    (apiFetch as jest.Mock).mockResolvedValueOnce(raw);
    (parseMock as jest.Mock).mockReturnValueOnce(parsed);

    const result = await getTeachers();

    expect(apiFetch).toHaveBeenCalledWith('/api/teachers');
    expect(parseMock).toHaveBeenCalledWith(raw);
    expect(result).toEqual(parsed);
  })

  it('스키마 파싱에 실패하면 에러를 전파한다', async () => {
    const raw: unknown = [{ email: 'not-an-email' }];
    (apiFetch as jest.Mock).mockResolvedValueOnce(raw);
    (parseMock as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid teachers payload');
    });

    await expect(getTeachers()).rejects.toThrow('Invalid teachers payload');
    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(parseMock).toHaveBeenCalledTimes(1);
  })

  it('apiFetch가 실패하면 에러를 전파한다', async () => {
    (apiFetch as jest.Mock).mockRejectedValueOnce(new Error('Network down'));

    await expect(getTeachers()).rejects.toThrow('Network down');
    expect(parseMock).not.toHaveBeenCalled();
  });
});
