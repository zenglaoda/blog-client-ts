import * as React from 'react';
import { Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import './style/index.less';

enum Status {
    todo = 0, // 未开始
    Pending = 1, // 进行中
    Resolve = 2, // 已完成
    Reject = 3 // 未完成
};


type Target = {
    label: string,
    content: string,
    status: Status
};

const list = [
    {
        year: '2021',
        month: '4',
        content: '博客 typescript 迁移, vue2.0源码阅读结束',
        status: Status.Pending,
        children: [
            {
                date: '25',
                status: Status.Pending,
                content: 'vue源码阅读完毕'
            },
            {
                date: '30',
                status: Status.todo,
                content: 'Vue 3.0 composition API 学习'
            }
        ]
    },
    {
        year: '2021',
        month: '5',
        content: 'webpack4 配置回顾，优化; 迁移至webpack5, webpack 工程化, babel 配置',
        status: Status.todo,
        children: [
            {
                date: '15',
                status: Status.todo,
                content: 'webpack4 配置回顾，优化; vuex 3.0源码阅读'
            },
            {
                date: '22',
                status: Status.todo,
                content: '迁移至webpack5, vue 3.0 源码阅读'
            },
            {
                date: '27',
                status: Status.todo,
                content: 'babel配置, vue-router 3.0 源码阅读'
            },
            {
                date: '31',
                status: Status.todo,
                content: 'webpack 工程化初试'
            }
        ] 
    }
];

const targets: Target[] = [];

list.forEach(item => {
    targets.push({
        label: `${item.year}年-${item.month}月`,
        content: item.content,
        status: item.status
    });
    item.children.forEach(ele => {
        targets.push({
            label: `${ele.date}日`,
            content: ele.content,
            status: ele.status
        });
    });
});


export default function StageTargetPage() {
    const statusProp = {
        [Status.todo]: {
            color: 'gray'
        },
        [Status.Pending]: {
            dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />
        },
        [Status.Resolve]: {
            color: 'green'
        },
        [Status.Reject]: {
            color: 'red'
        }
    };

    return (
        <div className='blp-target' style={{width: 500}}>
            <Timeline mode='left'>
                {
                    targets.map(item => (
                    <Timeline.Item 
                        key={item.label} 
                        label={item.label}
                        {...statusProp[item.status]}
                    >
                        {item.content}
                    </Timeline.Item>))
                }
            </Timeline>
        </div>
    );
}