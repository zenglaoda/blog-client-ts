import  { CreateAPI } from '@/lib/createAjax';

const prefix = '/api/article';

// 获取文章列表
export function getArticleListAPI() {
    return new CreateAPI({
        url: `${prefix}/getList`,
    });
}

// 删除文章
export function destroyArticleAPI() {
    return new CreateAPI({
        method: 'post',
        url: `${prefix}/destroy`,
    });
}

export function createArticleAPI() {
    return new CreateAPI({
        method: 'post',
        url: `${prefix}/create`
    });
}
export function getArticleAPI() {
    return new CreateAPI({
        url: `${prefix}/getItem`
    });
}

export function updateArticleAPI() {
    return new CreateAPI({
        url: `${prefix}/update`,
        method: 'post'
    });
}

export function updateStatusAPI() {
    return new CreateAPI({
        url: `${prefix}/updateStatus`,
        method: 'post'
    });
}

export function getDraftListAPI() {
    return new CreateAPI({
        url: `${prefix}/getDraftList`
    });
}