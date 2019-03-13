import { withHandlers } from "recompose";

const {
  sign,
  verify,
  encryptFor,
  decryptFor,
  getUnlockedPrivateKey,
  getPublicKeyByKeyId,
  cipherTextWalletJsonToPlainTextWalletJson,
  plainTextWalletJsonToCipherTextWalletJson
} = require("@github-did/lib");

const base64url = require("base64url");

export default withHandlers({
  importCipherTextWallet: ({
    cipherTextWalletImported,
    snackbarMessage,
    set
  }) => async cipherTextWallet => {
    set({ loading: true });
    try {
      cipherTextWalletImported({ data: cipherTextWallet });
      snackbarMessage({
        snackbarMessage: {
          message: "Imported wallet: ...",
          variant: "success",
          open: true
        }
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: "Could not import wallet.",
          variant: "error",
          open: true
        }
      });
    }
    set({ loading: false });
  },
  toggleWallet: ({
    wallet,
    walletDecrypted,
    walletEncrypted,
    snackbarMessage,
    set
  }) => async password => {
    set({ loading: true });
    try {
      let message;
      if (wallet.data.keystore.nonce !== undefined) {
        const plainText = await cipherTextWalletJsonToPlainTextWalletJson(
          wallet.data,
          password
        );
        walletDecrypted({ data: plainText });
        message = "Unlocked wallet.";
      } else {
        const cipherTextWallet = await plainTextWalletJsonToCipherTextWalletJson(
          wallet.data,
          password
        );
        walletEncrypted({ data: cipherTextWallet });
        message = "Locked wallet.";
      }
      snackbarMessage({
        snackbarMessage: {
          message,
          variant: "success",
          open: true
        }
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: "Could not unlock wallet.",
          variant: "error",
          open: true
        }
      });
    }
    set({ loading: false });
  },
  sign: ({ wallet, encodedSignature, snackbarMessage, set }) => async ({
    payload,
    creator,
    kid,
    password
  }) => {
    set({ loading: true });
    try {
      const signed = await sign({
        data: payload,
        creator: `${creator}#kid=${kid}`,
        privateKey: await getUnlockedPrivateKey(
          wallet.data.keystore[kid].data.privateKey,
          password
        )
      });

      const message = "Signed payload...";

      const encoded = base64url(JSON.stringify(signed));

      snackbarMessage({
        snackbarMessage: {
          message,
          variant: "success",
          open: true
        }
      });

      encodedSignature({
        encoded
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: "Could not sign payload.",
          variant: "error",
          open: true
        }
      });
    }
    set({ loading: false });
  },

  verify: ({ snackbarMessage, set }) => async ({ signedData }) => {
    set({ loading: true });
    try {
      const verified = await verify({
        data: signedData
      });

      if (verified) {
        snackbarMessage({
          snackbarMessage: {
            message: "Signature is valid.",
            variant: "success",
            open: true
          }
        });
      } else {
        snackbarMessage({
          snackbarMessage: {
            message: "Signature is not valid.",
            variant: "error",
            open: true
          }
        });
      }
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: e.message,
          variant: "error",
          open: true
        }
      });
    }
    set({ loading: false });
  },

  encrypt: ({ wallet, encodedEncryption, snackbarMessage, set }) => async ({
    fromKeyId,
    toKeyId,
    data,
    password
  }) => {
    set({ loading: true });
    try {
      const cipherTextPayload = await encryptFor({
        fromKeyId,
        toKeyId,
        publicKey: await getPublicKeyByKeyId(toKeyId),
        privateKey: await getUnlockedPrivateKey(
          wallet.data.keystore[fromKeyId.split("#kid=")[1]].data.privateKey,
          password
        ),
        data
      });
      const message = "Encrypted payload...";

      const encoded = base64url(JSON.stringify(cipherTextPayload));

      encodedEncryption({
        encoded
      });

      snackbarMessage({
        snackbarMessage: {
          message,
          variant: "success",
          open: true
        }
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: "Could not encrypt payload.",
          variant: "error",
          open: true
        }
      });
    }
    set({ loading: false });
  },

  decrypt: ({ wallet, decryptedData, snackbarMessage, set }) => async ({
    fromKeyId,
    toKeyId,
    cipherText,
    password
  }) => {
    set({ loading: true });
    try {
      const payload = await decryptFor({
        fromKeyId,
        toKeyId,
        privateKey: await getUnlockedPrivateKey(
          wallet.data.keystore[toKeyId.split("#kid=")[1]].data.privateKey,
          password
        ),
        cipherText
      });

      decryptedData({
        decryptedData: payload
      });

      snackbarMessage({
        snackbarMessage: {
          message: "Decrypted payload...",
          variant: "success",
          open: true
        }
      });
    } catch (e) {
      console.error(e);
      snackbarMessage({
        snackbarMessage: {
          message: "Could not decrypt payload.",
          variant: "error",
          open: true
        }
      });
    }
    set({ loading: false });
  }
});
