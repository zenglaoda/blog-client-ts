import  { CreateAPI } from '@/lib/createAjax';

const prefix = '/api/relation';

export function getRelationListAPI() {
    return new CreateAPI({
        url: `${prefix}/getList`
    });
}

// export default createAPI({
//     baseURL: '',
//     prefix: '/api/relation',
//     apis: {
//         getList: {
//             url: '/getList'
//         }
//     }
// });