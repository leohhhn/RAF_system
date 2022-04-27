import Web3 from 'web3';

import { wait } from './utilsService';

export const getAccount = async () => {
  const accounts = await window._web3.eth.getAccounts();

  if (!accounts.length) {
    throw new Error('No Accounts Locked');
  }

  return accounts[0];
};

export const getNetwork = (web3: Web3) => {
  if (web3) {
    return web3.eth.net.getId();
  }

  return window._web3.eth.net.getId();
};

/**
 * Returns a value for the in-page provider type
 *
 * @return {string}
 */
export const getInPageProviderValue = () => {
  const provider = window.ethereum || window.web3?.currentProvider;

  if (!provider) return 'Browser';

  if (provider.isMathWallet) return 'MetaMask';
  if (provider.isSafePal) return 'Status';
  if (provider.isTokenPocket) return 'TokenPocket';
  if (provider.isMetaMask) return 'MetaMask';
  if (provider.isStatus) return 'Status';
  if (provider.isImToken) return 'imToken';
  if (provider.isTrust) return 'Trust';
  if (provider.isToshi) return 'Coinbase';
  if (provider.isTokenary) return 'Tokenary';
  if (navigator.userAgent.match(/Opera|OPR/)) return 'Opera';

  return 'Browser';
};

/**
 * Recursive function which tries to get an account
 *
 * @param retryNum {Number}
 * @returns {Promise<*|boolean>}
 */
// @ts-ignore
const retryGetAccounts = async (retryNum: number = 0) => {
  const response = await window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
  if (!response && !window.ethereum.selectedAddress) {
    if (retryNum < 5) {
      await wait(300);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return retryGetAccounts(retryNum + 1);
    }

    return false;
  }

  return window.ethereum.selectedAddress || response.result[0];
};

/**
 * Checks if the user has approved to use MM as the provider
 *
 * @return {Promise<*>}
 */
export const isInPageProviderApproved = async () => {
  try {
    if (!window.ethereum || !window.ethereum.enable) {
      return true;
    }

    if (window.ethereum.selectedAddress) {
      return true;
    }

    const account = await window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
    return !!account;
  } catch (err: any) {
    return false;
  }
};

/**
 * Returns name of Ethereum network for given ID
 *
 * @return {number} networkId
 */
export const nameOfNetwork = (networkId: number) => {
  const networks: Record<number, string> = {
    1: 'Mainnet',
    3: 'Ropsten',
    4: 'Rinkedby',
    42: 'Kovan',
    56: 'Binance Smart Chain',
    97: 'Binance Smart Chain - Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Testnet Mumbai',
  };
  return networks[networkId] || 'Unknown Network';
};

export const toHex = (value: number) => `0x${value.toString(16)}`;

export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: toHex(4),
      }],
    });

    return true;
  } catch (switchError: any) {
    return false;
  }
};
