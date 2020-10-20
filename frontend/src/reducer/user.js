import { LOGIN } from '../action/user';

const initialState = {
    user: null,
};

const userReducer = (state = initialState, action) => {
    console.log('reducer')
    console.log(action)
    switch(action.type) {
        case LOGIN: {
            console.log('reducer complete');
            return Object.assign({}, state, {user: action.user} )
        }
        default:
            return state
    }
};

export default userReducer;