import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { Form, Button, TreeSelect, Spin, Menu, Dropdown, Modal } from 'antd';
import { SearchOutlined, RollbackOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
 import { getTagList } from '@/common/api';
import { useFilterTreeNode } from '@/common/hooks';
import { useHistory } from '@/lib/router';
import relationAPI from '@/api/relation';
import tagAPI from '@/api/tag';
import TagItem from './components/tagItem';
import './style/index.less';

function TagList() {
    const [tagList, setTagList] = useState([]);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState({ getList: true, getRelations: true });
    const [form] = Form.useForm();
    const filterTreeNode = useFilterTreeNode();
    const summerLoading = Object.keys(loading).some(key=>loading[key]);
    
    const initialValues = {
        tagIds: [],
    };
    const changeLoadingStatus = (status = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, status));
    };
    const onFinish = (formData) => {
        getList(formData);
    };
    const onResetForm = () => {
        form.resetFields();
        getList();
    };

    const onDeleteNoteItem = (item) => {
        Modal.confirm({
            title: `确定删除标签 "${item.name}" ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return tagAPI.destroy({ id: item.id })
                    .then(() => {
                        setList(list.filter(ele => ele !== item));
                        if (item.parentTag) {
                            item.parentTag = item.parentTag.children.filter(ele => ele!== item);
                        }
                    })
                    .finally(() => {})
            },
            onCancel() {},
          });
    };

    const getList = (formData) => {
        const tagMaps = {};
        const tags = [];
        tagList.forEach(tag => {
            tagMaps[tag.id] = tag;
            tags.push(tag);
            tag.children.forEach((child) => {
                tagMaps[child.id] = child;
                tags.push(child);
            });
        });
        if (!formData || !formData.tagIds.length) {
            setList(tags);
            return;
        }
        const set = {};
        formData.tagIds.forEach((id) => {
            if (tagMaps[id]) {
                set[id] = tagMaps[id];
                if (!set[id].pid) {
                    set[id].children.forEach((child) => {
                        set[child.id] = child;
                    });
                }
            }
        });
        setList(Object.values(set));
    };


    useEffect(() => {
        changeLoadingStatus({ getList: true });
        changeLoadingStatus({ getRelations: true });
        Promise.all([getTagList('all').catch(() => []), relationAPI.getList().catch(() => [])])
            .then(([tags, relations]) => {
                const list = [];
                const articleMap = {};
                const linkMap = {};
                relations.forEach((ele) => {
                    const tagId = ele.tagId;
                    articleMap[tagId] = articleMap[tagId] || [];
                    linkMap[tagId] = linkMap[tagId] || [];
                    Number(ele.type) === 1 ? linkMap[tagId].push(ele) :  articleMap[tagId].push(ele);
                });
                const getArticles = tagId => (articleMap[tagId] && articleMap[tagId].length) || 0;
                const getLinks = tagId => (linkMap[tagId] && linkMap[tagId].length) || 0;
                tags.forEach(tag => {
                    list.push(tag);
                    tag.children = tag.children || [];
                    if (!tag.pid) {
                        tag.children.forEach((child) => {
                            child.articles = getArticles(child.id);
                            child.links = getLinks(child.id);
                            child.childs = 0;
                            child.parentTag = tag;
                            list.push(child); 
                        });
                    }
                    tag.articles = tag.children.reduce((count, child) => count + child.articles, 0);
                    tag.links = tag.children.reduce((count, child) => count + child.links, 0);
                    tag.childs = tag.children.length;
                    tag.parentTag = null;
                });
                setTagList(tags);
                setList(list);
            })
            .finally(() => {
                changeLoadingStatus({ getList: false });
                changeLoadingStatus({ getRelations: false });
            });
    }, []);

    const createMenu = () => (
        <Menu>
            <Menu.Item>
                <Link to={`/tag/create?level=1`}>一级</Link>                
            </Menu.Item>
            <Menu.Item>
                <Link to={`/tag/create?level=2`}>二级</Link>                
            </Menu.Item>
        </Menu>
    );

    const getMenu = (item) => (
        <Menu>
            <Menu.Item>
                <Link to={`/tag/edit?id=${item.id}`}>编辑</Link>                
            </Menu.Item>
            <Menu.Item danger onClick={() => onDeleteNoteItem(item)}>
                删除
            </Menu.Item>
        </Menu>
    );
    
    return (
        <section className="blp-tag-page">
            <section className="blp-tag-header">
                <Form onFinish={onFinish} form={form} initialValues={initialValues} layout="inline" className="blg-ant-form-inline">
                    <Form.Item name="tagIds" label="标签">
                        <TreeSelect
                            style={{width: 240}}
                            filterTreeNode={filterTreeNode}
                            treeData={tagList}
                            maxTagCount={1}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            showSearch
                            allowClear
                            multiple
                            placeholder="请选择标签"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading.getList} icon={<SearchOutlined/>}>
                        Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onResetForm} loading={loading.getList} icon={<RollbackOutlined/>}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </section>
            <section className="blg-action">
                <Dropdown overlay={createMenu()}>
                    <Button icon={<PlusOutlined />}>新增标签</Button>
                </Dropdown>
            </section>
            <Spin spinning={summerLoading} style={{minHeight: 300}}>
                <section className="blp-tag-main">
                    {list.map(ele => <TagItem {...ele} menu={getMenu(ele)}/>)}
                </section>
            </Spin>
        </section>
    );
}
export default TagList;