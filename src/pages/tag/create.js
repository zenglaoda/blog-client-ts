import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Select, Spin } from 'antd';
import tagAPI from '@/api/tag';
import utils from '@/lib/utils';
import './style/create.less';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};

@withRouter
class CreateTag extends React.Component {
    constructor(props) {
        super(props);
        const { location } = props;
        const query = utils.parseQuery(location.search);
        this.state = {
            list: [],
            loading: {
                summer: false,
            },
            level: Number(query.level) === 2 ? 2 : 1,
        };
    }

    onFinish = (form) => {
        form.pid = this.state.level === 1 ? 0 : form.pid;
        this.createTag(form);
    }

    // 设置加载状态
    setLoading(name = 'summer', show = false) {
        const loading = this.state.loading;
        loading[name] = show;
        this.setState({ loading });
    }

    // 创建标签
    createTag(params) {
        this.setLoading('summer', true);
        return tagAPI.create(params)
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
        return tagAPI.getList()
            .then((list) => {
                this.setState({
                    list: list.filter(ele => !ele.pid)
                });
            })
            .finally(() => {
                this.setLoading('summer');
            });
    }

    componentDidMount() {
        this.getList();
    }
    
    render() {
        const { list, loading, level } = this.state;
        const rules = {
            pid: [
                { required: true },
            ],
            name: [
                { required: true },
                { type: 'string', max: 30, min: 2 }
            ],
            description: [
                { type: 'string', max: 300 }
            ]
        };
        const initialValues = {
            pid: level === 2 ? '' : 0,
            name: '',
            description: '',
        };
        const TagSelect = (
            level === 2 ?
            <Form.Item name="pid" label="一级标签" rules={rules.pid}>
                <Select placeholder="请选择一级标签">
                    {list.map(tag => (<Select.Option value={tag.id} key={tag.id}>{tag.name}</Select.Option>))}
                </Select>
            </Form.Item>
            : null
        );

        return (
            <div className="blp-tag-create-page">
                <Spin spinning={loading.summer}>
                    <Form {...layout} initialValues={initialValues} onFinish={this.onFinish} className="blp-form">
                        {TagSelect}
                        <Form.Item name='name' label='标签名' rules={rules.name}>
                            <Input allowClear maxLength={30} placeholder='请输入标签名' autoComplete='off'/>
                        </Form.Item>
                        <Form.Item name='description' label='标签描述' rules={rules.description}>
                            <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入描述'/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type='primary' htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}
export default CreateTag;