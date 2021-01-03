import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// function Child(props) {
//   console.log('Parent数据有变化都会进来');
//   const [count, setCount] = useState(props.callback);
//   useEffect(() => {
//     console.log('callback变化的时候才会再次执行setCount');
//     setCount(props.callback());
//   }, [props.callback]);
//   return <div>{count}</div>;
// }

class Child extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    
    componentWillMount() {
        console.log('will mount');
    }


    componentDidMount() {
        console.log('will mount');

    }

    componentWillReceiveProps() {

    }

    componentWillUnmount() {
        console.log('will unmount');
    }



    render() {
        console.log(this.props);
        console.log('Child组件重新渲染了');
        return (
            this.props.show ?
            <span>
                span
            </span>
            :
            <div ref={this.props.refAttr}>
                {this.props.callback()}
            </div>
        );
    }
}

export default function Parent() {
    const [count, setCount] = useState(1);
    const [val, setVal] = useState('');

    /**
        每当函数组件的state或props改变导致重新渲染时，parent
        函数都会重新执行，这意味着变量，函数的重新声明，重新执行，
        解决函数引用改变(重新声明)可以使用useCallback
        解决重复计算值可以使用useMemo
    */
    const callback = useCallback(() => {
        return count;
    }, [count]);

    //   function callback(){
    //       return count;
    //   }


    const oDiv = useRef(null);
    const [show, setShow] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 3000);
        return function clearTimer() {
            clearTimeout(timer);
        }
    });

    return (
        <div>
            <h4>{count}</h4>
            <h4>{val}</h4>
            <Child callback={callback} show={show} refAttr={oDiv} name="child"/>
            <div>
                <button onClick={() => setCount(count + 1)}>+</button>
                <input value={val} onChange={event => setVal(event.target.value)} />
            </div>
        </div>
    );
}