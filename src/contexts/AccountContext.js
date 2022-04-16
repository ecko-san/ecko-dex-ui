/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import moment from 'moment';
import Pact from 'pact-lang-api';
import swal from '@sweetalert/with-react';
import { getCorrectBalance } from '../utils/reduceBalance';
import { CHAIN_ID, creationTime, GAS_PRICE, NETWORK } from '../constants/contextConstants';
import useLocalStorage from '../hooks/useLocalStorage';
import { useGameEditionContext, useNotificationContext } from '.';
import reduceToken from '../utils/reduceToken';

export const AccountContext = createContext();
export const AccountProvider = (props) => {
  const [sendRes, setSendRes] = useState(null);
  const [localRes, setLocalRes] = useState(null);
  const { gameEditionView } = useGameEditionContext();
  const { storeNotification } = useNotificationContext();

  const [account, setAccount, removeAccount] = useLocalStorage('acct', { account: null, guard: null, balance: 0 });
  const [privKey, setPrivKey, removePrivKey] = useLocalStorage('pk', '');

  const [registered, setRegistered] = useState(false);

  const [tokenFromAccount, setTokenFromAccount] = useState({
    account: null,
    guard: null,
    balance: 0,
  });
  const [tokenToAccount, setTokenToAccount] = useState({
    account: null,
    guard: null,
    balance: 0,
  });
  useEffect(() => {
    if (account.account) setVerifiedAccount(account.account);
  }, [sendRes]);

  useEffect(() => {
    if (account.account) setRegistered(true);
  }, [registered]);

  useEffect(() => {
    if (typeof localRes === 'string') {
      return storeNotification({
        type: 'error',
        date: moment().format('DD/MM/YYYY - HH:mm:ss'),
        title: 'Transaction Error',
        description: localRes,
        isRead: false,
      });
    }
  }, [localRes]);

  const clearSendRes = () => {
    setVerifiedAccount(account.account);
    setSendRes(null);
  };

  const setVerifiedAccount = async (accountName, onConnectionSuccess) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(coin.details ${JSON.stringify(accountName)})`,
          meta: Pact.lang.mkMeta('', CHAIN_ID, GAS_PRICE, 3000, creationTime(), 600),
        },
        NETWORK
      );
      if (data.result.status === 'success') {
        await setAccount({
          ...data.result.data,
          balance: getCorrectBalance(data.result.data.balance),
        });
        if (onConnectionSuccess) {
          onConnectionSuccess();
        }
      } else {
        await setAccount({ account: null, guard: null, balance: 0 });
        await swal({
          text: `Please make sure the account ${reduceToken(accountName)} exist on kadena blockchain`,
          title: 'No Account',
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getTokenAccount = async (token, account, first) => {
    try {
      let data = await Pact.fetch.local(
        {
          pactCode: `(${token}.details ${JSON.stringify(account)})`,
          keyPairs: Pact.crypto.genKeyPair(),
          meta: Pact.lang.mkMeta('', CHAIN_ID, 0.01, 100000000, 28800, creationTime()),
        },
        NETWORK
      );

      if (data.result.status === 'success') {
        // setTokenAccount({...data.result.data, balance: getCorrectBalance(data.result.data.balance)});
        first ? setTokenFromAccount(data.result.data) : setTokenToAccount(data.result.data);
        return data.result.data;
      } else if (data.result.status === 'failure') {
        first ? setTokenFromAccount({ account: null, guard: null, balance: 0 }) : setTokenToAccount({ account: null, guard: null, balance: 0 });
        return { account: null, guard: null, balance: 0 };
      }
    } catch (e) {
      console.log(e);
    }
  };

  const logout = () => {
    removeAccount();
    localStorage.removeItem('signing', null);
    removePrivKey();
    localStorage.removeItem('wallet');
    if (!gameEditionView) {
      window.location.reload();
    }
  };

  const contextValues = {
    account,
    privKey,
    setPrivKey,
    clearSendRes,
    sendRes,
    setSendRes,
    localRes,
    setLocalRes,
    setVerifiedAccount,
    registered,
    setRegistered,
    getTokenAccount,
    tokenToAccount,
    tokenFromAccount,
    logout,
  };
  return <AccountContext.Provider value={contextValues}>{props.children}</AccountContext.Provider>;
};

export const AccountConsumer = AccountContext.Consumer;
