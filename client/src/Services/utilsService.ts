/**
 * Mock method to simulate async call.
 *
 * @param val {any}
 * @param time {Number}
 * @return {Promise<any>}
 */
export const wait = (time: number = 500, val: any = true) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(val);
  }, time);
});

export const isEmptyBytes = (value: string) => value === '0x0000000000000000000000000000000000000000';

export const requireAddress = (address: any) => {
  if (typeof address !== 'string') {
    throw new Error('Address is not a string');
  }

  if (address === '') {
    throw new Error('Address is empty string');
  }

  if (address.length < 42) {
    throw new Error('Address is too short');
  }

  if (isEmptyBytes(address)) {
    throw new Error('Address is empty bytes');
  }

  if (!(new RegExp(/0x[0-9a-fA-F]{40}/).test(address))) {
    throw new Error('Invalid address');
  }
};

export const shortenAddress = (address: string) => `${address.slice(0, 5)}...${address.slice(-5)}`;
