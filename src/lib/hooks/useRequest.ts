import { useState, useEffect } from 'react';

interface CallbackResult {
    // 请求方法
    request(...args:any[]):Promise<any>;
    // 取消请求的方法
    cancel(message?:string): void;
};
interface Options {
    // 组件卸载时是否自动中断请求,默认true
    unmountAbort?: Boolean;
}


/**
 * @description 包裹API接口: 返回调用执行函数，取消方法，执行状态，错误信息
 */
export default function useRequest(callback: () => CallbackResult, options:Options = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error|null>(null);
    let API:CallbackResult;
    // 防止组件在销毁之后继续执行更新操作
    let actived = true;

    options = Object.assign({
        unmountAbort: true
    }, options);

    function cancel() {
        options.unmountAbort && API && API.cancel();
    }

    function wrapper(...args:any[]) {
        API = callback();
        actived && setLoading(true);
        return API.request(...args)
            .then((res) => {
                actived && setError(null);
                return res;
            })
            .catch((err) => {
                actived && setError(err);
                throw err;
            })
            .finally(() => {
                actived && setLoading(false);
            });
    }

    wrapper.cancel = cancel;
    wrapper.loading = loading;
    wrapper.setLoading = setLoading;
    wrapper.error = error;
    wrapper.setError = setError;

    useEffect(() => {
        return () => {
            actived = false;
            cancel();
        };
    }, [callback]);

    return wrapper;
}