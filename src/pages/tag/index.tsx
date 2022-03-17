import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import { Form, Button, Spin, Menu, Dropdown, Modal } from 'antd';
import { SearchOutlined, RollbackOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useRequest from '@/lib/hooks/useRequest';
import { destroyTagAPI, getTagListAPI, getAssociationsAPI } from '@/api/tag';
import { setTagTreeSelectable } from '@/common/utils';
import { TagTreeNode } from '@/pages/tag/types';
import BlogTreeSelect from '@/components/tree-select';
import TagItem from './components/tagItem';
import { Tag } from './types';
import './style/index.less';

type FormData = {
    tagIds: number[]
};

interface TagNode extends TagTreeNode {
    children?: TagNode[],
    links: number,
    articles: number,
    parentTag: TagNode
}

type TagMap = {
    [prop: string]: TagNode
};

type CountMap  = ({
    link: {
        [index:string]: number
    },
    article: {
        [index:string]: number
    }
} | null);



export default function TagPage() {
    const [tagTree, setTagTree] = useState<TagNode[]>([]);
    const [tagList, setTagList] = useState<TagNode[]>([]);
    const [countMap, setCountMap] = useState<CountMap>(null);
    const [form] = Form.useForm();
    const destroyTag = useRequest(destroyTagAPI, { unmountAbort: false });
    const getTagList = useRequest(getTagListAPI);
    const getAssociations = useRequest(getAssociationsAPI);

    const initialValues = {
        tagIds: [],
    };

    const getList = (formData: FormData) => {
        const tagMaps: TagMap = {};
        const tags:any = [];
        tagTree.forEach(tag => {
            tagMaps[tag.id] = tag;
            tags.push(tag);
            tag.children!.forEach((child) => {
                tagMaps[child.id] = child;
                tags.push(child);
            });
        }); 
        if (!formData.tagIds.length) {
            setTagList(tags);
            return;
        }
        const maps: TagMap = {};
        formData.tagIds.forEach((tagId) => {
            maps[tagId] = tagMaps[tagId];
            if (!maps[tagId].pid) {
                maps[tagId]!.children!.forEach((child) => {
                    maps[child.id] = child;
                });
            }
        });
        setTagList(Object.values(maps));
    };

    const onFinish = (formData: FormData) => {
        getList(formData);
    };

    const onResetForm = () => {
        form.resetFields();
        getList(initialValues);
    };

    const onDeleteItem = (item: TagNode) => {
        Modal.confirm({
            title: `确定删除标签 "${item.name}" ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return destroyTag({ id: item.id })
                    .then(() => {
                        let tree:TagNode[] = [];
                        if (item.pid) {
                            const parentTag = tagTree.find(tag => tag.id === item.pid);
                            parentTag!.children = parentTag!.children!.filter(tag => tag.id !== item.id);
                            tree = tagTree;
                        } else {
                            tree = tagTree.filter(tag => tag.id !== item.id);
                        }
                        setTagTree([...tree]);
                    })
                    .catch(() => {})
            },
            onCancel() {
                destroyTag.cancel();
            },
          });
    };

    const getCreateMenu = useMemo(() => (
        <Menu>
            <Menu.Item key="1">
                <Link to={`/tag/create?level=1`}>一级标签</Link>                
            </Menu.Item>
            <Menu.Item key="2">
                <Link to={`/tag/create?level=2`}>二级标签</Link>                
            </Menu.Item>
        </Menu>
    ), []);

    const getTagItemMenu = (item: TagNode) => (
        <Menu>
            <Menu.Item key={1}>
                <Link to={`/tag/edit?id=${item.id}`}>编辑</Link>                
            </Menu.Item>
            <Menu.Item key={2} danger onClick={() => onDeleteItem(item)}>
                删除
            </Menu.Item>
        </Menu>
    );

    const updateTag = (tree: TagNode[], countMap: CountMap) => {
        const linkCount = (countMap && countMap.link) || {};
        const articleCount = (countMap && countMap.article) || {};
        const tagList: TagNode[] = [];

        tree.forEach(node => {
            node.children = node.children || [];
            node.children.forEach(child => {
                child.links = linkCount[child.id] || 0;
                child.articles = articleCount[child.id] || 0;
                child.parentTag = node;
            });
            node.links = node.children.reduce((t, n) => t + n.links, 0);
            node.articles = node.children.reduce((t, n) => t + n.articles, 0);

            tagList.push(node, ...node.children);
        });

        setTagList(tagList);
    }

    // 获取 tagList
    useEffect(() => {
        getTagList().then((tags: Tag[]) => {
            setTagTree(setTagTreeSelectable(tags) as any);
        });
    }, []);

    // 更新文章，链接数量
    useEffect(() => {
        getAssociations()
            .then((res: CountMap) => {
                setCountMap(res);
            })
    }, []);

    useEffect(() => {
        updateTag(tagTree, countMap);
    }, [tagTree, countMap]);
    
    return (
        <div className="blp-tag-page">
            <section className="blp-tag-header">
                <Form onFinish={onFinish} form={form} initialValues={initialValues} layout="inline" className="blg-ant-form-inline">
                    <Form.Item name="tagIds" label="标签">
                        <BlogTreeSelect 
                            treeData={tagTree}
                            treeCheckable
                            multiple 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={getTagList.loading} icon={<SearchOutlined/>}>
                            查询
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onResetForm} disabled={getTagList.loading} icon={<RollbackOutlined/>}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </section>
            <section className="blg-action">
                <Dropdown overlay={getCreateMenu}>
                    <Button icon={<PlusOutlined />}>新增标签</Button>
                </Dropdown>
            </section>
            <Spin spinning={getTagList.loading} style={{minHeight: 300}}>
                <section className="blp-tag-main">
                    {tagList.map(ele => <TagItem {...ele} menu={getTagItemMenu(ele)}/>)}
                </section>
            </Spin>
        </div>
    );
}