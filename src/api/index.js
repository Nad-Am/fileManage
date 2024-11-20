import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

const myApi = axios.create({
    baseURL: 'http://127.0.0.1:5173',
    timeout: 10000,
});

myApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED' && error.message.startsWith('timeout')) {
            return Promise.reject("请求超时，请稍后重试");
        }
        const status = error.response?.status;
        const message = error.response?.data?.message || "系统出错，请尝试重新登录";
        ElMessage.error(`[${status}] ${message}`);
        return Promise.reject(error);
    }
);

export const DoAxios = async (path, method, requestInfo, withToken) => {
    const requestConfig = {
        url: path,
        method,
    };

    if (withToken) {
        const userStore = useUserStore();
        const token = userStore.userToken;
        if (!token) {
            throw "Token 为空，请先登录";
        }
        requestConfig['headers'] = {
            'sa-token-authorization': token,
        };
    }

    if (['get', 'delete'].includes(method)) {
        requestConfig['params'] = requestInfo;
    } else {
        requestConfig['data'] = requestInfo;
    }

    let resp;

    try {
        resp = await myApi(requestConfig);
    } catch (error) {
        throw `API 请求失败：${error}`;
    }

    const data = resp.data;
    if (!data.success) {
        throw data.message || '未知错误';
    }

    return data;
};

export default myApi;
