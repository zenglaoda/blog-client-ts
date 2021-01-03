import React from 'react';
import { connect } from 'react-redux';
import { addAction, subAction, setAction, asyncAction } from '@/redux/actions';

@connect(
    function mapStateToProps(state, props) {
        return {
            sum: state,
        };
    },
    function mapDispatchToProps(dispatch, props) {
        return {
            addSum: () => dispatch(addAction(2)),
            subSum: () => dispatch(subAction(1)),
            setSum: (num) => dispatch(setAction(num)),
            asyncSetSum: () => dispatch(asyncAction()),
        }
    }
)
class Base extends React.Component {
    constructor(props) {
        super(props);
    }

    asyncResetSum() {
        const p = this.props.asyncSetSum()
        p.then((res) => {
            console.log(res);
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.props.addSum}>
                    Add
                </button>
                <input
                    onChange={(event) => this.props.setSum(event.target.value)}
                    value={this.props.sum}
                />
                <button onClick={this.props.subSum}>
                    Sub
                </button>
                <button onClick={()=> this.asyncResetSum()}>
                    async reset
                </button>
                <h3>sum is : {this.props.sum}</h3>
            </div>
        );
    }
}
export default Base;
