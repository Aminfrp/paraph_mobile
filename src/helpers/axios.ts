import axios, {
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {createRef} from 'react';
import toastAndroid from '../components/toastAndroid';
import {SERVER_URL} from '../config/APIConfig';
import logout from './logout';
import refreshTokenHandler from './refreshTokenHandler';
import {getAccessToken, onAuthorizeError, onServerInternalError} from './utils';

export const cancelTokenSource: any = createRef();

// @ts-ignore
cancelTokenSource.current = axios.CancelToken.source();

interface OptionsModel {
  headers?: AxiosRequestHeaders | {};
  data?: {};
  needAccessToken?: boolean;
  podService?: boolean;
  coreService?: boolean;
}

const defaultOptions: OptionsModel = {
  headers: {},
  data: {},
  needAccessToken: false,
  podService: false,
  coreService: false,
};

const ApiCaller = (options = defaultOptions) => {
  const axiosInstance = axios.create({
    headers: {
      ...options?.headers,
    },
    data: {
      ...options?.data,
    },
    responseType: 'json',
    cancelToken: cancelTokenSource.current && cancelTokenSource.current.token,
  });

  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<any> => {
      if (config.url !== `${SERVER_URL}api/auth/refresh_token`)
        await refreshTokenHandler();

      if (options && options.needAccessToken) {
        const accessToken = await getAccessToken();

        if (options.data) config.data = options.data;
        if (accessToken) {
          if (options.podService) {
            if (options.coreService) {
              config.headers['_token_'] = accessToken;
              config.headers['_token_issuer_'] = '1';
            } else {
              config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
          } else {
            config.headers['access-token'] = accessToken;
          }
        } else {
          onAuthorizeError();
          return;
        }
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const {response} = error;

      if (response && response.status && response.status === 401) {
        // onAuthorizeError();
      } else if (response && response.status && response.status === 403) {
        // onAuthorizeError();
        toastAndroid('زمان دسترسی شما به پایان رسید', 'long');
        logout().then(null);
      } else if (response && response.status && response.status >= 500) {
        onServerInternalError();
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export const RadApiCaller = (options = defaultOptions) => {
  const axiosInstance = axios.create({
    headers: {
      ...options?.headers,
    },
    data: {
      ...options?.data,
    },
    responseType: 'json',
  });

  axiosInstance.interceptors.request.use(
    async config => {
      if (options) {
        if (options.data) config.data = options.data;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const {response} = error;

      if (response && response.status && response.status === 401) {
        onAuthorizeError();
      } else if (response && response.status && response.status >= 500) {
        onServerInternalError();
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export type ApiResponseModel<T> = AxiosResponse<T>;

export default ApiCaller;
