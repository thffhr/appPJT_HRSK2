import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducer/index';
import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension';

export const store = createStore(
    reducers,
    devToolsEnhancer(
        reducers
    )
    // composeWithDevTools(
    //     applyMiddleware(...middleware)
    // )
);