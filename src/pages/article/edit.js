import React, { useState, useEffect } from 'react';
import { Form, Button, message, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useHistory } from '@/lib/router';
import { parseQuery, compareIds } from '@/lib/utils';
import {ARTICLE_STATUS_MAP } from '@/enum/article';
import articleAPI from '@/api/article';
import BaseForm from './components/baseForm';
import './style/edit.less';

// TODO:  编辑器id替换成ref, editor.resize问题

function CreateArticlePage(props) {
    const query = parseQuery(props.location.search);
    const [isFirstStep, setFirstStep] = useState(false);
    const [loading, setLoading] = useState({ submit: false, getItem: true });
    const [loadError, setLoadError] = useState({ getItem: false });
    const [articleItem, setArticleItem] = useState();
    const [editor, setEditor] = useState();
    const [form] = Form.useForm();
    const history = useHistory();
    const summerLoading = Object.keys(loading).some(key => loading[key]);
    const saveLoading = loading.update;

    if (!query.id) {
        history.push('/article/create')
        return null;
    }

    const changeLoadingStatus = (status = {}) => {
        setLoading(preState => Object.assign({}, preState, status));
    };
    const changeLoadErrorStatus = (status = {}) => {
        setLoadError(preState => Object.assign({}, preState, status));
    };

    const onNextStep = () => {
        form.validateFields()
            .then(() => {
                setFirstStep(false);
            })
            .catch(() => {})
    };
    const onPreStep = () => {
        setFirstStep(true);
    };

    const saveArticle = (param) => {
        let data = null;
        const [adds, dels] = compareIds(param.tagIds, articleItem.tagIds);
        ['title', 'description', 'keyword', 'content', 'html'].forEach((key) => {
            if (articleItem[key] !== param[key]) {
                data = data || {};
                data[key] = param[key];
            }
        });
        if (adds.length || dels.length) {
            data = data || {};
            data.tagIds = param.tagIds;
        }
        if (!data) {
            return;
        }
        data.id = articleItem.id;

        changeLoadingStatus({ submit: true });
        articleAPI.update(data)
            .then(() => {
                setArticleItem(Object.assign(articleItem, data));
            })
            .catch(() => {})
            .finally(() => {
                changeLoadingStatus({ submit: false });
            });
    };

    const onSaveArticle = () => {
        const content = editor.getMarkdown();
        if (!content || !content.trim()) {
            message.error('请输入文章内容!');
            return;
        }
        const baseFormData = form.getFieldsValue();
        baseFormData.content = content;
        baseFormData.html = editor.getHTML();
        saveArticle(baseFormData);
    };

    useEffect(() => {
        const mdEditor = window.editormd('blp-articleEdit-editor', {
            width  : '100%',
            height : '600px',
            path   : '/editormd/lib/',
            theme : "dark",
            previewTheme : "dark",
            editorTheme : "pastel-on-dark",
            saveHTMLToTextarea: true
        });
        setEditor(mdEditor);
    }, []);

    useEffect(() => {
        changeLoadingStatus({ getItem: true });
        articleAPI.getItem({ id: query.id })
            .then((item) => {
                form.setFieldsValue({
                    title: item.title,
                    description: item.description,
                    tagIds: item.tags.map(ele => ele.tagId),
                    status: item.keyword
                });
                setArticleItem({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    tagIds: item.tags.map(ele => ele.tagId),
                    content: item.content,
                    html: item.html,
                    keyword: item.keyword,
                    status: item.status
                });
                changeLoadErrorStatus({ getItem: false });
            })
            .catch(() => {
                changeLoadErrorStatus({ getItem: true });
            })
            .finally(() => {
                changeLoadingStatus({ getItem: false });
            });
    }, [query.id]);

    // useEffect(() => {
    //     if (editor && !isFirstStep) {
    //         editor.resize();
    //         editor.setValue(articleItem.content);
    //     }
    // }, [editor, isFirstStep]);

    useEffect(() => {
        if (editor && articleItem) {
            editor.setValue(articleItem.content);
        }
    }, [editor, articleItem]);

    const StepSwitch = (
        isFirstStep ?
        <Button type="text" style={{padding: 0, marginRight: 20}} onClick={onNextStep} className="blp-articleEdit-header-button">
            下一步
            <RightOutlined />
        </Button> :
        <Button type="text" style={{padding: 0, marginRight: 20}} onClick={onPreStep} className="blp-articleEdit-header-button">
            <LeftOutlined />
            上一步
        </Button>
    );
    const ToolButtons = isFirstStep ? null : (
        (articleItem && articleItem.status === ARTICLE_STATUS_MAP.finished) ?
        <Button type="primary" loading={saveLoading} disabled={loadError.getItem || loading.getItem } onClick={()=>onSaveArticle()} className="blp-articleEdit-header-button">
            {saveLoading ? '保存中' : '保存文章'}
        </Button> :
        <Button type="primary" loading={saveLoading} disabled={loadError.getItem || loading.getItem } onClick={()=>onSaveArticle()} className="blp-articleEdit-header-button">
            {saveLoading ? '保存中' : '保存草稿'}
        </Button>
    );
    const StepTab = (
        <>
            <BaseForm style={{display: isFirstStep ? 'block' : 'none' }} form={form}/>
            <section id="blp-articleEdit-editor" className="blp-articleEdit-editor" style={{display: isFirstStep ? 'none' : 'block' }}>
                <textarea style={{display: 'none'}}/>
            </section>
        </>
    );

    return (
        <div className="blp-articleEdit-page">
            <Spin spinning={summerLoading}>
                <section className="blp-articleEdit-header">
                    {StepSwitch}{ToolButtons}
                </section>
                {StepTab}
            </Spin>
        </div>
    );
}

export default CreateArticlePage;