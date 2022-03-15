import * as React from 'react';
import { useState, useEffect } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { parseQuery } from '@/lib/utils';
import { useRequest } from '@/lib/hooks';
import { getLinkItemAPI, updateLinkAPI } from '@/api/link';
import { getTagListAPI } from '@/api/tag';
import { setTagTreeLeafSelectable } from '@/common/utils';
import { layout, tailLayout} from '@/common/layout';
import BlogTreeSelect from '@/components/tree-select'; 
import { rules, useGetInitialValues } from './common';
import { TagTreeNode, Tag } from '@/pages/tag/types';
import { FormData } from '@/pages/link/types';
import './style/create.less';


function EditLink(props: RouteComponentProps) {
    const query = parseQuery(props.location.search);
    const linkId = Number(query.id);
    const history = useHistory();
    if (!linkId) {
        history.push('/link');
        return null;
    }

    const [tagTree, setTagTree] = useState<TagTreeNode[]>([]);
    const [form] = Form.useForm();
    const initialValues = useGetInitialValues();
    const getTagList = useRequest(getTagListAPI);
    const getLinkItem = useRequest(getLinkItemAPI);
    const updateLink = useRequest(updateLinkAPI, { unmountAbort: false });
    const summerLoading = [updateLink, getLinkItem, getTagList].some(item => item.loading);

    const onFinish = (formData: FormData) => {
        formData.id = linkId;
        updateLink(formData)
            .then(() => {
                history.push('/link');
            })
            .catch(() => {});
    };

    useEffect(() => {
        getTagList()
            .then((tags: Tag[]) => {
                setTagTree(setTagTreeLeafSelectable(tags));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        getLinkItem({ id: linkId })
            .then((item) => {
                form.setFieldsValue({
                    title: item.title,
                    url: item.url,
                    tagId: item.tagId,
                    description: item.description,
                    keyword: item.keyword,
                });
            })
            .catch(() => {});
    }, [linkId]);

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
                    <Form.Item name="tagId" label="标签" rules={rules.tagId}>
                        <BlogTreeSelect treeData={tagTree} multiple={false} style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item name='keyword' label='关键字' rules={rules.keyword}>
                        <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入关键字'/>
                    </Form.Item>
                    <Form.Item name='description' label='链接描述' rules={rules.description}>
                        <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入描述'/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type='primary' htmlType="submit" loading={updateLink.loading} disabled={getTagList.loading || getLinkItem.loading}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
}

export default EditLink;