import config from '../Config/config.json';
import contracts from '../Config/contracts.json';
import { wait } from './utilsService';

// @ts-ignore
const getContractAddress = (name: string) => contracts[name].networks[config.network];

// @ts-ignore
export const createContract = (name: string, address: string) => async () => {
  if (!window._web3) {
    await wait(300);

    if (!window._web3) {
      return createContract(name, address)();
    }
  }

  // @ts-ignore
  return new window._web3.eth.Contract(contracts[name].abi, address);
};

export const getErc20Contract = async (address: string) => createContract('Erc20', address)();

export const rafSystemAddress = getContractAddress('RAFSystem');
export const RafSystemContract = createContract('RAFSystem', rafSystemAddress);
