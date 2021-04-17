import React from 'react';
import { Pagination } from 'antd';

/**
 * @description 配合 usePagination 对ant Pagination的一个简易封装, onChanges事件主要是对pageSize改变时,将page设置为1
 * @param {boolean} props.disabled 
 * @param {function} props.onChanges 对 ant onChange事件的一个封装,ant onChange 事件也会在 onShpwSizeChange触发时触发
 * @param {object} props.pager 自定义hooks usePagination 的返回值
 * @returns 
 */
export default function BlogPagination(props) {
    const { disabled, pager, onChanges, onChange, onShowSizeChange } = props;
    const handleChange = (page, pageSize) => {
        typeof onChange === 'function' && onChange(page, pageSize);
        const newPage = pager.pageSize === pageSize ? page : 1;
        pager.setPage(newPage);
        pager.setPageSize(pageSize);
        typeof onChanges === 'function' && onChanges(newPage, pageSize);
    };
    const handleSizeChange = (page, pageSize) => {
        pager.setPageSize(pageSize);
        typeof onShowSizeChange === 'function' && onShowSizeChange(page, pageSize);
    };

    return (
        <Pagination
            disabled={disabled}
            current={pager.page}
            pageSize={pager.pageSize}
            total={pager.total}
            onChange={handleChange}
            onShowSizeChange={handleSizeChange}
            showSizeChanger
            size="small"
            showTotal={total => `共${total}条`}                
        />
    );
}
