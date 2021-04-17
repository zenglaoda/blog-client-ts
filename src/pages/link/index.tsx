import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Spin, Menu, Modal } from 'antd';
import { SearchOutlined, RollbackOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { setTagTreeSelectable } from '@/common/utils';
import { usePagination, useRequest } from '@/lib/hooks';
import { getLinkListAPI, destroyLinkAPI } from '@/api/link';
import { getTagListAPI } from '@/api/tag';
import NoteItem from '@/components/noteItem'; 
import BlogPagination from '@/components/pagination'; 
import BlogTreeSelect from '@/components/tree-select'; 
import { TagTreeNode } from '@/pages/tag/types';
import { Link as TLink } from '@/pages/link/types';
import './style/index.less';

const { RangePicker } = DatePicker;

function LinkPage() {
    const [tagTree, setTagTree] = useState<TagTreeNode[]>([]);
    const [linkList, setLinkList] = useState<TLink[]>([]);
    const [form] = Form.useForm();
    const [pager] = usePagination();
    const getLinkList = useRequest(getLinkListAPI);
    const getTagList = useRequest(getTagListAPI);
    const destroyLink = useRequest(destroyLinkAPI, { unmountAbort: false });

    const initialValues = {
        keyword: '',
        tagIds: [],
        date: []
    };

    const getParams = () => {
        const formData = form.getFieldsValue(true);
        const params = {
            page: pager.page,
            pageSize: pager.pageSize,
            keyword: formData.keyword,
            startDate: '',
            endDate: '',
            tagIds: '',
        };

        if (Array.isArray(formData.tagIds)) {
            params.tagIds = formData.tagIds.join(',');
        }

        if (Array.isArray(formData.date) && formData.date.length) {
            params.startDate = formData.date[0].valueOf();
            params.endDate = formData.date[1].valueOf();
        }
        return params;
    };

    const getList = () => {
        const params = getParams();
        getLinkList(params)
            .then((res) => {
                setLinkList(res.rows || []);
                pager.setTotal(res.count);
                if (pager.page !== 1 && !linkList.length) {
                    pager.setPage(1);
                    getList();
                }
            })
            .catch(() => {});
    };

    const onFinish = () => {
        getList();        
    };

    const onResetForm = () => {
        form.resetFields();
        pager.reset();
        getList();
    };

    const onDeleteNoteItem = (item: TLink) => {
        Modal.confirm({
            title: `确定删除链接 "${item.title}" ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return destroyLink({ id: item.id })
                    .then(() => {
                        getList();
                    })
                    .catch(() => {});
            },
            onCancel() {
                destroyLink.cancel();
            },
        });
    };

    useEffect(() => {
        getList();
        getTagList()
            .then((tags) => {
                setTagTree(setTagTreeSelectable(tags || []));
            })
            .catch(() => {});
    }, []);

    const getMenu = (item: TLink) => (
        <Menu>
            <Menu.Item>
                <Link to={`/link/edit?id=${item.id}`}>编辑</Link>                
            </Menu.Item>
            <Menu.Item danger onClick={() => onDeleteNoteItem(item)}>
                删除
            </Menu.Item>
        </Menu>
    );

    return (
        <section className="blp-link-page">
            <section className="blp-link-header">
                <Form onFinish={onFinish} form={form} initialValues={initialValues} layout="inline" className="blg-ant-form-inline">
                    <Form.Item label="关键字" name="keyword">
                        <Input placeholder="请输入关键字"/>
                    </Form.Item>
                    <Form.Item name="tagIds" label="标签">
                        <BlogTreeSelect 
                            treeData={tagTree}
                            treeCheckable 
                            multiple 
                        />
                    </Form.Item>
                    <Form.Item label="创建时间" name="date">
                        <RangePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={getLinkList.loading} icon={<SearchOutlined/>}>
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onResetForm} loading={getLinkList.loading} icon={<RollbackOutlined/>}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </section>
            <section className="blg-action">
                <Link to="/link/create">
                    <Button icon={<PlusOutlined />}>新增链接</Button>
                </Link>
            </section>
            <section className="blp-link-main">
                <Spin spinning={getLinkList.loading} style={{minHeight: 100}}>
                    {linkList.map(item => <NoteItem key={String(item.id)} {...item}  menu={getMenu(item)} />)}
                </Spin>
            </section>
            <section className="blp-link-footer">
                <BlogPagination 
                    disabled={getLinkList.loading} 
                    pager={pager} 
                    onChanges={getList}
                />
            </section>
        </section>
    );
}

export default LinkPage;