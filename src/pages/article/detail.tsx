import * as React from 'react';
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PageHeader, Descriptions, Spin, Typography  } from 'antd';
import { useHistory } from 'react-router-dom';
import { getArticleAPI } from '@/api/article';
import { parseQuery } from '@/lib/utils';
import useRequest from '@/lib/hooks/useRequest';
import { ARTICLE_STATUS_LABEL } from '@/enum/article';
import { Article } from './types';
import './style/detail.less';

const { Title } = Typography;

export default function ArticleDetailPage(props: RouteComponentProps) {
    const history = useHistory();
    const [articleItem, setArticleItem] = useState<Article>({} as Article);
    const getArticle = useRequest(getArticleAPI);
    const query = parseQuery(props.location.search);

    useEffect(() => {
        if (!query.id) {
            return;
        }
        getArticle({ id: query.id })
            .then((item) => {
                setArticleItem(item);
                editormd.markdownToHTML('blp-editor', {
                    markdown        : item.content,
                    htmlDecode      : "style,script,iframe",
                    tocm            : true,
                    gfm             : true,
                    emoji           : true,
                    taskList        : true,
                    tex             : true,
                    flowChart       : false,
                    sequenceDiagram : false,
                });
            })
            .catch(() => {})
    }, [query.id]);

    if (!query.id) {
        return null;
    }

    return (
        <div className="blg-fullscreen blp-articleDetail-page">
            <Spin spinning={getArticle.loading}>
                <PageHeader
                    ghost={false}
                    onBack={() => history.push('/article')}
                    title="笔记详情"
                    subTitle={articleItem.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建时间">
                            {articleItem.createdAt}
                        </Descriptions.Item>
                        <Descriptions.Item label="更新时间">
                            {articleItem.updatedAt}
                        </Descriptions.Item>
                        <Descriptions.Item label="状态">
                            {ARTICLE_STATUS_LABEL[articleItem.status]}
                        </Descriptions.Item>
                        <Descriptions.Item label="关键字">
                            {articleItem.keyword}
                        </Descriptions.Item>
                        <Descriptions.Item label="所属标签">
                            {articleItem.tag && articleItem.tag.name}
                        </Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <div className="blp-main">
                    <section className="blp-article">
                        <Title level={2} className="blp-title">
                            {articleItem.title}
                        </Title>
                        <div className="blp-description">
                            {articleItem.description}
                        </div>
                        <div className="blp-content" id="blp-editor">
                            <textarea style={{display: 'none'}}/>
                        </div>
                    </section>
                </div>
            </Spin>
        </div>
    );
}