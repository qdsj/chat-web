import {
  accessAuth,
  checkResponseToken,
  getAuthToken,
  getRefreshToken,
} from "./util";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getTwoToken = () => {
  const token = getAuthToken();
  const refreshToken = getRefreshToken();
  return { token, refreshToken };
};
const fetchApi = (
  url: string,
  options: RequestInit & { isNeedResponse?: boolean }
) => {
  const { token, refreshToken } = getTwoToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  if (refreshToken) {
    options.headers = {
      ...options.headers,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }

  return fetch(baseUrl + url, options).then(async (res) => {
    if (res.status >= 200 && res.status < 400) {
      // 检查响应头中是否有token
      checkResponseToken(res);
      if (options.isNeedResponse) return res;
      return res.json();
    }
    if (res.status === 403) {
      // 跳转登录页面，获取权限
      accessAuth(res);
    }
    throw (await res.json()).message;
  });
};

const postFetch = (
  url: string,
  data: Record<string, any>,
  options?: { isNeedResponse?: boolean }
) => {
  return fetchApi(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });
};

const getFetch = (url: string) => {
  return fetchApi(url, { method: "GET" });
};

export { getFetch, postFetch };
