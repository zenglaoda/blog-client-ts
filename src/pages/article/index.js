import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Spin, TreeSelect, Pagination, Menu, Modal } from 'antd';
import { SearchOutlined, RollbackOutlined,PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useFilterTreeNode } from '@/common/hooks';
import { getTagList } from '@/common/api';
import NoteItem from '@/components/noteItem'; 
import articleAPI from '@/api/article';
import './style/index.less';

const { RangePicker } = DatePicker;

function ArticlePage() {
    const [tagList, setTagList] = useState([]);
    const [articleList, setArticleList] = useState([]);
    const [loading, setLoading] = useState({ getTagList: true, getArticleList: true, delete: false });
    const [pager, setPager] = useState({ total: 0, page: 1, pageSize: 10 });
    const [form] = Form.useForm();
    const filterTreeNode = useFilterTreeNode();
    const summerLoading = ['getTagList', 'getArticleList'].some(key => loading[key]);

    const initialValues = {
        keyword: '',
        tagIds: [],
        date: []
    };
    const changeLoadingState = (state = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, state));
    };
    const changePagerState = (state = {}) => {
        setPager(prePager => Object.assign({}, prePager, state));
    };

    const onDeleteNoteItem = (item) => {
        Modal.confirm({
            title: `确定删除笔记 "${item.title}" ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                changeLoadingState({ delete: true });
                return articleAPI.destroy({ id: item.id })
                    .then(() => {
                        setArticleList(articleList.filter(ele => ele !== item));
                    })
                    .finally(() => {
                        changeLoadingState({ delete: false });
                    })
            },
            onCancel() {},
          });
    };

    const onFinish = (formData) => {
        getList(formData);        
    };
    const onResetForm = () => {
        form.resetFields();
        setPager({ page: 1, pageSize: 10 });
        getList();
    };
    const getParams = (formData) => {
        const params = {
            page: pager.page,
            pageSize: pager.pageSize,
            keyword: '',
            startDate: '',
            endDate: '',
            tagIds: '',
        };
        if (!formData) {
            return params;
        }
        params.keyword = formData.keyword || params.keyword;
        if (Array.isArray(formData.tagIds) && formData.tagIds.length) {
            params.tagIds = formData.tagIds.join(',');
        }
        if (Array.isArray(formData.date) && formData.date.length) {
            params.startDate = formData.date[0].valueOf();
            params.endDate = formData.date[1].valueOf();
        }
        return params
    };
    const getList = (formData) => {
        changeLoadingState({ getArticleList: true });
        const params = getParams(formData);
        articleAPI.getList(params)
            .then((res) => {
                setArticleList(res.rows || []);
                changePagerState({ total: res.total || 0 });
            })
            .catch(() => {})
            .finally(() => changeLoadingState({ getArticleList: false }))        
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        changeLoadingState({ getTagList: true});
        getTagList('all')
            .then((tags) => {
                setTagList(tags);
            })
            .catch(() => {})
            .finally(() => changeLoadingState({ getTagList: false }));
    }, [])

    const getMenu = (item) => (
        <Menu>
            <Menu.Item>
                <Link to={`/article/edit?id=${item.id}`}>编辑</Link>                
            </Menu.Item>
            <Menu.Item danger onClick={() => onDeleteNoteItem(item)}>
                删除
            </Menu.Item>
        </Menu>
    );

    return (
        <section className="blp-article-page">
            <section className="blp-article-header">
                <Form onFinish={onFinish} form={form} initialValues={initialValues} layout="inline" className="blg-ant-form-inline">
                    <Form.Item label="关键字" name="keyword">
                        <Input placeholder="请输入关键字"/>
                    </Form.Item>
                    <Form.Item name="tagIds" label="标签">
                        <TreeSelect
                            style={{width: 240}}
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
                    <Form.Item label="创建时间" name="date">
                        <RangePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={summerLoading} icon={<SearchOutlined/>}>
                        Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onResetForm} loading={summerLoading} icon={<RollbackOutlined/>}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </section>
            <section className="blg-action">
                <Link to="/article/create">
                    <Button icon={<PlusOutlined />} >
                        新增文章
                    </Button>
                </Link>
            </section>
            <section className="blp-article-main">
                <Spin spinning={summerLoading}>
                    {articleList.map(item => <NoteItem  key={String(item.id)} {...item} menu={getMenu(item)} />)}
                </Spin>
            </section>
            <section className="blp-article-footer">
                <Pagination
                    disabled={summerLoading}
                    current={pager.page}
                    pageSize={pager.pageSize}
                    total={pager.total}
                    onChange={(page) => changePagerState({page})}
                    onShowSizeChange={() => changePagerState({pageSize})}
                    showSizeChanger
                    size="small"
                    showTotal={total => `共${total}条`}                
                />
            </section>
        </section>
    );
}

export default ArticlePage;