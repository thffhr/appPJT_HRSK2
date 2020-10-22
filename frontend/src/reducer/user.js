import { LOGIN } from '../action/user';

const initialState = {
    user: null,
};

function userReducer(state=initialState, action) {
    console.log('reducer: ', action);
    switch(action.type) {
        case LOGIN:
            const newState = Object.assign({}, state, {user: action.user} );
            console.log('유저 정보: ', newState);
            return newState

        default:
            console.log('default')
            return state
    }
};

export default userReducer;