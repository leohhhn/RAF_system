import { combineReducers } from 'redux';

import wallet from './walletReducer';
import project from './projectReducer';

export default combineReducers({
  wallet,
  project,
});
