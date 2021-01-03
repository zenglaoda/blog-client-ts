import { useCallback } from 'react';
import { useLocation } from "react-router-dom";

/**
 * @description 标签树搜索 
 */
export function useFilterTreeNode() {
    return useCallback((keyword, treeNode) => {
        const title = treeNode.title.toLowerCase();
        keyword = keyword.trim().toLowerCase();
        return title.includes(keyword);
    }, []);
}

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}