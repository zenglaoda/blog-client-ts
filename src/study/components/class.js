import React from 'react';
import reactROM from 'react-dom';

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    // 首次渲染或使用 forceUpdate() 时不会调用该方法, 默认返回true
    shouldComponentUpdate() {
        return true
    }

    // 在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用
    // 它应返回一个对象来更新 state，如果返回 null 则不更新任何内容
    static getDerivedStateFromProps(props, state)

    // 此生命周期会在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state
    static getDerivedStateFromError() {

    }

    // 应该为纯函数，该方法中不执行数据修改操作
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }

    // render之后执行
    getSnapshotBeforeUpdate(prevProps, prevState) {
        //我们是否要添加新的 items 到列表?
        // 捕捉滚动位置，以便我们可以稍后调整滚动.
        if (prevProps.list.length < this.props.list.length) {
            const list = this.listRef.current;
            return list.scrollHeight - list.scrollTop;
        }
        return null;
    }

    // 组件已经被渲染到 DOM 之后运行，可以执行获取DOM大小，初始化请求的操作
    componentDidMount() {

    }

    // 更新后会被立即调用， 首次渲染不会执行此方法。
    componentDidUpdate(prevProps, prevState, snapshot) {
        //如果我们有snapshot值, 我们已经添加了 新的items.
        // 调整滚动以至于这些新的items 不会将旧items推出视图。
        // (这边的snapshot是 getSnapshotBeforeUpdate方法的返回值)
        if (snapshot !== null) {
            const list = this.listRef.current;
            list.scrollTop = list.scrollHeight - snapshot;
        }
    }

    // 组件将要卸载的时候运行
    componentWillUnmount() {
    }

}

// 为props设置默认属性
Clock.defaultProps = {};
export default Clock;