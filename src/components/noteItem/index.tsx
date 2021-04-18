import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Dropdown  } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import TimeGo from '@/components/time-go';
import './style/index.less';

const { Paragraph } = Typography;

type Props = {
    title: string,
    // 笔记id
    id: number,
    menu: JSX.Element,
    description: string,
    // 是否显示笔记类型
    showType?: boolean,
    // 链接地址
    url?: string,
    style?: any,
};

export default function NoteItem(props: Props) {
    const { style, showType = false } = props;
    const isLink = Boolean(props.url);
    return (
        <section className="blc-note-component" style={style}>
            <div className="blc-note-title">
                {
                    isLink ?
                    <a href={props.url} target="_blank">
                        <span className="blc-note-title__text" title={props.title}>
                            {props.title}      
                        </span>
                    </a>
                    :
                    <Link to={`/article/detail?id=${props.id}` }>
                        <span className="blc-note-title__text" title={props.title}>
                            {props.title}      
                        </span>
                    </Link>
                }
            </div>
            <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}>
                {props.description}
            </Paragraph>
            <div className="blc-note-property">
                <span className="blc-note-property__time">
                    更改时间:&nbsp;
                    <TimeGo date={props.updatedAt}/>
                </span>
                {
					showType ?
					<span className="blc-note-property__type">
						类型:&nbsp;
						{isLink ? '链接' : '文章'}
					</span>
                    :null
				}
				{
					!props.menu ? null :
					<Dropdown overlay={props.menu}>
						<EllipsisOutlined className="blc-note-menu"/>
					</Dropdown>
				}
            </div>
        </section>
    );
}