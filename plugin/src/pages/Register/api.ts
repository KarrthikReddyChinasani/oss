import axios from 'utils/axios';

const postLoginApi = async (params: any) => {
    const { data } = await axios.post('auth/login', params);
    return data;
}

export { postLoginApi };