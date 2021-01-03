import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

const userId = 1;

export default function effectStudy() {
    const [count, setCount] = useState(0);
    const changeUserId = () => {
        setCount(1);
    };

    useEffect(() => {
        console.log('effect');
        return () => {
            console.log('destroy');
        }
    });
    // TODO: 多次点击按钮，前两次都会执行
    console.log(count, count === userId);
    
    return (
        <div>
            <h2>
                useEffect
            </h2>
            <ul>
                <li>
                    跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，
                    只不过被合并成了一个 API
                </li>
                <li>
                    默认情况下，它在第一次渲染之后和每次更新(state, props的改变)之后都会执行
                </li>
                <li>
                    改变state的函数接受的参数若与上一次相等时，本次更新将会被跳过
                </li>
                <li>
                    每次更新DOM之前都会执行函数组件
                </li>
                <li>
                    React 会在组件卸载的时候执行清除操作(effect中返回的函数)。正如之前学到的，effect 在每次渲染之后都会执行。
                    这就是为什么 React 会在执行当前 effect 之前对上一个 effect 进行清除
                </li>
            </ul>
            <div>
                <Button onClick={() => changeUserId()}>count + 1</Button>
                点击次数{count}
            </div>
        </div>
    );
}