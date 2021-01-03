import React from 'react';
import { Typography, Dropdown  } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import './style/index.less';

const { Paragraph } = Typography;

function TagItem(props) {
    const { style } = props;
    return (
        <section className="blpc-tagItem-component" style={style}>
            <div className="blpc-tagItem-title">
                <div className="blpc-tagItem-title__text">{props.name}</div>
            </div>
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} className="blpc-tagItem-description">
                {props.description}
            </Paragraph>
            <div className="blpc-tagItem-property">
                {
                    props.pid ?
                    <span className="blpc-tagItem-property__item">
                        一级标签:&nbsp;
                        {props.parentTag && props.parentTag.name}
                    </span>
                    :
                    <span className="blpc-tagItem-property__item">
                        子标签数:&nbsp;
                        {props.childs}
                    </span>
                }
                <span className="blpc-tagItem-property__item">
                    文章数:&nbsp;
                    {props.articles}
                </span>
                <span className="blpc-tagItem-property__item">
                    链接数:&nbsp;
                    {props.links}
                </span>
            </div>
            <div className="blpc-tagItem-property">
                <span className="blpc-tagItem-property__item">
                    创建时间:&nbsp;
                    {props.createdAt}
                </span>
                {
					!props.menu ? null :
					<Dropdown overlay={props.menu} trigger="click">
						<EllipsisOutlined className="blpc-tagItem-menu"/>
					</Dropdown>
				}
            </div>
        </section>
    );
}
export default TagItem;