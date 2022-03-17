import * as React from 'react';
import { Suspense, lazy } from 'react';
import { Route, Link, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { TagsOutlined, FileTextOutlined, FileSearchOutlined, LinkOutlined, ToolOutlined, FireOutlined, FlagOutlined } from '@ant-design/icons';
import { SelectInfo } from 'rc-menu/lib/interface';

// 页面加载过渡组件
import PageLoad from '@/components/page-load';

import './style/index.less';

// 异步加载页面
const goodProjectPage = lazy(() => import('@/pages/good-project'));
const StageTargetPage = lazy(() => import('@/pages/stage-target'));
const ToolSitePage = lazy(() => import('@/pages/tool-site'));
const TagPage = lazy(() => import('@/pages/tag'));
const TagCreatePage = lazy(() => import('@/pages/tag/create'));
const TagEditPage = lazy(() => import('@/pages/tag/edit'));
const LinkPage = lazy(() => import('@/pages/link'));
const LinkCreatePage = lazy(() => import('@/pages/link/create'));
const LinkEditPage = lazy(() => import('@/pages/link/edit'));
const ArticlePage = lazy(() => import('@/pages/article'));
const ArticleCreatePage = lazy(() => import('@/pages/article/create'));
const ArticleDetailPage = lazy(() => import('@/pages/article/detail'));


type State = {
    selectedKeys: string[]
};


const { Header, Content, Sider } = Layout;
class Main extends React.Component<RouteComponentProps, State> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            selectedKeys: ['/article']
        };
    }

    componentDidMount() {
        const pathname = this.props.location.pathname;
        const matches = pathname.match(/\/[^/]*/g)!;
        this.setState({
            selectedKeys: [matches[0]]
        });
    }

    onMenuChange = (info: SelectInfo) => {
        this.setState({
            selectedKeys: (info.selectedKeys as string[]) 
        });
    }

    render() {
        const { selectedKeys } = this.state;
        const { onMenuChange } = this;

        return (
            <Layout className="bll-wrapper">
                <Header className="bll-header">
                    <div className="logo" />
                </Header>
                <Layout className="bll-body">
                    <Sider width={200} className="bll-aside">
                        <Menu
                            mode="inline"
                            onSelect={onMenuChange}
                            defaultSelectedKeys={['/article']}
                            defaultOpenKeys={['/article']}
                            selectedKeys={selectedKeys}
                            style={{ height: '100%', borderRight: 0 }}>
                            <Menu.Item key="/dashboard" icon={<FileSearchOutlined />}>
                                <Link to="/dashboard">大盘</Link>
                            </Menu.Item>
                            <Menu.Item key="/article" icon={<FileTextOutlined />}>
                                <Link to="/article">文章</Link>
                            </Menu.Item>
                            <Menu.Item key="/link" icon={<LinkOutlined />}>
                                <Link to="/link">链接</Link>
                            </Menu.Item>
                            <Menu.Item key="/tag" icon={<TagsOutlined />}>
                                <Link to="/tag">标签</Link>
                            </Menu.Item>
                            <Menu.Item key="/goodproject" icon={<FireOutlined />}>
                                <Link to="/goodproject">优质项目</Link>
                            </Menu.Item>
                            <Menu.Item key="/toolsite" icon={<ToolOutlined />}>
                                <Link to="/toolsite">工具站点</Link>
                            </Menu.Item>
                            <Menu.Item key="/stagetarget" icon={<FlagOutlined />}>
                                <Link to="/stagetarget">阶段目标</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                
                    <div className="bll-main">
                        <Content className="bll-content">
                            <Suspense fallback={<PageLoad/>}>
                                <Switch>
                                    <Route path="/tag" component={TagPage} exact/>
                                    <Route path="/tag/create" component={TagCreatePage} exact/>
                                    <Route path="/tag/edit" component={TagEditPage} exact/>
                                    <Route path="/link" component={LinkPage} exact/>
                                    <Route path="/link/create" component={LinkCreatePage} exact/>
                                    <Route path="/link/edit" component={LinkEditPage} exact/>
                                    <Route path="/article" component={ArticlePage} exact/>
                                    <Route path="/article/create" component={ArticleCreatePage} exact/>
                                    <Route path="/article/edit" component={ArticleCreatePage} exact/>
                                    <Route path="/article/detail" component={ArticleDetailPage} exact/>
                                    <Route path="/goodproject" component={goodProjectPage} exact/>
                                    <Route path="/stagetarget" component={StageTargetPage} exact/>
                                    <Route path="/toolsite" component={ToolSitePage} exact/>
                                    <Route exact component={goodProjectPage}/>
                                </Switch>
                            </Suspense>
                        </Content>
                    </div>
                </Layout>
            </Layout>
        );
    }
}
export default withRouter(Main)