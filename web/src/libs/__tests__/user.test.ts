import { getUsers } from '@/libs/user';
import { apiFetch } from '@/libs/client';

jest.mock('@/libs/client', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('@/schemas/user-schema', () => {
  const parseMock = jest.fn();
  return {
    UserSchema: {
      array: () => ({
        parse: parseMock,
      }),
    },
    __parseMock: parseMock,
  }
});

const { __parseMock: parseMock } = jest.requireMock('@/schemas/user-schema') as {
  __parseMock: jest.Mock;
}

describe('getUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('apiFetch를 올바른 쿼리스트링과 함께 호출한다', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce([]);

    const filter = {
      role: 'STUDENT' as const,
      status: 'ACTIVE' as const,
      firstName: 'John',
      lastName: 'Doe',
    };
    await getUsers(filter);

    const params = new URLSearchParams();
    params.set("role", filter.role);
    params.set("status", filter.status);
    params.set("firstName", filter.firstName);
    params.set("lastName", filter.lastName);
    const queryString = params.toString();

    expect(apiFetch).toHaveBeenCalledWith(`/api/user?${queryString}`);
  });

  it('apiFetch 결과를 UserSchema 배열로 파싱한다', async () => {
    const apiResult = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    ];

    const parsedResult = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
    ];
    
    (apiFetch as jest.Mock).mockResolvedValueOnce(apiResult);
    parseMock.mockReturnValueOnce(parsedResult);
    
    const filter = {
      role: 'TEACHER' as const,
      status: 'INACTIVE' as const,
    };

    const users = await getUsers(filter);

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(parseMock).toHaveBeenCalledWith(apiResult);
    expect(users).toEqual(parsedResult);
  });
});