export function getType(param) {
    return Object.prototype.toString.call(param).toLocaleLowerCase().slice(8, -1);
}

export function isObject(param) {
    return getType(param) === 'object';
}

export function parseQuery(url) {
    if (typeof url !== 'string' || url.indexOf('?') < 0) {
        return {};
    }
    const index = url.indexOf('?');
    const queryString = decodeURIComponent(url.slice(index + 1))
    const query = {};
    queryString.split('&').map(ele => ele.split('=')).forEach(ele => query[ele[0]]=ele[1]);
    return query;    
}

/**
 * @description 系列化get请求参数
 * @param {*} data 
 */
export function queryStringify(data = {}) {
    const arr = [];
    Object.keys(data).forEach((key) => {
        arr.push(`${key}=${encodeURIComponent(data[key])}`);
    });
    return arr.join('&');
}

/**
 * @description 比较两个数组之间的差异 
 * @param {array} fresh 新数组
 * @param {array} origin 旧数组
 */
export function compareIds(fresh, origin) {
    const summer = [...(new Set(origin.concat(fresh)))];
    const originSet = new Set(origin);
    const freshSet = new Set(fresh);
    const adds = [];
    const dels = [];
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

export default {
    parseQuery,
    getType,
    isObject,
    queryStringify
};