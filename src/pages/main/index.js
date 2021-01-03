import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { TagsOutlined, FileTextOutlined, FileSearchOutlined, LinkOutlined, SnippetsOutlined } from '@ant-design/icons';
import TagPage from '@/pages/tag/index';
import TagCreatePage from '@/pages/tag/create';
import TagEditPage from '@/pages/tag/edit';
// import LinkPage from '@/pages/link/index';
// import LinkCreatePage from '@/pages/link/create';
// import LinkEditPage from '@/pages/link/edit';
// import ArticlePage from '@/pages/article';
// import ArticleCreatePage from '@/pages/article/create';
// import ArticleEditPage from '@/pages/article/edit';
// import ArticleDetailPage from '@/pages/article/detail';
// import DraftPage from '@/pages/article/draft';
// 学习页面
// import EffectPage from '@/study/hooks/useEffect';
import './style/index.less';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default class Main extends React.Component {
    render() {
        return (
            <Layout className="bll-main-wrapper">
                <Header className="bll-header">
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    </Menu>
                </Header>
                <Layout className="bll-body">
                    <Sider width={200} className="bll-aside">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}>
                            <Menu.Item key="menu1" icon={<FileSearchOutlined />}>
                                <Link to="/note">笔记</Link>
                            </Menu.Item>
                            <Menu.Item key="menu3" icon={<FileTextOutlined />}>
                                <Link to="/article">文章</Link>
                            </Menu.Item>
                            <Menu.Item key="menu4" icon={<LinkOutlined />}>
                                <Link to="/link">链接</Link>
                            </Menu.Item>
                            <Menu.Item key="menu6" icon={<TagsOutlined />}>
                                <Link to="/tag">标签</Link>
                            </Menu.Item>
                            <Menu.Item key="menu5" icon={<SnippetsOutlined />}>
                                <Link to="/draft">草稿</Link>
                            </Menu.Item>
                            {/* // 学习页面 */}
                            <SubMenu key="sub1" title="study">
                                <Menu.Item key="1">
                                    <Link to="/study/effect">useEffect</Link>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                
                    <div className="bll-main">
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content className="bll-content">
                            <Switch>
                                <Route path="/tag" component={TagPage} exact/>
                                <Route path="/tag/create" component={TagCreatePage} exact/>
                                <Route path="/tag/edit" component={TagEditPage} exact/>
                                {/* <Route path="/link" component={LinkPage} exact/>
                                <Route path="/link/create" component={LinkCreatePage} exact/>
                                <Route path="/link/edit" component={LinkEditPage} exact/>
                                <Route path="/article" component={ArticlePage} exact/>
                                <Route path="/article/create" component={ArticleCreatePage} exact/>
                                <Route path="/article/edit" component={ArticleEditPage} exact/>
                                <Route path="/article/detail" component={ArticleDetailPage} exact></Route>
                                <Route path="/draft" component={DraftPage} exact/> */}

                                {/* // 学习页面 */}
                                {/* <Route path="/study/effect" component={EffectPage} exact/> */}
                            </Switch>
                        </Content>
                    </div>
                </Layout>
            </Layout>
        );
    }
}