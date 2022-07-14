import axios, { AxiosRequestConfig, AxiosInstance, AxiosPromise } from 'axios';

const initialization = (config: AxiosRequestConfig): AxiosInstance => {
    const axiosInstance = axios.create(config);
    const authKey = localStorage.getItem('authKey');
    /*
        Add default headers, interceptors etc..
    */
        axiosInstance.interceptors.request.use((reqConfig) => {
            reqConfig.headers.auth = authKey;
            return reqConfig;
        })

        axiosInstance.interceptors.response.use((resConfig) => {
            localStorage.setItem('authKey', resConfig.headers.auth);
            return resConfig;
        })

    return axiosInstance;
};

export default initialization;