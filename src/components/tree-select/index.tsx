import * as React from 'react';
import { TreeSelect } from 'antd';
import { tagTreeFilter } from '@/common/utils';

/**
 * @description 对 ant tree-select的一个简单封装
 * @param {object} props
 * @param {boolean} props.showSearch
 * @param {boolean} props.allowClear
 * @param {boolean} props.multiple
 * @returns 
 */
export default function BlogTreeSelect(props: any) {
    const treeDefaultProps = {
        treeData: [], 
        showSearch: true,
        allowClear: true,
        multiple: true,
        maxTagCount: 2,
        filterTreeNode: tagTreeFilter,
        dropdownStyle: { maxHeight: 400, overflow: 'auto' },
        style: { width: 240 },
        placeholder: '请选择标签',
    };

    // TODO: Object.assign 合并策略
    const treeProps = Object.assign({}, treeDefaultProps, {...props});

    return (
        <TreeSelect
            {...treeProps}
        />
    );
}
