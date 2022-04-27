import React, { useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import { setupWeb3 } from './Services/web3Service';
import { isWalletProfessor } from './Services/projectService';

import { listenToAccChange } from './Redux/Actions/walletActions';
import { getClassByIdAction, getLatestClassIDAction } from './Redux/Actions/projectActions';

import { AddClassCard, AddStudentCard, Card, ConnectWalletButton } from './Components';

import './Common/Styles/App.css';

setupWeb3();

function App() {
  const classId: number = 4;

  const dispatch: Dispatch = useDispatch();

  // @ts-ignore
  const account = useSelector(state => state.wallet.account);
  // @ts-ignore
  const gettingClassById = useSelector(state => state.project.gettingClassById);
  // @ts-ignore
  const gettingClassByIdError = useSelector(state => state.project.gettingClassByIdError);
  // @ts-ignore
  const rafClass = useSelector(state => state.project.rafClass);
  // @ts-ignore
  const gettingLatestClassId = useSelector(state => state.project.gettingLatestClassId);
  // @ts-ignore
  const gettingLatestClassIdError = useSelector(state => state.project.gettingLatestClassIdError);
  // @ts-ignore
  const latestClassId = useSelector(state => state.project.latestClassId);

  const [isProfessor, setIsProfessor] = useState<boolean>(false);

  useEffect(() => {
    // @ts-ignore
    dispatch(listenToAccChange());
    // @ts-ignore
    dispatch(getLatestClassIDAction());
    // @ts-ignore
    dispatch(getClassByIdAction(classId));
  }, [dispatch]);

  useEffect(() => {
    const fetchIsProfessor = async () => {
      const isAddressProfessor = await isWalletProfessor(account);
      setIsProfessor(isAddressProfessor);
    };

    if (account) {
      fetchIsProfessor();
    }
  }, [account]);

  return (
    <div className="App">
      <h3>Hello Web3!</h3>
      <div>Account: {account || 'Not Connected'}</div>
      <div>Is Professor: {isProfessor ? 'Yes' : 'No'}</div>

      <div className="DisplayFlex MarginTop4 MarginBottom4">
        <ConnectWalletButton />
      </div>

      <div className="DisplayFlex FlexDirectionColumn FlexGap1">
        <div className="DisplayFlex AlignItemsCenter FlexGap1">
          <AddClassCard address={account} />
          <AddStudentCard address={account} />
        </div>

        <div className="DisplayFlex AlignItemsCenter FlexGap1">
          <Card>
            <div className="BoldText FontSize3">Latest Class ID</div>
            {gettingLatestClassId && (
              <div>
                Loading...
              </div>
            )}
            {gettingLatestClassId && gettingLatestClassIdError && (
              <div className="DangerText">
                {gettingLatestClassIdError}
              </div>
            )}
            {!gettingLatestClassId && !gettingLatestClassIdError && (
              <div>{latestClassId}</div>
            )}
          </Card>
        </div>

        <Card>
          <div className="BoldText FontSize3">RAF Class with ID: {classId}</div>
          {gettingClassById && (
            <div>
              Loading...
            </div>
          )}
          {!gettingClassById && gettingClassByIdError && (
            <div className="DangerText">
              {gettingClassByIdError}
            </div>
          )}
          {!gettingClassById && !gettingClassByIdError && (
            <pre className="BackgroundGray Padding1">{JSON.stringify(rafClass, null, 2)}</pre>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;
