import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { Form, Button, Spin, Menu, Dropdown, Modal } from 'antd';
import { SearchOutlined, RollbackOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useRequest from '@/lib/hooks/useRequest';
import { destroyTagAPI, getTagListAPI } from '@/api/tag';
import { setTagTreeSelectable } from '@/common/utils';
import BlogTreeSelect from '@/components/tree-select';
import TagItem from './components/tagItem';
import { Tag } from './types';
import './style/index.less';

type FormData = {
    tagIds: number[]
};

interface TagNode extends Tag {
    parentTag: TagNode | null
    children?: TagNode[]
}

type TagMap = {
    [prop: string]: TagNode
};



export default function TagPage() {
    const [tagTree, setTagTree] = useState<TagNode[]>([]);
    const [tagList, setTagList] = useState<TagNode[]>([]);
    const [form] = Form.useForm();
    const destroyTag = useRequest(destroyTagAPI);
    const getTagList = useRequest(getTagListAPI);

    const initialValues = {
        tagIds: [],
    };

    const getList = (formData: FormData) => {
        const tagMaps = {};
        const tags = [];
        tagTree.forEach(tag => {
            tagMaps[tag.id] = tag;
            tags.push(tag);
            tag.children.forEach((child) => {
                tagMaps[child.id] = child;
                tags.push(child);
            });
        }); 
        if (!formData || !formData.tagIds.length) {
            setTagList(tags);
            return;
        }
        const maps = {};
        formData.tagIds.forEach((id) => {
            maps[id] = tagMaps[id];
            if (!maps[id].pid) {
                maps[id].children.forEach((child) => {
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
        getList();
    };

    const onDeleteNoteItem = (item: TagNode) => {
        Modal.confirm({
            title: `确定删除标签 "${item.name}" ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                return destroyTag({ id: item.id })
                    .then(() => {
                        if (item.parentTag) {
                            item.parentTag.children = item.parentTag.children.filter(ele => ele!== item);
                        }
                        setTagList(tagList.filter(ele => ele !== item));
                    })
                    .catch(() => {})
            },
            onCancel() {
                destroyTag.cancel();
            },
          });
    };

    useEffect(() => {
        const callback = async () => {
            const tags: Tag[]  = await getTagList();
            const tagTree: TagNode[] = setTagTreeSelectable(tags);
            const tagList: TagNode[] = [];
            
            const articleMap = {};
            const linkMap = {};
            const getMapCount = (map, tagId) => (map[tagId] && map[tagId].length) || 0;

            tagTree.forEach(tag => {
                const articleSet = new Set();
                const linkSet = new Set();
                tag.parentTag = null;
                tagList.push(tag);
                tag.children = tag.children || [];
                tag.children.forEach((child) => {
                    const tagId = child.id;
                    child.parentTag = tag;
                    articleMap[tagId] = articleMap[tagId] || [];
                    linkMap[tagId] = linkMap[tagId] || [];
                    child.articles = getMapCount(articleMap, child.id);
                    child.links = getMapCount(linkMap, child.id);
                    child.childs = 0;
                    child.parentTag = tag;
                    tagList.push(child); 
                    articleMap[tagId].forEach(item => articleSet.add(item.noteId))
                    linkMap[tagId].forEach(item => linkSet .add(item.noteId))
                });
                tag.articles = articleSet.size;
                tag.links = linkSet.size;
                tag.childs = tag.children.length;
                tag.parentTag = null;
            });
            setTagList(tagList);
        }
        callback().catch(() => {});
    }, []);

    const createMenu = () => (
        <Menu>
            <Menu.Item>
                <Link to={`/tag/create?level=1`}>一级标签</Link>                
            </Menu.Item>
            <Menu.Item>
                <Link to={`/tag/create?level=2`}>二级标签</Link>                
            </Menu.Item>
        </Menu>
    );

    const getMenu = (item: TagNode) => (
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
                        <BlogTreeSelect 
                            treeData={tagTree}
                            treeCheckable 
                            multiple 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={getTagList.loading} icon={<SearchOutlined/>}>
                        Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onResetForm} loading={getTagList.loading} icon={<RollbackOutlined/>}>
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
            <Spin spinning={getTagList.loading} style={{minHeight: 300}}>
                <section className="blp-tag-main">
                    {tagList.map(ele => <TagItem {...ele} menu={getMenu(ele)}/>)}
                </section>
            </Spin>
        </section>
    );
}