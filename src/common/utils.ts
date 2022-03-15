import { TagTreeNode, Tag } from '@/pages/tag/types';

/**
 * @description 根据 titile 从标签树中筛选标签
 * @param {string} keyword
 * @param {TagTreeNode} treeNode
 * @returns {boolean}
 */
export function tagTreeFilter(keyword: string, treeNode: TagTreeNode) {
    const title = treeNode.title.toLowerCase();
    keyword = keyword.trim().toLowerCase();
    return title.includes(keyword);
}

/**
 * @description 组织标签树并设置节点是否可选
 * @param {array} tags
 * @returns 
 */
function setTagTreeNodeSelectable(tags: Tag[], onlyLeaf = false): TagTreeNode[] {
    type ChildMap = {
        [index: string]: TagTreeNode[]
    };
    const childMap: ChildMap = {};
    const tree: TagTreeNode[] = [];

    tags.forEach((tag) => {
        const ele = { ...tag } as TagTreeNode;
        ele.title = ele.name;
        ele.value = ele.id;
        ele.key = ele.id;

        if (ele.pid) {
            ele.selectable = true; 
            childMap[ele.pid] = childMap[ele.pid] || [];
            childMap[ele.pid].push(ele);
        } else {
            ele.selectable = !onlyLeaf; 
            ele.children = [];
            tree.push(ele);
        }
    });

    tree.forEach(node => {
        if (childMap[node.id]) {
            node.children = childMap[node.id];
        }
    });
    return tree;    
}

/**
 * @description 组织标签树并设置任何节点可选
 * @param {array} tags
 * @returns {TagTreeNode}
 */
export function setTagTreeSelectable(tags: Tag[]) {
    return setTagTreeNodeSelectable(tags, false);
}

/**
 * @description 组织标签树并设置仅叶子节点可选
 * @param {array} tags
 * @returns {TagTreeNode}
 */
export function setTagTreeLeafSelectable(tags: Tag[]) {
    return setTagTreeNodeSelectable(tags, true);
}