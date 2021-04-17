export type Map = {
    label: string,
    value: string | number
};
export type Maps = {
    [prop: string]: Map
};
export type ValMapLabel = {
    [prop: string]: string
};

export function map2Label(maps: Maps) {
    return Object.keys(maps).reduce((m: ValMapLabel, key) => {
        const item = maps[key];
        m[item.value] = item.label;
        return m;
    }, {});
}

// 文章状态
export const ARTICLE_STATUS: Maps = {
    all: { label: '全部状态', value: '' },
    finished: { label: '完成', value: '1' },
    draft: { label: '草稿', value: '2' },
};

export const ARTICLE_STATUS_LIST = [
    ARTICLE_STATUS.all,
    ARTICLE_STATUS.finished,
    ARTICLE_STATUS.draft,
];

export const ARTICLE_STATUS_LABEL = map2Label(ARTICLE_STATUS);

// 笔记与目录的关联类型
export const NOTE_TYPE = {
    link: { label: '链接', value: '1' },
    article: { label: '文章', value: '2' }
};