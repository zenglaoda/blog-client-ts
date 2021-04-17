import { useCallback } from 'react';


/**
 * @deprecated 该方法不需要缓存
 * @description 标签树搜索 
 */
export function useFilterTreeNode() {
    return useCallback((keyword, treeNode) => {
        const title = treeNode.title.toLowerCase();
        keyword = keyword.trim().toLowerCase();
        return title.includes(keyword);
    }, []);
}
