import { type JWTToken } from '@coze/api';

const baseServerURL = 'http://localhost:8080';

const useTokenWithJWT = () => {
  const getJWTToken = async (): Promise<JWTToken> => {
    const res = await fetch(`${baseServerURL}/token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to get jwt token: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data as JWTToken;
  };

  const getToken = async (): Promise<string> => {
    try {
      // 1. 获取本地存储中的 token
      const tokenData = JSON.parse(
        localStorage.getItem('jwt_token') || '{}',
      ) as JWTToken;

      // 2. 检查是否存在有效 token
      if (
        tokenData.access_token &&
        tokenData.expires_in > Math.floor(Date.now() / 1000)
      ) {
        return tokenData.access_token;
      }

      // 3. 请求新 token
      const jwtToken = await getJWTToken();

      // 4. 存储到本地
      localStorage.setItem('jwt_token', JSON.stringify(jwtToken));

      // 5. 返回新 token
      return jwtToken.access_token;
    } catch (error) {
      console.error('Failed to get token with jwt:', error);
      localStorage.removeItem('jwt_token');
      throw error;
    }
  };

  return {
    getToken,
  };
};

export { useTokenWithJWT };