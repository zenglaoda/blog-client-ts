import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Button, message, Spin, Input, Radio, Modal } from 'antd';
import { SaveOutlined } from '@ant-design/icons'
import { createArticleAPI, updateArticleAPI, getArticleAPI } from '@/api/article';
import { getTagListAPI } from '@/api/tag';
import { ARTICLE_STATUS } from '@/enum/article';
import { setTagTreeLeafSelectable } from '@/common/utils';
import { layout } from '@/common/layout';
import { getChangedData, parseQuery } from '@/lib/utils';
import { useRequest } from '@/lib/hooks';
import BlogTreeSelect from '@/components/tree-select';
import { Rules } from '@/types';
import { Article } from '@/pages/article/types'
import { Tag, TagTreeNode } from '@/pages/tag/types'
import './style/create.less';

type FormData = {
    id?: number,
    title: string,
    tagId?: string,
    status: string,
    keyword?: string,
    description: string,
    content?: string,
};

const EDITOR_HEIGHT = '600px';
const EDITOR_WIDTH = '100%';

const rules: Rules = {
    title: [
        { required: true },
        { whitespace: true },
        { type: 'string', max: 60, min: 2 }
    ],
    status: [
        { 
            required: true, 
            type: 'enum', 
            enum: [ARTICLE_STATUS.draft.value, ARTICLE_STATUS.finished.value]
        }
    ],
    description: [
        { type: 'string', max: 300 },
        { whitespace: true }
    ],
    keyword: [
        { required: true,},
        { type: 'string', max: 300,whitespace: true },
    ],
    tagId: [
        { required: true, type: 'integer' },
    ],
};

const initialValues = {
    title: '',
    tagId: null,
    status: ARTICLE_STATUS.draft.value,
    keyword: '',
    description: '',
};


export default function CreateArticlePage(props: RouteComponentProps) {
    const query = parseQuery(props.location.search);
    const [isFirstStep, setFirstStep] = useState<boolean>(!query.id);
    const [articleItem, setArticleItem] = useState<Article | null>(null);
    const [tagTree, setTagTree] = useState<TagTreeNode[]>([]);
    const [editor, setEditor] = useState<any>();
    const contentChangedRef = useRef(false);
    const [form] = Form.useForm();
    const getTagList = useRequest(getTagListAPI);
    const getArticle = useRequest(getArticleAPI);
    const createArticle = useRequest(createArticleAPI, { unmountAbort: false });
    const updateArticle = useRequest(updateArticleAPI, { unmountAbort: false });
    const summerLoading = [createArticle, updateArticle, getTagList, getArticle].some(item => item.loading);
    const saveLoading = [updateArticle, createArticle].some(item => item.loading);

    const editArticle = (params: FormData) => {
        return updateArticle(params)
            .then((res) => {
                setArticleItem(res);
                contentChangedRef.current = false;
            })
    };

    const addArticle = (params: FormData) => {
        return createArticle(params)
            .then((res) => {
                setArticleItem(res);
                contentChangedRef.current = false;
            })
    };

    const onSubmit = () => {
        const baseFormData = form.getFieldsValue();
        const content = editor.getMarkdown();
        const draft = ARTICLE_STATUS.draft.value;
        const finished = ARTICLE_STATUS.finished.value;
        baseFormData.content = content;

        const cb = () => {
            if (!articleItem) {
                addArticle(baseFormData);
                return;
            }
            let params: FormData = getChangedData(baseFormData, articleItem, ['tagId', 'title', 'description', 'keyword', 'content', 'status']);
            if (!params) {
                message.info('未作任何修改!');
                return;
            }
            if (content.trim().length < 20 && finished === params.status) {
                message.info('请完善文章内容!');
                return;
            }
        
            params = baseFormData;
            params.id = articleItem.id;
            !contentChangedRef.current && (params.content = '');

            if (params.status === draft && articleItem.status === finished) {
                Modal.confirm({
                    title: `确定将【已完成】文章存为【草稿】?`,
                    onOk() {
                        return editArticle(params);
                    },
                    onCancel() {
                        updateArticle.cancel();
                    },
                });
                return;
            }

            editArticle(params)
        }

        form.validateFields()
            .then(() => {
                cb();
            })
            .catch(() => {
                setFirstStep(true);
            });
        
    };

    // 初始化编辑器
    useEffect(() => {
        window.editormd('blp-editor', {
            width  : EDITOR_WIDTH,
            height : EDITOR_HEIGHT,
            path   : '/editormd/lib/',
            // theme : "dark",
            // previewTheme : "dark",
            // editorTheme : "pastel-on-dark",
            saveHTMLToTextarea: true,
            onchange() {
                contentChangedRef.current = true;
            },
            onload() {
                setEditor(this);
                this.resize();
            },
            onfullscreenExit() {
                // 修复尺寸丢失的问题
                this.resize(EDITOR_WIDTH, EDITOR_HEIGHT);
            },
        });
    }, []);

    // 重置编辑器尺寸
    useEffect(() => {
        if (!editor || isFirstStep) return;
        editor.resize();
    }, [isFirstStep, editor]);

    // 设置编辑器内容
    useEffect(() => {
        if (!editor) return

        const content = articleItem && articleItem.content || '';
        editor.setMarkdown(content);
    }, [editor, articleItem && articleItem.content]);
    
    // 获取详情
    useEffect(() => {
        if (query.id) {
            getArticle({ id: query.id })
                .then((item) => {
                    setArticleItem(item);
                    form.setFieldsValue({
                        title: item.title,
                        tagId: item.tagId,
                        status: item.status,
                        description: item.description,
                        keyword: item.keyword,
                    });
                })
            return;
        }

        setArticleItem(null);
        form.setFieldsValue({...initialValues});
    }, [query.id])

    // 获取tagList
    useEffect(() => {
        getTagList()
            .then((tags: Tag[]) => {
                setTagTree(setTagTreeLeafSelectable(tags));
            })
    }, []);

    return (
        <div className="blp-articleCreate-page">
            <section className="blp-header">
                <div>
                    <Radio.Group value={isFirstStep} onChange={(event) => setFirstStep(event.target.value)}>
                        <Radio.Button value={true}>基础信息</Radio.Button>
                        <Radio.Button value={false}>文章内容</Radio.Button>
                    </Radio.Group>
                </div>
                <div>
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        loading={saveLoading} 
                        disabled={!editor}
                        onClick={() => onSubmit()}
                    >
                        {saveLoading ? '保存中...' : '保存'}
                    </Button>
                </div>
            </section>

            <Spin spinning={summerLoading}>
                <section className="blp-form" style={{display: isFirstStep ? 'block' : 'none' }}>
                    <Form form={form} initialValues={initialValues} {...layout}>
                        <Form.Item name='title' label='标题' rules={rules.title}>
                            <Input allowClear maxLength={60} placeholder='请输入标题' autoComplete='off'/>
                        </Form.Item>
                        <Form.Item name="tagId" label="标签" rules={rules.tagId}>
                            <BlogTreeSelect treeData={tagTree} multiple={false} style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item name="status" label="状态" rules={rules.status}>
                            <Radio.Group>
                                <Radio value={ARTICLE_STATUS.finished.value}>{ARTICLE_STATUS.finished.label}</Radio>
                                <Radio value={ARTICLE_STATUS.draft.value}>{ARTICLE_STATUS.draft.label}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name='keyword' label='关键字' rules={rules.keyword}>
                            <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入关键字'/>
                        </Form.Item>
                        <Form.Item name='description' label='文章描述' rules={rules.description}>
                            <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入描述'/>
                        </Form.Item>
                    </Form>
                </section>

                <section className="blp-editor" style={{display: isFirstStep ? 'none' : 'block' }}>
                    <div id="blp-editor">
                        <textarea style={{display: 'none'}}/>
                    </div>
                </section>
            </Spin>
        </div>
    );
}
