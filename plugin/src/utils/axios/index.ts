import initializeAxios from './axiosSetup';
import { axiosRequestConfiguration } from './config';

const axiosInstance = initializeAxios(axiosRequestConfiguration);

export default axiosInstance;