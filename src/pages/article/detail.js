import React, { useEffect, useState } from 'react';
import { PageHeader, Descriptions, Spin, Typography  } from 'antd';
import articleAPI from '@/api/article';
import { parseQuery } from '@/lib/utils';
import { useHistory } from '@/lib/router';
import { ARTICLE_STATUS_LABEL } from '@/enum/article';
import './style/detail.less';

const { Title } = Typography;

export default function ArticleDetailPage(props) {
    const query = parseQuery(props.location.search);
    const [articleItem, setArticleItem] = useState({ tags: [] });
    const [loading, setLoading] = useState({ getItem: true });
    const history = useHistory();
    const summerLoading = Object.keys(loading).some(key => loading[key]);

    const changeLoadingStatus = (status = {}) => {
        setLoading(preState => Object.assign({}, preState, status));
    };

    useEffect(() => {
        changeLoadingStatus({ getItem: true });
        articleAPI.getItem({ id: query.id })
            .then((item) => {
                setArticleItem(item);
                const markdown = item.content;
                editormd.markdownToHTML("blp-articleDetail-article__content", {
                    markdown        : markdown ,//+ "\r\n" + $("#append-test").text(),
                    //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
                    htmlDecode      : "style,script,iframe",  // you can filter tags decode
                    //toc             : false,
                    tocm            : true,    // Using [TOCM]
                    //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
                    //gfm             : false,
                    //tocDropdown     : true,
                    // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
                    emoji           : true,
                    taskList        : true,
                    tex             : true,  // 默认不解析
                    flowChart       : false,  // 默认不解析
                    sequenceDiagram : false,  // 默认不解析
                });
            })
            .catch(() => {})
            .finally(() => {
                changeLoadingStatus({ getItem: false });
            })
    }, [query.id]);

    return (
        <div className="blg-fullscreen blp-articleDetail-page">
            <Spin spinning={summerLoading}>
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
                            {articleItem.tags.map(tag => tag.tagName).join(' , ')}
                        </Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <div className="blp-articleDetail-main">
                    <section className="blp-articleDetail-article">
                        <Title className="blp-articleDetail-article__title">
                            {articleItem.title}
                        </Title>
                        <div className="blp-articleDetail-article__description">
                            {articleItem.description}
                        </div>
                        <div id="blp-articleDetail-article__content" className="blp-articleDetail-article__content">
                            <textarea id="blp-articleDetail-article-text" style={{display: 'none'}}/>
                        </div>
                    </section>
                </div>
            </Spin>
        </div>
    );
}