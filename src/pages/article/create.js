import React, { useState, useEffect } from 'react';
import {Form, Button, message, Spin} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import articleAPI from '@/api/article';
import { compareIds } from '@/lib/utils';
import { ARTICLE_STATUS_MAP } from '@/enum/article';
import BaseForm from './components/baseForm';
import './style/create.less';

// TODO:  编辑器id替换成ref

function CreateArticlePage() {
    const [isFirstStep, setFirstStep] = useState(true);
    const [loading, setLoading] = useState({ create: false, update: false });
    const [editor, setEditor] = useState();
    const [articleItem, setArticleItem] = useState(null);
    const [form] = Form.useForm();
    const summerLoading = Object.keys(loading).some(key => loading[key]);
    const saveLoading = loading.create || loading.update;

    const changeLoadingStatus = (status = {}) => {
        setLoading(preLoading => Object.assign({}, preLoading, status));
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

    const createArticle = (param) => {
        changeLoadingStatus({ create: true });
        articleAPI.create(param)
            .then((res) => {
                res.tagIds = res.tags.map(tag => tag.tagId);
                delete res.tags;
                setArticleItem(res);
            })
            .catch(() => {})
            .finally(() => {
                changeLoadingStatus({ create: false });
            });
    };
    const updateArticle = (param) => {
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
        changeLoadingStatus({ update: true });
        articleAPI.update(data)
            .then(() => {
                setArticleItem(Object.assign(articleItem, data));
            })
            .catch(() => {})
            .finally(() => {
                changeLoadingStatus({ update: false });
            });
    };
    const onSaveArticle = (status) => {
        const content = editor.getMarkdown();
        if (!content || !content.trim()) {
            message.error('请输入文章内容!');
            return;
        }
        const baseFormData = form.getFieldsValue();
        baseFormData.content = content;
        baseFormData.html = editor.getHTML();
        if (articleItem) {
            updateArticle(baseFormData);
        } else {
            baseFormData.status = String(status);
            createArticle(baseFormData);
        }
    };

    useEffect(() => {
        const editor = window.editormd('blp-articleCreate-editor', {
            width  : '100%',
            height : '600px',
            path   : '/editormd/lib/',
            theme : "dark",
            previewTheme : "dark",
            editorTheme : "pastel-on-dark",
            saveHTMLToTextarea: true
        });
        setEditor(editor);
    }, []);

    useEffect(() => {
        if (editor && !isFirstStep) {
            editor.resize();
        }
    }, [editor, isFirstStep]);

    useEffect(() => {
        form.setFieldsValue({
            title: '',
            description: '',
            keyword: '',
            tagIds: []
        });
    }, [])

    const StepSwitch = (
        isFirstStep ?
        <Button type="text" style={{padding: 0, marginRight: 20}} onClick={onNextStep} className="blp-articleCreate-header-button">
            下一步
            <RightOutlined />
        </Button> :
        <Button type="text" style={{padding: 0, marginRight: 20}} onClick={onPreStep} className="blp-articleCreate-header-button">
            <LeftOutlined />
            上一步
        </Button>
    );
    const ToolButtons = isFirstStep ? null : (
        (articleItem && articleItem.status === ARTICLE_STATUS_MAP.finished) ?
            <Button type="primary" loading={saveLoading} onClick={()=>onSaveArticle(1)} className="blp-articleCreate-header-button">
                {saveLoading ? '保存中' : '保存文章'}
            </Button> :
            <Button type="primary" loading={saveLoading} onClick={()=>onSaveArticle(2)} className="blp-articleCreate-header-button">
                {saveLoading ? '保存中' : '保存草稿'}
            </Button>
    );
    const StepTab = (
        <>
            <BaseForm style={{display: isFirstStep ? 'block' : 'none' }} form={form}/>
            <section className="blp-articleCreate-editor" style={{display: isFirstStep ? 'none' : 'block' }}>
                <div id="blp-articleCreate-editor">
                    <textarea style={{display: 'none'}}/>
                </div>
            </section>
        </>
    );

    return (
        <div className="blp-articleCreate-page">
            <Spin spinning={summerLoading}>
                <section className="blp-articleCreate-header">
                    {StepSwitch}{ToolButtons}
                </section>
                {StepTab}
            </Spin>
        </div>
    );
}

export default CreateArticlePage;