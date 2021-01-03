import React, { useState, useEffect } from 'react';
import { Form, Input, Button, TreeSelect, Spin } from 'antd';
import linkAPI from '@/api/link';
import { parseQuery } from '@/lib/utils';
import { useHistory } from '@/lib/router';
import {
    layout,
    tailLayout,
    rules,
    getTagList,
    useFilterTreeNode
} from './common';
import './style/create.less';

function EditLink(props) {
    const query = parseQuery(props.location.search);
    query.id = Number(query.id);

    const [loading, setLoading] = useState({ getList: true, update: false, getItem: true });
    const [loadError, setLoadError] = useState({ getList: true, getItem: true });
    const [tagList, setTagList] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const summerLoading = Object.keys(loading).some(key => loading[key]);
    const summerLoadError = Object.keys(loadError).some(key => loadError[key]);

    const changeLoadingStatus = (status = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, status));
    };

    const changeLoadError = (status = {}) => {
        setLoadError(preLoadError => Object.assign({}, preLoadError, status));
    };

    const onFinish = (formData) => {
        changeLoadingStatus({ update: true });
        formData.id = query.id;
        linkAPI.update(formData)
            .finally(() => changeLoadingStatus({ update: false}))
            .then(() => {
                history.push('/link');
            });
    };

    const initialValues = {
        title: '',
        url: '',
        tagIds: [],
        description: ''
    };

    const filterTreeNode = useFilterTreeNode();

    useEffect(() => {
        changeLoadingStatus({ getList: true });
        getTagList()
            .then((tags) => {
                setTagList(tags);
                changeLoadError({ getList: false });
            })
            .catch(() => {
                changeLoadError({ getList: true });
            })
            .finally(() => changeLoadingStatus({ getList: false }));
    }, []);

    useEffect(() => {
        changeLoadingStatus({ getItem: true });
        linkAPI.getItem({ id: query.id })
            .then((item) => {
                form.setFieldsValue({
                    title: item.title,
                    url: item.url,
                    description: item.description,
                    tagIds: item.tags.map(ele => ele.tagId)
                });
                changeLoadError({ getItem: false });
            })
            .catch(() => {
                changeLoadError({ getItem: true });
            })
            .finally(() => changeLoadingStatus({ getItem: false }))
    }, [query.id]);

    return (
        <div className="blp-link-create-page">
            <Spin spinning={summerLoading}>
                <Form {...layout} form={form} initialValues={initialValues} onFinish={onFinish} className="blp-form">
                    <Form.Item name='title' label='标题' rules={rules.title}>
                        <Input allowClear maxLength={60} placeholder='请输入标提' autoComplete='off'/>
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
                        <Button type='primary' htmlType="submit" disabled={summerLoadError}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
}

export default EditLink;