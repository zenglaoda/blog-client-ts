import React from 'react';
import css from './index.less';
// console.log(css);
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className={css.wrapper}>
                signIn
            </div>
        );
    }
}