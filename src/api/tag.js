import { createAPI } from '@/lib/createAPI';
export default createAPI({
    baseURL: '',
    prefix: '/api/tag',
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