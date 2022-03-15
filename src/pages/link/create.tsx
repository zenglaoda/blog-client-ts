import * as React from 'react';
import { useState, useEffect } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import { useRequest } from '@/lib/hooks';
import { createLinkAPI} from '@/api/link';
import { getTagListAPI} from '@/api/tag';
import { layout, tailLayout} from '@/common/layout';
import { setTagTreeLeafSelectable } from '@/common/utils';
import BlogTreeSelect from '@/components/tree-select';
import { Tag, TagTreeNode } from '@/pages/tag/types'; 
import { FormData } from '@/pages/link/types'; 
import { rules, useGetInitialValues } from './common';
import './style/create.less';


function CreateLink() {
    const [tagTree, setTagTree] = useState<TagTreeNode[]>([]);
    const [form] = Form.useForm();
    const getTagList = useRequest(getTagListAPI);
    const createLink = useRequest(createLinkAPI, { unmountAbort: false });
    const initialValues = useGetInitialValues();
    const history = useHistory();
    const summerLoading = [getTagList, createLink].some(item => item.loading);

    const onFinish = (formData: FormData) => {
        createLink(formData)
            .then(() => {
                history.push('/link');
            });
    };

    useEffect(() => {
        getTagList()
            .then((tags: Tag[]) => {
                setTagTree(setTagTreeLeafSelectable(tags));
            })
            .catch(() => {});
    }, []);

    return (
        <div className="blp-linkCreate-page">
            <Spin spinning={summerLoading}>
                <Form {...layout} form={form} initialValues={initialValues} onFinish={onFinish}>
                    <Form.Item name='title' label='标题' rules={rules.title}>
                        <Input allowClear maxLength={60} placeholder='请输入标题' autoComplete='off'/>
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
                        <Button type='primary' htmlType="submit" disabled={getTagList.loading} loading={createLink.loading}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
}

export default CreateLink;