import { LOGIN } from '../action/user';

const initialState = {
    user: null,
};

function userReducer(state=initialState, action) {
    console.log('reducer: ', action);
    switch(action.type) {
        case LOGIN:
            console.log('reducer complete');
            return Object.assign({}, state, {user: action.user} )

        default:
            console.log('default')
            return state
    }
};

export default userReducer;