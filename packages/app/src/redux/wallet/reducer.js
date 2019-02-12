import { handleActions } from 'redux-actions';

import {
  cipherTextWalletImported,
  encodedSignature,
  encodedEncryption,
  walletDecrypted,
  walletEncrypted,
  decryptedData,
  set,
} from './actions';

const initialState = {
  version: 0,
  loading: false,
  data: null,
};

export default handleActions(
  {
    [set]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [cipherTextWalletImported]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [walletDecrypted]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [walletEncrypted]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [encodedSignature]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [encodedEncryption]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [decryptedData]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  initialState,
);
