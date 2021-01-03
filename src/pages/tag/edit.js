import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import tagAPI from '@/api/tag';
import { parseQuery } from '@/lib/utils';
import './style/edit.less';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};
function EditTag(props) {
    const query = parseQuery(props.location.search);
    query.id = Number(query.id);
    if (!query.id) {
        return null;
    }
    const [loading, setLoading] = useState({ getItem: true, getList: true, updateItem: false });
    const [tagList, setTagList] = useState([]);
    const [tagItem, setTagItem] = useState({});
    const [form] = Form.useForm();
    const summerLoading = Object.keys(loading).some(key => loading[key]);
    console.log(summerLoading);

    const changeLoadingStatus = (status = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, status));
    };
    const onFinish = (formData) => {
        formData.id = query.id;
        delete formData.pid;
        if (loading.updateItem) {
            return;
        }
        changeLoadingStatus({ updateItem: true });
        tagAPI.update(formData)
            .then(() => {})
            .catch(() => {})
            .finally(() => {
                changeLoadingStatus({ updateItem: false });
            });
    };

    useEffect(() => {
        console.log('start getList');
        changeLoadingStatus({ getList: true });
        tagAPI.getList()
            .then((list) => {
                setTagList(list.filter(ele => !ele.pid));
            })
            .catch(() => {})
            .finally(() => {
                console.log('end getList');
                changeLoadingStatus({ getList: false })
            });
    }, []);

    useEffect(() => {
        console.log('start getItem');
        changeLoadingStatus({ getItem: true });
        tagAPI.getItem({ id: query.id })
            .then((item) => {
                setTagItem(item);
                form.setFieldsValue({
                    pid: item.pid,
                    name: item.name,
                    description: item.description,
                });
            })
            .catch(() => {})
            .finally(() => {
                console.log('end getItem');
                changeLoadingStatus({ getItem: false });
            });
    }, [query.id]);

    const rules = {
        pid: [
            { required: true },
        ],
        name: [
            { required: true },
            { type: 'string', max: 30, min: 2 }
        ],
        description: [
            { type: 'string', max: 300 }
        ]
    };

    const TagSelect = (
        tagItem.pid ?
        <Form.Item name="pid" label="一级标签" rules={rules.pid}>
            <Select placeholder="请选择一级标签" disabled={true}>
                {tagList.map(tag => (<Select.Option value={tag.id} key={tag.id}>{tag.name}</Select.Option>))}
            </Select>
        </Form.Item>
        : null
    );
    return (
        <div className="blp-tag-edit-page">
            <Spin spinning={summerLoading}>
                <Form {...layout} form={form} onFinish={onFinish} className="blp-form">
                    {TagSelect}
                    <Form.Item name='name' label='标签名' rules={rules.name}>
                        <Input allowClear maxLength={30} placeholder='请输入标签名' autoComplete='off'/>
                    </Form.Item>
                    <Form.Item name='description' label='标签描述' rules={rules.description}>
                        <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入描述'/>
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
export default EditTag;