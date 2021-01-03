import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Button, Spin, Menu, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import NoteItem from '@/components/noteItem'; 
import articleAPI from '@/api/article';
import './style/draft.less';

function ArticlePage() {
    const [draftList, setDraftList] = useState([]);
    const [loading, setLoading] = useState({ getDraftList: true, destroy: false, update: false });

    const changeLoadingState = (state = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, state));
    };

    const removeItem = (item) => {
        setDraftList(draftList.filter(ele => ele !== item));
    };
    const onChangeItemStatus = (item) => {
        Modal.confirm({
            title: `确定将草稿 "${item.title}" 标记为为完成?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                changeLoadingState({ update: true });
                return articleAPI.updateStatus({ id: item.id })
                    .then(() => {
                        removeItem(item);
                    })
                    .finally(() => {
                        changeLoadingState({ update: false });
                    });
            },
            onCancel() {},
        });
    };
    const onDeleteNoteItem = (item) => {
        Modal.confirm({
            title: `确定删除草稿 "${item.title}" ?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                changeLoadingState({ destroy: true });
                return articleAPI.destroy({ id: item.id })
                    .then(() => {
                        removeItem(item);
                    })
                    .finally(() => {
                        changeLoadingState({ destroy: false });
                    });
            },
            onCancel() {},
        });
    };

    const getMenu = (item) => (
        <Menu>
            <Menu.Item>
                <Link to={`/article/edit?id=${item.id}`}>编辑</Link>                
            </Menu.Item>
            <Menu.Item onClick={() => onChangeItemStatus(item)}>
                完成
            </Menu.Item>
            <Menu.Item danger onClick={() => onDeleteNoteItem(item)}>
                删除
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        changeLoadingState({ getDraftList: true });
        articleAPI.getDraftList({})
            .then((list) => {
                setDraftList(list || []);
            })
            .catch(() => {})
            .finally(() => changeLoadingState({ getDraftList: false }))        
    }, []);

    return (
        <section className="blp-draft-page">
            <section className="blg-action">
                <Link to="/article/create">
                    <Button icon={<PlusOutlined />} >
                        新增文章
                    </Button>
                </Link>
            </section>
            <section className="blp-draft-main">
                <Spin spinning={loading.getDraftList}>
                    {draftList.map(item => <NoteItem key={String(item.id)} {...item} menu={getMenu(item)}/>)}
                </Spin>
            </section>
        </section>
    );
}

export default ArticlePage;