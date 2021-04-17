import  { CreateAPI } from '@/lib/createAjax';
import { createAPI } from '@/lib/createAPI';

const prefix = '/api/link';

export function createLinkAPI() {
    return new CreateAPI({
        url: `${prefix}/create`,
        method: 'post', 
    });
}

export function updateLinkAPI() {
    return new CreateAPI({
        url: `${prefix}/update`,
        method: 'post'
    });
}

export function destroyLinkAPI() {
    return new CreateAPI({
        url: `${prefix}/destroy`,
        method: 'post'
    });
}

export function getLinkListAPI() {
    return new CreateAPI({
        url: `${prefix}/getList`,
    });
}

export function getLinkItemAPI() {
    return new CreateAPI({
        url: `${prefix}/getItem`,
    });
}

/** 
 * @deprecated 将要被遗弃
*/
export default createAPI({
    baseURL: '',
    prefix: '/api/link',
    apis: {
        create: {
            url: '/create',
            method: 'post',
        },
        update: {
            url: '/update',
            method: 'post',
        },
        destroy: {
            url: '/destroy',
            method: 'post',
        },
        getList: {
            url: '/getList',
        },
        getItem: {
            url: '/getItem'
        }
    }
});