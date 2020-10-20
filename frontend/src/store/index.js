import { createStore } from 'redux';
import userReducer from '../reducer/index';

export const store = createStore(userReducer);