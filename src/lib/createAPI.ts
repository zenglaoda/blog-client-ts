import axios from 'axios';
import { message, notification } from 'antd';
import { isObject } from './utils';

export function createAPI(scheme) {
    const baseURL = scheme.baseURL || 'http://127.0.0.1:3000';
    const prefix = scheme.prefix || '';
    const apis = scheme.apis || {};
    const https = {};
    Object.keys(apis).forEach((key) => {
        const apiItem = apis[key];
        const method = apiItem.method || 'get';
        const url = [baseURL, prefix, apiItem.url].join('');

        function http(data, axiosConfig = {}, options = {}) {
            const config = Object.assign({
                method,
                url,
                timeout: 6 * 1000
            }, axiosConfig);

            const opt = Object.assign({
                catch: true
            }, options);

            if (method === 'get') {
                config.params = data;
            }
            if (method === 'post') {
                config.data = data;
            }
            
            return axios(config)
                .then((Response) => {
                    return Response.data;
                })
                .then((res) => {
                    const title = isObject(res.message) ? res.message.title : '';
                    const description = isObject(res.message) ? res.message.content : res.message;
                    if (res.code === 200) {
                        if (description) {
                            message.success(description);
                        }
                        return res.data;
                    }

                    if (opt.catch) {
                        notification.error({
                            message: title || '操作提示',
                            description,
                            placement: 'topRight'
                        });
                    } 
                    return Promise.reject(res);;
                });
        }
        https[key] = http;
    });
    return https;
}

