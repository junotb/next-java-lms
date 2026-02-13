import api from '../api';

jest.mock('@/lib/auth-client', () => ({
  authClient: {
    getSession: jest.fn().mockResolvedValue({ data: null }),
  },
}));

/**
 * API Client 단위 테스트
 * 프로덕션 크로스 오리진 환경에서 Bearer 토큰으로 인증합니다.
 */
describe('API Client', () => {
  describe('Axios 설정', () => {
    it('should have withCredentials set to true', () => {
      expect(api.defaults.withCredentials).toBe(true);
    });

    it('should have Content-Type header set to application/json', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have baseURL configured', () => {
      expect(api.defaults.baseURL).toBeDefined();
    });
  });

  describe('요청 인터셉터', () => {
    it('should have request interceptor for Bearer token', () => {
      const requestInterceptors = api.interceptors.request.handlers;
      expect(requestInterceptors.length).toBeGreaterThan(0);
    });
  });

  describe('응답 인터셉터', () => {
    it('should have response interceptor for error handling', () => {
      const responseInterceptors = api.interceptors.response.handlers;
      expect(responseInterceptors.length).toBeGreaterThan(0);
    });
  });

  describe('쿠키 자동 전송', () => {
    it('should be configured to send cookies automatically', () => {
      // withCredentials: true로 설정되어 있으면
      // 브라우저가 자동으로 쿠키를 전송함
      expect(api.defaults.withCredentials).toBe(true);
    });
  });
});
