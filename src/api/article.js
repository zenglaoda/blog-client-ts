import { createAPI } from '@/lib/createAPI';
export default createAPI({
    baseURL: '',
    prefix: '/api/article',
    apis: {
        create: {
            url: '/create',
            method: 'post',
        },
        update: {
            url: '/update',
            method: 'post',
        },
        updateStatus: {
            url: '/updateStatus',
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
        },
        getDraftList: {
            url: '/getDraftList'
        }
    }
});