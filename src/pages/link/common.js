import tagAPI from '@/api/tag';
import { useCallback } from 'react';

export const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
export  const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};
export const rules = {
    title: [
        { required: true },
        { whitespace: true },
        { type: 'string', max: 60, min: 2 }
    ],
    url: [
        { required: true },
        { whitespace: true },
        { type: 'url', max: 100, min: 2 }
    ],
    tagIds: [
        { required: true },
        { type: 'array' }
    ],
    description: [
        { type: 'string', max: 200 },
        { whitespace: true }
    ],
    keyword: [
        { type: 'string', max: 200, required: true },
        { whitespace: true }
    ],
    tagIds: [
        { required: true }
    ]
};
export function getTagList() {
    return tagAPI.getList()
        .then((list) => {
            const childMap = {};
            const parentMap = {};
            list.forEach((ele) => {
                ele.title = ele.name;
                ele.value = ele.id;
                ele.key = ele.id;
                if (ele.pid) {
                    childMap[ele.pid] = childMap[ele.pid] || [];
                    childMap[ele.pid].push(ele);
                } else {
                    ele.selectable = false;
                    ele.children = [];
                    parentMap[ele.id] = ele;
                }
            });
            const tags = [];
            Object.keys(parentMap).forEach(id => {
                if (childMap[id] && childMap[id].length) {
                    parentMap[id].children = childMap[id];
                    tags.push(parentMap[id]);
                }
            });
            return tags;
        })
}
export function useFilterTreeNode() {
    return useCallback((keyword, treeNode) => {
        const title = treeNode.title.toLowerCase();
        keyword = keyword.trim().toLowerCase();
        return title.includes(keyword);
    }, []);
}