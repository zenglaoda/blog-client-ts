import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button, Select, Spin } from 'antd';
import { layout, tailLayout } from '@/common/layout';
import { createTagAPI, getTagListAPI } from '@/api/tag';
import { parseQuery } from '@/lib/utils';
import { CreateAPI } from '@/types';
import { rules } from './common';
import { Tag, FormData } from './types';
import './style/create.less';

type Loading = { [prop:string]: boolean };
type State = {
    list: Array<Tag>
    level: number,
    loading: Loading
};

class CreateTag extends React.Component<RouteComponentProps, State> {
    public getTagList: CreateAPI | null = null;

    constructor(props: RouteComponentProps) {
        super(props);
        const { location } = props;
        const query = parseQuery(location.search);
        this.state = {
            list: [],
            level: Number(query.level) === 2 ? 2 : 1,
            loading: {
                summer: false,
                create: false
            },
        };
    }

    // 设置加载状态
    setLoading(name = 'summer', show = false) {
        this.setState(({ loading } : State) => {
            loading[name] = show;
            return {
                ...this.state,
                loading
            };
        });
    }

    // 创建标签
    createTag(params: FormData) {
        this.setLoading('create', true);
        return createTagAPI().request(params)
            .finally(() => {
                this.setLoading('create', false);
            })
            .then(() => {
                this.props.history.push('/tag');
            })
            .catch(() => {});
    }

    // 获取标签列表
    getList() {
        if (this.state.level !== 2) {
            return;
        }
        this.setLoading('summer', true);
        this.getTagList = getTagListAPI(); 
        return this.getTagList.request()
            .then((list) => {
                this.setState({
                    list: list.filter((ele: Tag) => !ele.pid)
                });
            })
            .finally(() => {
                this.setLoading('summer');
            })
            .catch(() => {});
    }

    onFinish = (form: FormData) => {
        form.pid = this.state.level === 1 ? 0 : form.pid;
        this.createTag(form);
    }

    componentDidMount() {
        this.getList();
    }

    componentWillUnmount() {
        this.getTagList && this.getTagList.cancel();
    }
    
    render() {
        const { list, loading, level } = this.state;
        const initialValues = {
            pid: level === 2 ? '' : 0,
            name: '',
            description: '',
        };
        const TagSelect = (
            level === 2 ?
            <Form.Item name="pid" label="一级标签" rules={rules.pid}>
                <Select placeholder="请选择一级标签" showSearch allowClear optionFilterProp="label">
                    {list.map(tag => (<Select.Option value={tag.id} key={tag.id} label={tag.name}>{tag.name}</Select.Option>))}
                </Select>
            </Form.Item>
            : null
        );

        return (
            <div className="blp-tagCreate-page">
                <Spin spinning={loading.summer || loading.create}>
                    <Form {...layout} initialValues={initialValues} onFinish={this.onFinish} className="blp-form">
                        {TagSelect}
                        <Form.Item name='name' label='标签名' rules={rules.name}>
                            <Input allowClear maxLength={30} placeholder='请输入标签名' autoComplete='off'/>
                        </Form.Item>
                        <Form.Item name='description' label='描述' rules={rules.description}>
                            <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入描述'/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type='primary' loading={loading.create} htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}
export default withRouter(CreateTag);