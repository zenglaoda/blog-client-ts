import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Dropdown  } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import './style/index.less';

const { Paragraph } = Typography;

export default function NoteItem(props) {
    const { style, showType=false } = props;
    const isLink = Boolean(props.url);
    return (
        <section className="blc-note-component" style={style}>
            <div className="blc-note-title">
				<Link to={ isLink ? props.url : `/article/detail?id=${props.id}` } target="_blank">
					<span className="blc-note-title__text" title={props.title}>
						{props.title}      
					</span>
				</Link> 
            </div>
            <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}>
                {props.description}
            </Paragraph>
            <div className="blc-note-property">
                <span className="blc-note-property__time">
                    创建时间:&nbsp;
                    {props.createdAt}
                </span>
                <span className="blc-note-property__time">
                    更改时间:&nbsp;
                    {props.updatedAt}
                </span>
                {
					!showType ? null :
					<span className="blc-note-property__type">
						类型:&nbsp;
						{isLink ? '链接' : '文章'}
					</span>
				}
				{
					!props.menu ? null :
					<Dropdown overlay={props.menu} trigger="click">
						<EllipsisOutlined className="blc-note-menu"/>
					</Dropdown>
				}
            </div>
        </section>
    );
}