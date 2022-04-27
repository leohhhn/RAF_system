import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './Reducers';

// @ts-ignore
const reduxDevToolsEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 });
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers, reduxDevToolsEnhancer);

export default store;
