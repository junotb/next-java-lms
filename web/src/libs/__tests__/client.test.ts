// src/libs/apiFetch.test.ts
import { apiFetch } from '@/libs/client';

describe('apiFetch', () => {
  const origin = 'https://example.com';

  beforeEach(() => {
    process.env.BACKEND_ORIGIN = origin;
    global.fetch = jest.fn();
  });

  it('성공 시 JSON 데이터를 반환한다', async () => {
    const mockData = { message: 'ok' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await apiFetch<{ message: string }>('/test');
    expect(result).toEqual(mockData);
  });

  it('실패 시 에러를 던진다', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(apiFetch('/fail')).rejects.toThrow('API 404 Not Found');
  });
});
