import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, TreeSelect, Spin } from 'antd';
import tagAPI from '@/api/tag';
import linkAPI from '@/api/link';
import { useHistory } from '@/lib/router';

import './style/create.less';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};

function CreateLink(props) {
    const [loading, setLoading] = useState({ getList: true, create: false });
    const [tagList, setTagList] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const summerLoading = Object.keys(loading).some(key => loading[key]);

    const changeLoadingStatus = (status = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, status));
    };
    const onFinish = (formData) => {
        changeLoadingStatus({ create: true });
        linkAPI.create(formData)
            .finally(() => changeLoadingStatus({ create: false}))
            .then(() => {
                history.push('/link');
            });
    };

    const rules = {
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
        keyword: [
            { type: 'string', max: 200, required: true },
            { whitespace: true }
        ],
        description: [
            { type: 'string', max: 200 },
            { whitespace: true }
        ]
    };

    const initialValues = {
        title: '',
        url: '',
        tagIds: [],
        keyword: '',
        description: ''
    };

    const filterTreeNode = useCallback((keyword, treeNode) => {
        const title = treeNode.title.toLowerCase();
        keyword = keyword.trim().toLowerCase();
        return title.includes(keyword);
    }, []);

    useEffect(() => {
        changeLoadingStatus({ getList: true });
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
            .finally(() => changeLoadingStatus({ getList: false }));
    }, []);

    return (
        <div className="blp-link-create-page">
            <Spin spinning={summerLoading}>
                <Form {...layout} form={form} initialValues={initialValues} onFinish={onFinish}>
                    <Form.Item name='title' label='标题' rules={rules.title}>
                        <Input allowClear maxLength={60} placeholder='请输入标题' autoComplete='off'/>
                    </Form.Item>
                    <Form.Item name='url' label='链接地址' rules={rules.url}>
                        <Input allowClear maxLength={100} placeholder='请输入链接地址' autoComplete='off'/>
                    </Form.Item>
                    <Form.Item name="tagIds" label="标签" rules={rules.tagIds}>
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
                    <Form.Item name='keyword' label='关键字' rules={rules.keyword}>
                        <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入关键字'/>
                    </Form.Item>
                    <Form.Item name='description' label='链接描述' rules={rules.description}>
                        <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入描述'/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type='primary' htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
}

export default CreateLink;