import tagAPI from '@/api/tag';

/**
 * @description 获取并组织标签树
 * @param {enum} child, parent, all
 * @returns {array} 
 */
export function getTagList(type='child') {
    const childSelectable = type === 'all' || type === 'child';
    const parentSelectable = type === 'all' || type === 'parent';
    return tagAPI.getList()
        .then((list) => {
            const childMap = {};
            const parentMap = {};
            list.forEach((ele) => {
                ele.title = ele.name;
                ele.value = ele.id;
                ele.key = ele.id;
                if (ele.pid) {
                    ele.selectable = childSelectable;
                    childMap[ele.pid] = childMap[ele.pid] || [];
                    childMap[ele.pid].push(ele);
                } else {
                    ele.selectable = parentSelectable;
                    ele.children = [];
                    parentMap[ele.id] = ele;
                }
            });
            const tags = [];
            Object.keys(parentMap).forEach(id => {
                if (childMap[id] && childMap[id].length) {
                    parentMap[id].children = childMap[id];
                    tags.push(parentMap[id]);
                } else {
                    tags.push(parentMap[id]);
                }
            });
            return tags;
        });
}