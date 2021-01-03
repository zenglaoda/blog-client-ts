function addAction(payload = 1) {
    return {
        type: 'ADD',
        payload,
    };
}

function subAction(payload = 1) {
    return {
        type: 'SUB',
        payload,
    };
}

function setAction(num) {
    return {
        type: 'SET',
        payload: num,
    };
}

// 异步action creator 
function asyncAction() {
    return function(dispatch, getState) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const res = dispatch(setAction(0));
                console.log(res);
                resolve(getState())
            }, 3000)
        })
    }
}

// 异步action creator 
// function asyncAction() {
//     return function(dispatch, store) {
//         setTimeout(() => {
//             dispatch(setAction(0));
//         }, 3000)
//     }
// }

export {
    addAction,
    subAction,
    setAction,
    asyncAction,
}