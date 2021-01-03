import React, { useState, useEffect } from 'react';
import { Form, Input, Spin, TreeSelect } from 'antd';
import tagAPI from '@/api/tag';
import { useFilterTreeNode } from '@/common/hooks';
import './style/baseForm.less';

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

export default function FormModal(props) {
    const filterTreeNode = useFilterTreeNode();
    const [loading, setLoading] = useState({ getTags: true });
    const [tagList, setTagList] = useState([]);
    const summerLoading = Object.keys(loading).some(key => loading[key]);

    const rules = {
        title: [
            { required: true },
            { whitespace: true },
            { type: 'string', max: 60, min: 2 }
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
            { required: true },
            { type: 'array' }
        ],
    };
    const changeLoadingStatus = (status = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, status));
    };

    useEffect(() => {
        changeLoadingStatus({ getTags: true });
        tagAPI.getList()
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
                setTagList(tags);
            })
            .catch(() => {})
            .finally(() => changeLoadingStatus({ getTags: false }));
    }, []);


    return (
        <div className="blpc-baseForm-component" style={props.style}>
            <Spin spinning={summerLoading}>
                <Form form={props.form}>
                    <Form.Item name='title' label='标题' rules={rules.title} {...formItemLayout}>
                        <Input allowClear maxLength={60} placeholder='请输入标题' autoComplete='off'/>
                    </Form.Item>
                    <Form.Item name="tagIds" label="标签" rules={rules.tagIds} {...formItemLayout}>
                        <TreeSelect
                            filterTreeNode={filterTreeNode}
                            treeData={tagList}
                            maxTagCount={5}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            showSearch
                            allowClear
                            multiple
                            placeholder="请选择标签"
                        />
                    </Form.Item>
                    <Form.Item name='keyword' label='关键字' rules={rules.keyword} {...formItemLayout}>
                        <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入关键字'/>
                    </Form.Item>
                    <Form.Item name='description' label='文章描述' rules={rules.description} {...formItemLayout}>
                        <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入描述'/>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};
