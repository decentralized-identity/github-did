import { withHandlers } from 'recompose';

const ghdid = require('@github-did/lib');

const base64url = require('base64url');

export default withHandlers({
  importCipherTextWallet: ({
    cipherTextWalletImported,
    snackbarMessage,
    set,
  }) => async (cipherTextWallet) => {
    set({ loading: true });
    try {
      cipherTextWalletImported({ data: cipherTextWallet });
      snackbarMessage({
        snackbarMessage: {
          message: 'Imported wallet: ...',
          variant: 'success',
          open: true,
        },
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: 'Could not import wallet.',
          variant: 'error',
          open: true,
        },
      });
    }
    set({ loading: false });
  },
  toggleWallet: ({
    wallet,
    walletDecrypted,
    walletEncrypted,
    snackbarMessage,
    set,
  }) => async (password) => {
    set({ loading: true });
    try {
      let message;

      if (typeof wallet.data === 'string') {
        const wall = ghdid.createWallet(wallet.data);
        wall.unlock(password);

        walletDecrypted({ data: wall });
        message = 'Unlocked wallet.';
      } else {
        const wall = ghdid.createWallet({
          keys: Object.values(wallet.data.keys),
        });
        wall.lock(password);

        walletEncrypted({ data: wall.ciphered });
        message = 'Locked wallet.';
      }

      snackbarMessage({
        snackbarMessage: {
          message,
          variant: 'success',
          open: true,
        },
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: 'Could not unlock wallet.',
          variant: 'error',
          open: true,
        },
      });
    }
    set({ loading: false });
  },
  sign: ({
    wallet, encodedSignature, snackbarMessage, set,
  }) => async ({ payload, did, kid }) => {
    set({ loading: true });
    try {
      const w = await ghdid.createWallet({ keys: Object.values(wallet.data.keys) });

      const signed = await ghdid.signWithWallet(payload, did, kid, w);

      const message = 'Signed payload...';

      const encoded = base64url(JSON.stringify(signed));

      snackbarMessage({
        snackbarMessage: {
          message,
          variant: 'success',
          open: true,
        },
      });

      encodedSignature({
        encoded,
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: 'Could not sign payload.',
          variant: 'error',
          open: true,
        },
      });
    }
    set({ loading: false });
  },

  verify: ({ snackbarMessage, set }) => async ({ signedData }) => {
    set({ loading: true });
    try {
      const verified = await ghdid.verifyWithResolver(signedData, ghdid.resolver);

      if (verified) {
        snackbarMessage({
          snackbarMessage: {
            message: 'Signature is valid.',
            variant: 'success',
            open: true,
          },
        });
      } else {
        snackbarMessage({
          snackbarMessage: {
            message: 'Signature is not valid.',
            variant: 'error',
            open: true,
          },
        });
      }
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: e.message,
          variant: 'error',
          open: true,
        },
      });
    }
    set({ loading: false });
  },

  encrypt: ({
    wallet, encodedEncryption, snackbarMessage, set,
  }) => async ({
    fromPublicKeyId,
    toPublicKeyId,
    data,
  }) => {
    set({ loading: true });
    try {
      const w = await ghdid.createWallet({ keys: Object.values(wallet.data.keys) });

      const cipherTextPayload = await ghdid.encryptForWithWalletAndResolver({
        data,
        fromPublicKeyId,
        toPublicKeyId,
        wallet: w,
        resolver: ghdid.resolver,
      });
      const message = 'Encrypted payload...';

      const encoded = base64url(JSON.stringify(cipherTextPayload));

      encodedEncryption({
        encoded,
      });

      snackbarMessage({
        snackbarMessage: {
          message,
          variant: 'success',
          open: true,
        },
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: 'Could not encrypt payload.',
          variant: 'error',
          open: true,
        },
      });
    }
    set({ loading: false });
  },

  decrypt: ({
    wallet, decryptedData, snackbarMessage, set,
  }) => async ({
    fromPublicKeyId,
    toPublicKeyId,
    cipherText,
  }) => {
    set({ loading: true });
    try {
      const w = await ghdid.createWallet({ keys: Object.values(wallet.data.keys) });

      const payload = await ghdid.decryptForWithWalletAndResolver({
        data: cipherText,
        fromPublicKeyId,
        toPublicKeyId,
        wallet: w,
        resolver: ghdid.resolver,
      });

      decryptedData({
        decryptedData: payload,
      });

      snackbarMessage({
        snackbarMessage: {
          message: 'Decrypted payload...',
          variant: 'success',
          open: true,
        },
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: 'Could not decrypt payload.',
          variant: 'error',
          open: true,
        },
      });
    }
    set({ loading: false });
  },
});
