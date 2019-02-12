import { createAction } from 'redux-actions';

export const cipherTextWalletImported = createAction('WALLET/IMPORTED', ({ data }) => ({
  data,
}));

export const walletDecrypted = createAction('WALLET/DECRYPTED', ({ data }) => ({
  data,
}));

export const walletEncrypted = createAction('WALLET/ENCRYPTED', ({ data }) => ({
  data,
}));

export const encodedSignature = createAction('WALLET/ENCODED_SIGNATURE', ({ encoded }) => ({
  encoded,
}));

export const encodedEncryption = createAction('WALLET/ENCODED_ENCRYPTION', ({ encoded }) => ({
  encoded,
}));

export const decryptedData = createAction('WALLET/DECRYPTED_PAYLOAD', ({ decryptedData }) => ({
  decryptedData,
}));

export const set = createAction('WALLET/SET', payload => ({
  ...payload,
}));
