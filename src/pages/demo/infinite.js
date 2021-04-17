

import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
};

const loaderStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%)'
};

export default function DemoPage() {
    const [hasMore, setHasMore] = useState(true);
    // Array.from({ length: 20 }) 返回一个长度为20的数组，每个元素都是undefined
    const [items, setItems] = useState(Array.from({ length: 20 }));

    const fetchMoreData = () => {
        if (items.length >= 100) {
            setHasMore({ hasMore: false });
            return;
        }

        setTimeout(() => {
            setItems(items.concat(Array.from({ length: 20 })));
        }, 500);
    };

    const loader = (
        <div style={loaderStyle}>
            loding
        </div>
    );

    // style={{position: 'relative'}}
    // dataLength={items.length}   当前列表的长度
    // next={fetchMoreData} 滚动时的回调函数，用来加载数据
    // hasMore={hasMore} 是否已经全部加载
    // loader={loader} 加载过程需要展示的动画
    // height={400} 容器的高度

    return (
        <div>
            <h1>demo: react-infinite-scroll-component</h1>
            <InfiniteScroll
                style={{position: 'relative'}}
                dataLength={items.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={loader}
                height={400}
            >
                {items.map((i, index) => (
                    <div style={style} key={index}>
                        div - #{index}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );

}