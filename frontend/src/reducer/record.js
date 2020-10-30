import { UPDATE_MENU } from '../action/record';

const initialState = {
    menu: null,
};

function recordReducer(state=initialState, action) {
    console.log('3')
    switch(action.type) {
        case UPDATE_MENU:
            console.log('4')
            console.log(action)
            const newState = Object.assign({}, state, {menu: action.menu} );
            console.log(newState)
            return newState

        default:
            console.log('default')
            return state
    }
};

export default recordReducer;