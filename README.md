# GitHub DID

[![Build Status](https://travis-ci.org/decentralized-identity/github-did.svg?branch=master)](https://travis-ci.org/decentralized-identity/github-did) [![codecov](https://codecov.io/gh/decentralized-identity/github-did/branch/master/graph/badge.svg)](https://codecov.io/gh/decentralized-identity/github-did) [![Docs](https://assets.readthedocs.org/static/projects/badges/passing-flat.svg)](https://docs.github-did.com) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/decentralized-identity/github-did/blob/master/LICENSE) [![GitHub forks](https://img.shields.io/github/forks/decentralized-identity/github-did.svg?style=social&label=Fork&maxAge=2592000?style=flat-square)](https://github.com/decentralized-identity/github-did#fork-destination-box) [![GitHub stars](https://img.shields.io/github/stars/decentralized-identity/github-did.svg?style=social&label=Star&maxAge=2592000?style=flat-square)](https://github.com/decentralized-identity/github-did/stargazers)

### [DID method specification](./docs/did-method-spec/index.md)

### [Website](https://github-did.com)

### [Swagger](https://github-did.com/api/docs)

### 🚧 This is experimental, not endorsed by GitHub, and under development. 🚧

#### ^ This means don't trust signatures, messages or software related to this project AND don't import keys that are used for anything else.

[![GitHub DID](./Logo.png)](https://github-did.com)

> Decentralized Identifiers (DIDs) are a new type of identifier for verifiable, "self-sovereign" digital identity. DIDs are fully under the control of the DID subject, independent from any centralized registry, identity provider, or certificate authority. DIDs are URLs that relate a DID subject to means for trustable interactions with that subject. DIDs resolve to DID Documents — simple documents that describe how to use that specific DID. Each DID Document contains at least three things: cryptographic material, authentication suites, and service endpoints. Cryptographic material combined with authentication suites provide a set of mechanisms to authenticate as the DID subject (e.g., public keys, pseudonymous biometric protocols, etc.). Service endpoints enable trusted interactions with the DID subject.

### Install CLI

```
npm i -g @github-did/cli
```

### Install Library

```
npm i @github-did/lib --save
```

## Motivation

The `github` method is meant to make working with DIDs very simple at the cost of trusting Github.com for assisting in resolving DID Documents.

Many developers are familar with Github, and its 2 supported public key cryptosystems, GPG and SSH.

Linked Data Signatures are difficult to work with when operating a server or running a local node of some distributed system / blockchain is a requirement.

The objective of GitHub DID is to encourage contribution to the [DID Spec](https://w3c-ccg.github.io/did-spec/) and [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures), and allow rapid development of extensions to these without requiring the use of slow, or complicated more trustless infrastructure, such as blockchains or other distributed systems.

## Getting Started

- Go to [Github.com](https://github.com/new) and create a new public repo called `ghdid`.
- When complete, you should end on a page like https://github.com/USERNAME/ghdid.

Next, you will need to install the cli to complete creating your GitHub DID.

```
npm i -g @github-did/cli
ghdid init "my-password" https://github.com/USERNAME/ghdid
```

If you mess up, you can overwrite everything with:

```
ghdid init "my-password" https://github.com/USERNAME/ghdid --force
```

Don't worry about this, its all experimental for now (which means be careful!)... This will automatically revoke (according to the DID Spec, not PGP!) all keys associated with your GitHub DID.

This will clone the repo into `~/.github-did/${repo}`. Your wallet will be created, encrypted and stored:

`~/.github-did/wallet.enc` and `~/.github-did/web.wallet.enc`

Your DID Document will be:

`~/.github-did/${repo}/index.jsonld`;

It will be commited and push automatically by `init`.


## Using the auto signer Github Action

The auto signer Github action will check the `proof` property of the did document for every commit on `master`, verify the validity of the signature, and automatically commit a valid `proof` property if necessary.

In order to use it, you need to set your wallet and password in the Github secrets of your repo: Settings -> Secrets Add a new secret and add two secrets:
- DID_WALLET: `cat ~/.github-did/web.wallet.enc | pbcopy` in order to copy the valud
- DID_WALLET_PASSWORD: the password you passed in the init command

## Resolve

Now that your `DID Document` is on Github in the correct repo, you can use the `github` did method resolver, and linked data signature verification libraries.

```
ghdid resolve did:github:OR13
```

This will resolve the DID to a DID Document by using Github and https.

The signature for the DID Document will be checked.

### How does the DID Resolver work?

A DID Resolver is a simple async function which takes a DID and returns a promise for a DID Document.

This one works, by converting the DID to a path in a git repo and then requesting the json-ld document at that path.

```js
const didToDIDDocumentURL = did => {
  const [_, method, identifier] = did.split(":");
  if (_ !== "did") {
    throw new Error("Invalid DID");
  }
  if (method !== "github") {
    throw new Error("Invalid DID, should look like did:github:USERNAME");
  }

  if (method === "github") {
    const base = "https://raw.githubusercontent.com/";
    const didRepoDir = "/master/index.jsonld";
    const url = `${base}${identifier}/ghdid${didRepoDir}`;
    return url;
  }
};
```

Notice there is nothing here about this repo (`https://github.com/decentralized-identity/github-did`), this is because the `github` method works with any github repo that is public, the identifier includes the details needed to get the did document from dids folder. If you want to create a new folder structure, you must create a new DID method, or convince us to change this one. Since this is all highly experimental, expect this to maybe change in the future.

### What can I do with my DID?

Use your DIDs to test Linked Data Signatures, such `OpenPgpSignature2019` which is currently being developed. When DID Documents are signed, they include a `proof` attribute, which is used to provide proof that someone controlled the private key associated with the public key listed in the did document at the `created` datetime.

For example:

```json
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:github:OR13",
  "publicKey": [
    {
      "encoding": "application/pgp-keys",
      "type": "OpenPgpVerificationKey2019",
      "id": "did:github:OR13#kid=ibHP1ksrJp5FQjP7hhmTXV7YE5o5bB6YFoODu9n_82E",
      "controller": "did:github:OR13",
      "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXNhPhBMFK4EEAAoCAwSTAb5KPYRzxaQoplpY8olodfbG3OxFqm6ULA6p\r\nvaCxZLKVwd4XCwSL8XcMMrPb78kmDEk0H5/Jl0qpRteRoy8CzRdhbm9uIDxh\r\nbm9uQGV4YW1wbGUuY29tPsJ3BBATCAAfBQJc2E+EBgsJBwgDAgQVCAoCAxYC\r\nAQIZAQIbAwIeAQAKCRAeL9f86407tSxDAP4/dXtxQKQxAsURQmNxwwlD03YM\r\n778dcM753Y4f96jW7QEAkLEDur/hKPLKKdFAi/9TCKNQvr7GVk1wYeYeiHMi\r\nJ/fOUwRc2E+EEgUrgQQACgIDBA7fIkmeQmvaG6a5B3X808pdFStePh7+uevf\r\njWpXbDYYTsxARpBT/xb34m0wrXGo7DEG6pAknQ6NBWiXSWX7qTkDAQgHwmEE\r\nGBMIAAkFAlzYT4QCGwwACgkQHi/X/OuNO7U8gQEAn3/lFx3C7iqzVG2BJgtH\r\n08Oc3h0YPwYnZjM9NXDsvEgA/3v5C28Jhx10RFKi9NDxAPjilwBDOZqYPK/s\r\nW3qWhGNU\r\n=RgYO\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
    },
    {
      "encoding": "application/pgp-keys",
      "type": "OpenPgpVerificationKey2019",
      "id": "did:github:OR13#kid=jNeDDagaBn466F-wH26YdQ5_NiabBvOlXTv5xItQakU",
      "controller": "did:github:OR13",
      "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXNhPhBMFK4EEAAoCAwRzQtkzDYQJy7xfHE0ld/Yoznx0q5bfVrx51FPG\r\nXzjd28wktnePW+3Riq0+3YUa09mZJWEuGPwrrGGXEqobjlVBzRdhbm9uIDxh\r\nbm9uQGV4YW1wbGUuY29tPsJ3BBATCAAfBQJc2E+EBgsJBwgDAgQVCAoCAxYC\r\nAQIZAQIbAwIeAQAKCRC0BtN9z0XDqWsSAQCso31Utz8xji2B7WUBX+2798ae\r\ncqxSxMPWnOQKenBA0gD+N9Qiq6sQ/sDipXuG7xIg4NH4qpf96xvPwC4hX9Jv\r\n3FzOUwRc2E+EEgUrgQQACgIDBIPkRAFeFOrFMXa4XoZ8+aZb4iXLhce6N0LE\r\nCh3YZNJLwxWVKVCxr8niWq3Fa8RTkLA+F7PvIHjnpgx5UGeqPzgDAQgHwmEE\r\nGBMIAAkFAlzYT4QCGwwACgkQtAbTfc9Fw6nomAEAl+1tioF0BlbTNm3c879W\r\nadI46tXfqHt8T6TGdIsKbmoA/RjOfCUvMT277p+v3aYjROI3M7ygh24jbjzx\r\nKBQj/GIJ\r\n=UGd9\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
    }
  ],
  "authentication": [],
  "service": [],
  "proof": {
    "type": "OpenPgpSignature2019",
    "creator": "did:github:OR13#kid=ibHP1ksrJp5FQjP7hhmTXV7YE5o5bB6YFoODu9n_82E",
    "domain": "GitHubDID",
    "nonce": "9c28424e440806718a5165670f79bbc2",
    "created": "2019-05-12T16:53:25.038Z",
    "signatureValue": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nwl0EARMIAAYFAlzYT4UACgkQHi/X/OuNO7WZQAD47BbeS2pgFW/WwPbHvC8I\r\nMfsOFhSJEywkED7uz0E4RwD/RRrsmPPb4S4Z+7D2skjiFtnd2nWd+BXcxvhm\r\nGzKk1FU=\r\n=W/tu\r\n-----END PGP SIGNATURE-----\r\n"
  }
}
```

### How do Linked Data Signatures work?

They provide authentication for JSON-LD Documents, prooving that a DID has signed the document, by attaching a signature which can be verified by resolving the DID Document. Linked Data Signatures are currently being developed and standardized, here's how they typically work:

When a user wants to sign a json-ld document, they ensure that the public key corrosponding to their private key is listed in their did document. In the document above, the public key is in `publicKeyPem` format and has an `id` which will become the `creator` attribute on the signed linked data. In other systems, such as `ActivityPub` used by Mastodon, DIDs are URLs, but the principle of retrieving cryptographic material from a downloaded json document is the same.

Next a string that will be signed is created from the document and the `signatureOptions`, which can include properties like `nonce`, `domain`, `type`, `creator`, etc... This step is called [createVerifyData](https://w3c-dvcg.github.io/ld-signatures/#create-verify-hash-algorithm).

Create Verify Data ensures that a json document can be converted to the same hash regardless of the language (python, haskell, go, javascript, etc...). The most common cannonization algorithm is [URDNA2015](https://json-ld.github.io/normalization/spec/index.html).

You can see how it is used in [Mastodon](https://github.com/tootsuite/mastodon/blob/cabdbb7f9c1df8007749d07a2e186bb3ad35f62b/app/lib/activitypub/linked_data_signature.rb#L19).

Here is the method used in the [OpenPgpSignature2019](https://github.com/transmute-industries/PROPOSAL-OpenPgpSignature2019/blob/master/src/common.js) Proposal.

The final string to be signed is of the following format: `${optionsHash}${documentHash}`. Sometimes a signature algorithm will hash this again, be careful to ensure your implementation can verify and generate signatures that are compatible with existing implementations.

When verifying a linked data signature, first the signing key is retrieved from the `creator` attribute, either over https or using a DID Resolver. Once the key is available the signatureValue in the `proof` or `signature` can be verified. Often some encoding transforms are required before the signature can be verified, for example `RsaSignature2017` and `EcdsaKoblitzSignature2016` use `base64` encoding of the result of the signature algorithm. Beware that [`base64` != `base64url`](http://websecurityinfo.blogspot.com/2017/06/base64-encoding-vs-base64url-encoding.html), which is commonly used with JWTs.

### Danger / Fun

The Linked Data Signature Spec is still evolving, and you may find cases where a signature type such as `EcdsaKoblitzSignature2016` is claimed to be used, but where the signatures cannot be verified with libraries such as [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures). This is often due to a lack of understanding regarding Linked Data Signature `type` field. This field should match a value in the [ld-cryptosuite-registry](https://w3c-ccg.github.io/ld-cryptosuite-registry/). Unfortunatly, this registry is very out of date and does not even contain `RsaSignature2017` used by Mastodon, which is probably the mostly widely used signature suite. This can cause developers to make up their own signature type and that will work fine so long as they are the only system verifying and signing. Doing this weakens the JSON-LD Signature spec, making it harder for developers to know what `EcdsaKoblitzSignature2016` means, please don't make this worse.

If you would like to develop a new signature suite, like the ones we propose such as `OpenPgpSignature2019` and `EcdsaKoblitzSignature2019`, make sure to make it clear that it is a `PROPOSAL`, and get it registered once its clearly documented, has test coverage, and supports at least the fields described in [terminology](https://w3c-dvcg.github.io/ld-signatures/#terminology).

#### Help Wanted

The DID Spec is long, and this project does not fully support a DID implementation. If you would like to contribute, or have questions about DIDs, please feel free to open an issue or a PR.

## Development

See `.travis.yml`.

```
npm i
npm run bootstrap
npm run lint
npm run test
```

##### [Local API Docs](http://localhost:5000/github-did/us-central1/main/docs)

##### [API Docs](http://github-did.com/api/docs)

```
npm i -g firebase-tools lerna
firebase login
firebase init
lerna init
```

- Update firebase.json to support lerna folder structure.
- [Enable Cloud Firestore](https://stackoverflow.com/questions/46582180/error-http-error-400-project-my-project-is-not-a-firestore-enabled-project)

- [Configure Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Configure Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## Commercial Support

Commercial support for this library is available upon request from
Transmute: support@transmute.industries.

### Related Work

- https://w3c-ccg.github.io/did-spec/
- https://w3c-dvcg.github.io/ld-signatures
- https://json-ld.org/spec/latest/json-ld/
