import api from '../api';

/**
 * API Client 단위 테스트
 * 쿠키 기반 인증으로 전환 후 Bearer Token 추출 로직이 제거되었는지 확인합니다.
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
    it('should not have request interceptors that set Authorization header', () => {
      // Bearer Token 추출 로직이 제거되었으므로
      // 요청 인터셉터가 없거나 Authorization 헤더를 설정하지 않아야 함
      const requestInterceptors = api.interceptors.request.handlers;
      
      // 요청 인터셉터가 없거나, Authorization 헤더를 설정하지 않는지 확인
      if (requestInterceptors.length > 0) {
        // 인터셉터가 있다면 Authorization 헤더를 설정하지 않는지 확인
        // 실제로는 인터셉터가 없어야 함 (Bearer Token 로직 제거됨)
        expect(requestInterceptors.length).toBe(0);
      } else {
        // 인터셉터가 없는 것이 정상 (Bearer Token 로직 제거됨)
        expect(requestInterceptors.length).toBe(0);
      }
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
