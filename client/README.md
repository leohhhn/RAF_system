# RAF System Web3

## Development

This project is made using Create React App so most things you will be able to read inside their documentation.

### Node version

You should download [nvm](https://github.com/nvm-sh/nvm) so you can easily manage node versions.

### Setup

We are using yarn, so you need to install it from [here](https://classic.yarnpkg.com/lang/en/docs/install) in order to run the app locally.

To install the project and get up and running you just need to run the following commands.

```
// Install all dependencies. It is important to not use npm and use yarn for dependency management.
yarn install

// This will start the server
yarn start
```

### Adding Dependencies

When adding dependencies it is important they are adding using `yarn` instead of `npm` as we use the `yarn.lock` file to manage dependency versions.

```
// Correct
yarn add my-package

// Wrong
npm i my-package --save
```

## Useful Links

- Contract Address: https://rinkeby.etherscan.io/address/0x5c2e18ccccc063c37fd552ec163f2b3d86b23ca7
- Contract ABI Specification: https://docs.soliditylang.org/en/v0.8.13/abi-spec.html
- Import RPC URL: https://rpc.info
- Create Infura Account: https://infura.io
- Web3.js Library Docs - https://web3js.readthedocs.io
- ethers.js Library Docs - https://docs.ethers.io/v5
- CRA Typescript Config - https://create-react-app.dev/docs/adding-typescript
- Fix Web3 import issue - https://stackoverflow.com/a/70760506/6523658
- Redux: https://react-redux.js.org
- Rekt News: https://rekt.news

## Notes

- Be careful with the dependencies (React 18 is new, check web3.js compatibility, etc.)
