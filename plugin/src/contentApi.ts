import axios from 'utils/axios';

const getContentApi = async (projectId: string, params: any) => {
    const { data } = await axios.get(`project/${projectId}`, {
        params
    });
    return data;
}

export { getContentApi };