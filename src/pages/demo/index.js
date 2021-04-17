import React, { useState, useEffect, useRef } from 'react';

// 无限滚动组件
function InfiniteScroll(props) {
    const { 
        style,  // 一定要设置 overflow: auto, 以及一定要设置元素的高, 让容器出现滚动条, 
        children,
        disabled,
        load,
        distance = 0, // 距离底部多少px时开始加载，0表示滚动到最底部时开始加载
    } = props;

    const refList = useRef();
    const onScroll = () => {
        if (disabled) {
            return;
        }
        const element = refList.current;
        const scrollHeight = element.scrollHeight;
        const scrollTop = element.scrollTop;
        const clientHeight = element.clientHeight;
        if ((clientHeight + scrollTop + distance) >= scrollHeight) {
            load();
        }
    };

    return (
        <div style={style} ref={refList} onScroll={onScroll}>
            {children}
        </div>
    );
}

const itemStyle = {
    height: '50px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    textAlign: 'center',
    lineHeight: '50px'
};

export default function DemoPage() {
    const [items, setItems] = useState(Array.from({ length: 5 }));
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onLoad = () => {
        if (items.length >= 100) {
            setDisabled(true);
            return;
        }

        setLoading(true);
        setDisabled(true);
        setTimeout(() => {
            setItems(items.concat(Array.from({ length: 5 })));
            setDisabled(false);
            setLoading(false);
        }, 500);
    }

    useEffect(() => {
        onLoad();
    }, [])

    return (
        <div className="blp-demo-page">
            <div>

                <InfiniteScroll 
                    style={{boder: '1px solid #000', height: '400px', overflow: 'auto'}} 
                    disabled={disabled} 
                    load={onLoad}
                >
                    {
                        items.map((item, index) => <section style={itemStyle} key={index}>{index}</section>)
                    }
                </InfiniteScroll>
                {loading ? 'loading...' : null}
            </div>
        </div>
    );
}


