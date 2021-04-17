import { TagTreeNode, Tag } from '@/pages/tag/types';


/**
 * @description 标签树过滤方法
 * @param {string} keyword
 * @param {object} treeNode { title: string }
 * @returns {boolean}
 */
export function tagTreeFilter(keyword:string, treeNode: TagTreeNode) {
    const title = treeNode.title.toLowerCase();
    keyword = keyword.trim().toLowerCase();
    return title.includes(keyword);
}

/**
 * @description 组织标签树并设置节点是否可选
 * @param {array} tree
 * @returns 
 */
function setTagTreeNodeSelectable(tree: Tag[], onlyLeaf = false): TagTreeNode[] {
    type ChildMap = {
        [index: string]: TagTreeNode[]
    };
    type ParentMap = {
        [index: string]: TagTreeNode
    };

    const childMap: ChildMap = {};
    const parentMap: ParentMap = {};

    tree.forEach((item) => {
        const ele = { ...item } as TagTreeNode;
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
            parentMap[ele.id] = ele;
        }
    });
    const tags: TagTreeNode[] = [];
    Object.keys(parentMap).forEach(id => {
        if (childMap[id]) {
            parentMap[id].children = childMap[id];
        }
        tags.push(parentMap[id]);
    });
    return tags;    
}

/**
 * @description 组织标签树并设置任何节点可选
 * @param {array} tree
 * @returns 
 */
export function setTagTreeSelectable(tree: Tag[]) {
    return setTagTreeNodeSelectable(tree, false);
}

/**
 * @description 组织标签树并设置仅叶子节点可选
 * @param {array} tree
 * @returns 
 */
export function setTagTreeLeafSelectable(tree: Tag[]) {
    return setTagTreeNodeSelectable(tree, true);
}