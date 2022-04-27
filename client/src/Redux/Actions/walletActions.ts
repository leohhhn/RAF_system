import { Dispatch } from 'redux';
import config from '../../Config/config.json';
import {
  getAccount,
  isInPageProviderApproved,
  nameOfNetwork,
  switchNetwork,
} from '../../Services/walletService';
import { setupWeb3, setWeb3toInPageProvider } from '../../Services/web3Service';
import {
  CONNECT_WALLET_START,
  CONNECT_WALLET_END,

  CONNECT_WALLET_PROVIDER,
  CONNECT_WALLET_PROVIDER_SUCCESS,
  CONNECT_WALLET_PROVIDER_FAILURE,

  CLEAR_ACCOUNT,
} from '../ActionTypes/walletActionTypes';
import { AccountType, WALLET_TYPES } from '../../Common/Constants/constants';

/**
 * Tries to connect to the in page injected web3 provider, also checks if the app is pre-approved
 *
 * @param silent {Boolean}
 */
export const loginInPageProvider = (silent: boolean) => async (dispatch: Dispatch, getState: Function) => {
  const accountType = WALLET_TYPES.inPageProvider;

  dispatch({ type: CONNECT_WALLET_PROVIDER });

  try {
    const inPageProviderApproved = await isInPageProviderApproved();

    if (silent && !inPageProviderApproved) {
      throw new Error('Provider Not Approved');
    }

    const network = await setWeb3toInPageProvider();
    const account = await getAccount();

    dispatch({
      type: CONNECT_WALLET_PROVIDER_SUCCESS,
      payload: { account, accountType, network },
    });

    localStorage.setItem(AccountType, WALLET_TYPES.inPageProvider);
  } catch (err: any) {
    let errorMessage = err.message || '';

    if (errorMessage.includes('User rejected the request')) {
      errorMessage = 'You\'ve denied the login';
    } else if (errorMessage.includes('wallet address undefined')) {
      errorMessage = 'No accounts detected (Wallet possibly locked)';
    } else if (errorMessage.includes('wrong-network')) {
      dispatch({ type: CONNECT_WALLET_START, payload: accountType });

      const networkName = nameOfNetwork(config.network);
      errorMessage = `Your wallet network is not the same as in the app. Please, switch to the ${networkName} network`;

      const isSwitched = await switchNetwork();

      dispatch({ type: CONNECT_WALLET_END });

      if (isSwitched) {
        return;
      }
    }

    if (!getState().general.account) {
      dispatch({ type: CLEAR_ACCOUNT });
      setupWeb3();
    }

    dispatch({ type: CONNECT_WALLET_PROVIDER_FAILURE, payload: errorMessage });

    if (!silent) {
      throw new Error(errorMessage);
    }
  }
};

/**
 * Tries not silent login for the selected account type
 *
 * @param accountType {String}
 *
 * @return {Function}
 */
export const normalLogin = (accountType: string): Function => async (dispatch: Dispatch) => {
  dispatch({ type: CONNECT_WALLET_START, payload: accountType });

  try {
    switch (accountType) {
      case WALLET_TYPES.inPageProvider: {
        // @ts-ignore
        await dispatch(loginInPageProvider(false));
        break;
      }

      default:
        return false;
    }
  } catch (err) {
    setupWeb3();
  }

  dispatch({ type: CONNECT_WALLET_END });
};

/**
 * If the user has already once successfully added an account this will
 * try a silent login for that account type.
 *
 * @return {Function}
 */
export const silentLogin = () => async (dispatch: Dispatch, getState: Function) => {
  const { accountType, connectingWallet, account } = getState().wallet;
  if (!accountType || connectingWallet || account) return;

  dispatch({ type: CONNECT_WALLET_START, payload: accountType });

  try {
    switch (accountType) {
      case WALLET_TYPES.inPageProvider: {
        // @ts-ignore
        await dispatch(loginInPageProvider(true));
        break;
      }

      default:
        return false;
    }
  } catch (err) {
    setupWeb3();
  }

  // dispatch(setLsValuesToReducer());
  dispatch({ type: CONNECT_WALLET_END });
};

export const logOut = () => (dispatch: Dispatch) => {
  dispatch({ type: CLEAR_ACCOUNT });
  localStorage.removeItem(AccountType);
};

/**
 * Listens to account change and reloads the page if there is no account or
 * the account changes
 *
 * @return {Function}
 */
export const listenToAccChange = () => (dispatch: Dispatch, getState: Function) => {
  if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false;
  }

  if (window.ethereum?.on) {
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      const { account, connectingWallet, accountType } = getState().wallet;

      if (connectingWallet) return;

      if (accountType !== WALLET_TYPES.inPageProvider) return;

      if (account && !accounts[0]) {
        // @ts-ignore
        dispatch(logOut());
      }

      if (accounts[0] !== account && await isInPageProviderApproved()) {
        // @ts-ignore
        dispatch(loginInPageProvider(false));
      }
    });

    window.ethereum.on('chainChanged', async () => {
      const { connectingWallet, accountType } = getState().wallet;

      if (connectingWallet) {
        return;
      }

      if (accountType === WALLET_TYPES.inPageProvider && await isInPageProviderApproved()) {
        // @ts-ignore
        dispatch(loginInPageProvider(false));
      }
    });
  } else {
    const interval: NodeJS.Timer = setInterval(async () => {
      const { account, connectingWallet, accountType } = getState().wallet;

      if (connectingWallet) {
        return;
      }

      if (accountType !== WALLET_TYPES.inPageProvider) {
        return clearInterval(interval);
      }

      const accounts = await window._web3.eth.getAccounts();

      if (account && !accounts[0]) {
        window.location.reload();
      }

      if (accounts[0] !== account) {
        loginInPageProvider(false);
      }
    }, 1000);
  }
};
