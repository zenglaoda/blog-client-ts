import  { CreateAPI } from '@/lib/createAjax';

const prefix = '/api/tag';

export function getTagListAPI() {
    return new CreateAPI({
        url: `${prefix}/getList`,
    });
}

export function getTagItemAPI() {
    return new CreateAPI({
        url: `${prefix}/getItem`
    });
}

export function destroyTagAPI() {
    return new CreateAPI({
        url: `${prefix}/destroy`,
        method: 'post',
    });
}

export function updateTagAPI() {
    return new CreateAPI({
        url: `${prefix}/update`,
        method: 'post',
    });
}

export function createTagAPI() {
    return new CreateAPI({
        url: `${prefix}/create`,
        method: 'post',
    });  
}


// export default createAPI({
//     baseURL: '',
//     prefix: '/api/tag',
//     apis: {
//         create: {
//             url: '/create',
//             method: 'post',
//         },
//         update: {
//             url: '/update',
//             method: 'post',
//         },
//         destroy: {
//             url: '/destroy',
//             method: 'post',
//         },
//         getList: {
//             url: '/getList',
//         },
//         getItem: {
//             url: '/getItem'
//         }
//     }
// });