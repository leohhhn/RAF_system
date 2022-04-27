import Web3 from 'web3';
import Dec from 'decimal.js';
import config from '../Config/config.json';
import { wait } from './utilsService';
import { getNetwork } from './walletService';

export const setupWeb3 = () => {
  window._web3 = new Web3(config.rpcUrl);
};

// @ts-ignore
export const setWeb3toInPageProvider = async (retryNum: number = 0) => {
  const exists = window.ethereum || window.web3?.currentProvider;

  if (!exists) {
    if (retryNum < 5) {
      await wait(300);

      return setWeb3toInPageProvider(retryNum + 1);
    }

    throw new Error('errors.no_wallet');
  }

  const testWeb3 = new Web3(window.ethereum || window.web3.currentProvider);
  const testWeb3Network = await getNetwork(testWeb3);

  if (config.network !== testWeb3Network) throw new Error('wrong-network');

  window._web3 = new Web3(window.ethereum || window.web3.currentProvider);

  return testWeb3Network;
};

export const ethToWei = (_ethVal: any, size: string = 'ether') => {
  const parts = new Dec(_ethVal.toString()).toString().split('.');
  let val = parts[0];

  if (parts[1]) {
    const decimals = parts[1].length > 18 ? parts[1].substring(0, 18) : parts[1];
    val += `.${decimals}`;
  }

  // @ts-ignore
  return window._web3.utils.toWei(`${val}`, size);
};
