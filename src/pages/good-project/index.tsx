import * as React from 'react'; 
import { useState } from 'react';
import { Input } from 'antd';
import Card from './components/card';
import { projects } from './project';
import './style/index.less';

export default function RecommendPage() {
    const [cards, setCards] = useState([...projects]);
    const onSearch = (keyword: string) => {
        keyword = keyword.trim().toLowerCase();
        if (!keyword.length) {
            setCards([...projects]);
            return;
        }
        const list = projects.filter(ele => {
            const title = ele.title.toLowerCase();
            const summarize = ele.summarize.toLowerCase();
            return title.includes(keyword) || summarize.includes(keyword);
        });
        setCards(list);
    };

    return (
        <div className="blp-recommend-page">
            <div className="blp-header">
                <Input.Search placeholder="input search text" onSearch={onSearch} enterButton />
            </div>
            <div className="blp-main">
                {
                    cards.map((item, index) => <Card key={index} {...item} className="blp-card"/>)
                }
            </div>
        </div>
    )
}