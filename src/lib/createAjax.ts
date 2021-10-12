import axios, { AxiosResponse, AxiosRequestConfig, AxiosError, CancelTokenSource } from 'axios';
import { notification, message } from 'antd';
import { isObject } from '@/lib/utils';

export type Options = {
    // 是否自动捕捉错误信息并显示, 默认true
    catchMessage?: Boolean
};

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.method = 'get';
axios.defaults.timeout = 15 * 1000;

// 在发送请求之前做些什么
function interceptRequestSuccess(config: AxiosRequestConfig) {
    return config;
}

// 对请求错误做些什么
function interceptRequestError(error: AxiosError) {
    return Promise.reject(error);
}

// 对响应数据做点什么
function interceptResponeSuccess(response: AxiosResponse) {
    return response;
}

// 对响应错误做点什么
function interceptResponeError(error: AxiosError) {
    return Promise.reject(error);
}

/**
 * @description 创建请求函数
 * @param axiosConfig
 * @returns 
 */
export function createAJAX(axiosConfig?:AxiosRequestConfig) {
    const instance = axios.create(axiosConfig);
    instance.interceptors.request.use(interceptRequestSuccess, interceptRequestError);
    instance.interceptors.response.use(interceptResponeSuccess, interceptResponeError);

    return function ajax(config: AxiosRequestConfig, options:Options = {}) {
            const opt:Options = Object.assign({
                catchMessage: true
            }, options);

            return instance(config)
                .then((res) => {
                    return res.data;
                })
                .then((res) => {
                    const title = isObject(res.message) ? res.message.title : '操作提示';
                    const description = isObject(res.message) ? res.message.content : res.message;

                    if (res.code === 200) {
                        if (description) {
                            message.success(description);
                        }
                        return res.data;
                    }

                    if (opt.catchMessage) {
                        if (description) {
                            notification.error({
                                message: title || '操作提示',
                                description,
                                placement: 'topRight'
                            });
                        }
                    }

                    return Promise.reject(res);;
                })
    }
}

/**
 * @description 创建API实例 
 */
export class CreateAPI {
    static ajax = createAJAX();
    public options: AxiosRequestConfig;
    public source: CancelTokenSource|null = null;

    constructor(options: AxiosRequestConfig) {
        this.options = options;
    }

    request(data: any = {}, options?: Options) {
        this.source = axios.CancelToken.source();
        const config: AxiosRequestConfig = {
            ...this.options,
            cancelToken: this.source.token
        };
        config[config.method === 'post' ? 'data' : 'params'] = data;
        return CreateAPI.ajax(config, options);
    }

    cancel(message?:string) {
        this.source && this.source.cancel(message);
    }
}