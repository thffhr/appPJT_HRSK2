import { createStore } from 'redux';
import reducers from '../reducer/index';
import userReducer from '../reducer/user';

export const store = createStore(reducers);