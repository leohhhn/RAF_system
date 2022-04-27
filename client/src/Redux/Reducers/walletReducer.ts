import { AccountType } from '../../Common/Constants/constants';
import {
  CONNECT_WALLET_START,
  CONNECT_WALLET_END,

  CONNECT_WALLET_PROVIDER,
  CONNECT_WALLET_PROVIDER_SUCCESS,
  CONNECT_WALLET_PROVIDER_FAILURE,

  CLEAR_ACCOUNT,
} from '../ActionTypes/walletActionTypes';

const accountType = localStorage.getItem(AccountType);

const INITIAL_STATE = {
  connectingWallet: false,
  connectingWalletAccountType: '',

  connectingWalletProvider: false,
  connectingWalletProviderError: '',

  account: '',
  accountType: accountType || '',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = INITIAL_STATE, action: Record<string, any>) => {
  const { type, payload } = action;

  switch (type) {
    case CONNECT_WALLET_START:
      return {
        ...state,
        connectingWallet: true,
        connectingWalletAccountType: payload,
      };

    case CONNECT_WALLET_END:
      return {
        ...state,
        connectingWallet: false,
        connectingWalletAccountType: '',
      };

    case CONNECT_WALLET_PROVIDER:
      return {
        ...state, connectingWalletProvider: true,
        connectingWalletProviderError: '',
      };

    case CONNECT_WALLET_PROVIDER_SUCCESS:
      return {
        ...state,
        connectingWalletProvider: false,
        connectingWalletProviderError: '',
        ...payload,
      };

    case CONNECT_WALLET_PROVIDER_FAILURE:
      return {
        ...state,
        connectingWalletProvider: false,
        connectingWalletProviderError: payload,
      };

    case CLEAR_ACCOUNT:
      return {
        ...state,
        account: '',
        accountType: '',
      };

    default:
      return state;
  }
};
