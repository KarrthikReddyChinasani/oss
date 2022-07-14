import { AxiosRequestConfig } from 'axios';

export const axiosRequestConfiguration: AxiosRequestConfig = {
    baseURL: 'http://localhost:1227/api/v1',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
    },
};