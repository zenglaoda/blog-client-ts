import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Spin, Select, Menu, Modal } from 'antd';
import { SearchOutlined, RollbackOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { destroyArticleAPI, getArticleListAPI } from '@/api/article';
import { getTagListAPI } from '@/api/tag';
import { usePagination, useRequest } from '@/lib/hooks';
import { stringifyQuery } from '@/lib/utils';
import { ARTICLE_STATUS_LIST, ARTICLE_STATUS } from '@/enum/article';
import { setTagTreeSelectable } from '@/common/utils';
import { Tag, TagTreeNode } from '@/pages/tag/types';
import { Article } from '@/pages/article/types';
import NoteItem from '@/components/noteItem'; 
import BlogTreeSelect from '@/components/tree-select';
import BlogPagination from '@/components/pagination';
import './style/index.less';

const { RangePicker } = DatePicker;

function ArticlePage() {
    const [tagTree, setTagTree] = useState<TagTreeNode[]>([]);
    const [articleList, setArticleList] = useState<Article[]>([]);
    const [pager] = usePagination();
    const [form] = Form.useForm();
    const getTagList = useRequest(getTagListAPI);
    const getArticleList = useRequest(getArticleListAPI);
    const destroyArticle = useRequest(destroyArticleAPI, { unmountAbort: false});

    const initialValues = {
        keyword: '',
        status: ARTICLE_STATUS.all.value,
        tagIds: [],
        date: []
    };

    // 获取查询参数
    const getParams = () => {
        const formData = form.getFieldsValue();
        const params = {
            page: pager.page,
            pageSize: pager.pageSize,
            keyword: formData.keyword,
            status: formData.status,
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

    // 获取列表
    const getList = () => {
        const params = getParams();
        getArticleList(params)
            .then((res) => {
                pager.setTotal(res.count);
                setArticleList(res.rows || []);
                if (pager.page !== 1 && !articleList.length) {
                    pager.setPage(1);
                    getList();
                }
            })
            .catch(() => {});
    };

    // 点击删除笔记
    const onDeleteNoteItem = (item: Article) => {
        Modal.confirm({
            title: `确定删除笔记 "${item.title}" ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return destroyArticle({ id: item.id })
                    .then(() => {
                        getList();
                    });
            },
            onCancel() {
                destroyArticle.cancel();
            },
        });
    };

    // 点击搜索
    const onSearch = () => {
        getList();        
    };

    // 点击重置
    const onReset = () => {
        form.resetFields();
        pager.reset();
        getList();
    };

    useEffect(() => {
        getList();
        getTagList()
            .then((tags: Tag[]) => {
                setTagTree(setTagTreeSelectable(tags));
            })
    }, []);

    const getMenu = (item: Article) => (
        <Menu>
            <Menu.Item key={1}>
                <Link
                    to={{
                        pathname: '/article/edit',
                        search: stringifyQuery({ id: item.id }),
                    }}
                >编辑</Link>                
            </Menu.Item>
            <Menu.Item key={2} danger onClick={() => onDeleteNoteItem(item)}>
                删除
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="blp-article-page">
            <section className="blp-article-header">
                <Form onFinish={onSearch} form={form} initialValues={initialValues} layout="inline" className="blg-ant-form-inline">
                    <Form.Item label="关键字" name="keyword">
                        <Input placeholder="请输入关键字" allowClear maxLength={100}/>
                    </Form.Item>
                    <Form.Item label="状态" name="status">
                        <Select placeholder="请选择文章状态" style={{width: '200px'}}>
                            {ARTICLE_STATUS_LIST.map(item => 
                                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                            )}
                        </Select>
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
                        <Button type="primary" htmlType="submit" loading={getArticleList.loading} icon={<SearchOutlined/>}>
                            查询
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onReset} loading={getArticleList.loading} icon={<RollbackOutlined/>}>
                            重置
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
                <Spin spinning={getArticleList.loading}>
                    {articleList.map(item => <NoteItem key={item.id} {...item} menu={getMenu(item)} />)}
                </Spin>
            </section>
            <section className="blp-article-footer">
                <BlogPagination 
                    pager={pager} 
                    disabled={getArticleList.loading} 
                    onChanges={getList}
                />
            </section>
        </div>
    );
}

export default ArticlePage;