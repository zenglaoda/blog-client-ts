import axios from 'axios';
import { message } from 'antd';

// 在发送请求之前做些什么
function interceptRequestSuccess(config) {
    return config;
}
// 对请求错误做些什么
function interceptRequestError(error) {
    return Promise.reject(error);
}
// 对响应数据做点什么
function interceptResponeSuccess(response) {
    return response.data;
}
// 对响应错误做点什么
function interceptResponeError(error) {
    if (error.response) {
        return Promise.reject(error);
    }
    message.error(error.message)
    return Promise.reject(error.message);
}

axios.interceptors.request.use(interceptRequestSuccess, interceptRequestError);
axios.interceptors.response.use(interceptResponeSuccess, interceptResponeError);

export default axios;