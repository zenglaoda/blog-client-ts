type Key = string | number;
type Maps = {
    [prop:string]: any
}

/**
 * @description 获取类型
 * @param {any} param
 * @return {string} 
 */
export function getType(param:any) {
    return Object.prototype.toString.call(param).toLocaleLowerCase().slice(8, -1);
}

/**
 * @description 是否是对象类型
 * @param {any} param 
 * @returns {boolean}
 */
export function isObject(param:any) {
    return getType(param) === 'object';
}

/**
 * @description 获取地址栏参数 
 * @param {string} url
 * @returns {object} 
 */
export function parseQuery(url:string) {
    if (typeof url !== 'string' || url.indexOf('?') < 0) {
        return {};
    }
    const index = url.indexOf('?');
    const queryString = decodeURIComponent(url.slice(index + 1))
    const query: Maps = {};
    queryString.split('&').map(ele => ele.split('=')).forEach(ele => query[ele[0]]=ele[1]);
    return query;    
}

/**
 * @description 系列化get请求参数
 * @param {object} data 
 * @returns {string}
 */
export function stringifyQuery(data: Maps = {}) {
    const arr: string[] = [];
    Object.keys(data).forEach((key) => {
        arr.push(`${key}=${encodeURIComponent(data[key])}`);
    });
    if (arr.length) {
        return `?${arr.join('&')}`;
    }
    return '';
}

/**
 * @description 比较两个数组之间的差异 
 */
export function compareIds<T=Key>(fresh: T[], origin: T[]):T[][] {
    const summer = [...(new Set(origin.concat(fresh)))];
    const originSet = new Set(origin);
    const freshSet = new Set(fresh);
    const adds:T[] = [];
    const dels:T[] = [];
    summer.forEach(ele => {
        if (originSet.has(ele) && !freshSet.has(ele)) {
            dels.push(ele);
        }
        if (!originSet.has(ele) && freshSet.has(ele)) {
            adds.push(ele);
        }
    });
    return [adds, dels];
}

/**
 * @description 找出两个对象中不一样的键值组成一个新的对象
 * 
 */
export function getChangedData(fresh: Maps, origin: Maps, keys:string[] = []) {
    if (!keys.length) {
        keys = [
            ...Object.keys(fresh),
            ...Object.keys(origin)
        ];
    }
    keys = [...new Set(keys)];
    let diffs:Maps|undefined;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (fresh[key] !== origin[key]) {
            diffs = diffs || {};
            diffs[key] = fresh[key];
        }
    }
    return diffs;
}