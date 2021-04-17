import { useRef } from 'react';

export type PageOptions = {
    total?: number,
    page?: number,
    pageSize?: number
};


/**
 * @description 使用分页组件
 */
export default function usePagination(option: PageOptions = {}) {
    function initial() {
        return Object.assign({
            total: 0,
            page: 1,
            pageSize: 10            
        }, option);
    }
    const refStore = useRef(initial());
    const store = refStore.current;

    function pager(data: PageOptions) {
        Object.assign(store, data);
        Object.assign(pager, store);
    }
    pager.reset = function() {
        pager(initial());
    }
    pager.setTotal = function(total: number) {
        pager({ total })
    }
    pager.setPage = function(page: number) {
        pager({ page })
    }
    pager.setPageSize = function(pageSize: number) {
        pager({ pageSize })
    }
    
    pager.total = store.total;
    pager.page = store.page;
    pager.pageSize = store.pageSize;

    return [pager];
}