import React, { FC, useMemo } from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { WALLET_TYPES } from '../../Common/Constants/constants';
import { getInPageProviderValue } from '../../Services/walletService';
import { shortenAddress } from '../../Services/utilsService';
import { normalLogin } from '../../Redux/Actions/walletActions';

import './ConnectWalletButton.css';

const ConnectWalletButton: FC = () => {
  const dispatch: Dispatch = useDispatch();

  // @ts-ignore
  const account: string = useSelector(state => state.wallet.account);
  // @ts-ignore
  const connectingWallet: boolean = useSelector(state => state.wallet.connectingWallet);

  const provider = getInPageProviderValue();

  const shortenedAddress = useMemo(() => (account ? shortenAddress(account) : ''), [account]);

  if (account && !connectingWallet) {
    return (
      <div className="ConnectWalletButton--Connected">
        {shortenedAddress}
      </div>
    );
  }

  return (
    <button
      className="ConnectWalletButton"
      disabled={provider === 'Browser' || connectingWallet}
      type="button"
      // @ts-ignore
      onClick={() => dispatch(normalLogin(WALLET_TYPES.inPageProvider))}
    >
      {connectingWallet ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export { ConnectWalletButton };
