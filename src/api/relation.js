import { createAPI } from '@/lib/createAPI';
export default createAPI({
    baseURL: '',
    prefix: '/api/relation',
    apis: {
        getList: {
            url: '/getList'
        }
    }
});