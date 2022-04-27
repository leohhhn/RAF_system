import { requireAddress } from './utilsService';

// @ts-ignore
const sendTxWeb3 = tx => new Promise(async (resolve, reject) => {
  const handleError = (err: any) => {
    let errorMessage = 'Error occurred';

    if (err) {
      if (err.message) {
        errorMessage = err.message;
      }

      if (typeof err === 'string') {
        errorMessage = err;
      }
    }

    if (errorMessage.includes('User denied transaction signature')) {
      errorMessage = 'Denied transaction';
    }

    // Workaround for https://github.com/MetaMask/metamask-extension/issues/7160
    if (err?.stack?.includes('User denied transaction signature')) {
      errorMessage = 'Denied transaction';
    }

    reject(new Error(errorMessage));
  };

  try {
    tx.send({ ...tx, send: null })
      .on('transactionHash', () => {
        // onTxHashCallback();
      })
      .on('confirmation', (confirmNum: number, receipt: any) => {
        resolve(receipt);
      })
      .on('error', handleError);
  } catch (err) {
    handleError(err);
  }
});

/**
 * Calls the contract method via the web3 contract api
 * with custom estimatedGas
 * Takes in account exceptions because the estimateGas method
 * does not return the correct amount sometimes
 *
 * @param contract {Object}
 * @param contractFunc {String}
 * @param funcParams {Array}
 * @param txParams {Object}
 *
 * @return {Promise}
 */
const callTx = (
  contract: object,
  contractFunc: string,
  funcParams: Array<any>,
  txParams: object,
): Promise<any> => new Promise(async (resolve, reject) => {
  try {
    // @ts-ignore
    requireAddress(contract.options.address);

    // @ts-ignore
    const method = contract.methods[contractFunc](...funcParams);

    const finalTxParams = { ...txParams };

    const res = await sendTxWeb3({
      ...finalTxParams,
      contractFunc,
      funcParams,
      send: method.send,
    });

    resolve(res);
  } catch (err) {
    reject(err);
  }
});

export default callTx;
