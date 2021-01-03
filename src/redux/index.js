import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
function reducer(state = 0, action = {}) {
    switch(action.type) {
        case 'ADD':
            return state + action.payload;
        case 'SUB':
            return state - action.payload;
        default:
            return Number(action.payload) || 0;
    }
}

const store = createStore(reducer, 0, applyMiddleware(thunk));

export default store;