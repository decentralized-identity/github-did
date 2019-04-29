# GitHub DID

[![Build Status](https://travis-ci.org/decentralized-identity/github-did.svg?branch=master)](https://travis-ci.org/decentralized-identity/github-did) [![codecov](https://codecov.io/gh/decentralized-identity/github-did/branch/master/graph/badge.svg)](https://codecov.io/gh/decentralized-identity/github-did) [![Docs](https://readthedocs.com/projects/transmute-github-did/badge/?version=latest)](https://docs.github-did.com) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/decentralized-identity/github-did/blob/master/LICENSE) [![GitHub forks](https://img.shields.io/github/forks/decentralized-identity/github-did.svg?style=social&label=Fork&maxAge=2592000?style=flat-square)](https://github.com/decentralized-identity/github-did#fork-destination-box) [![GitHub stars](https://img.shields.io/github/stars/decentralized-identity/github-did.svg?style=social&label=Star&maxAge=2592000?style=flat-square)](https://github.com/decentralized-identity/github-did/stargazers)

### [Website](https://github-did.com) &middot; [Swagger](https://github-did.com/api/docs)

### 🚧 This is experimental, not endorsed by GitHub, and under development. 🚧

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

The `ghdid` method is meant to make working with DIDs very simple at the cost of trusting Github.com for assisting in resolving DID Documents.

Many developers are familar with Github, and its 2 supported public key cryptosystems, GPG and SSH.

Linked Data Signatures are difficult to work with when operating a server or running a local node of some distributed system / blockchain is a requirement.

The objective of GitHub DID is to encourage contribution to the [DID Spec](https://w3c-ccg.github.io/did-spec/) and [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures), and allow rapid development of extensions to these without requiring the use of slow, or complicated more trustless infrastructure, such as blockchains or other distributed systems.

## Getting Started

```
ghdid init @example.com yolo
ghdid addKey yolo
```

The email goes in your OpenPGP key, the password is used to protect your private key.

This will clone the repo into `~/.github-did/${repo}`, where `repo` is specified by package.json repository (github-did). Your wallet will be created, encrypted and stored:

`~/.github-did/wallet.json`

Your DID Document will be:

`~/.github-did/${repo}/dids/${kid}.jsonld`;

Use git to commit your new DID Before proceeding.

```
cd ~/.github-did/github-did
git add ./dids
git commit -m "add did for alice@example.com"
git push origin master
```

If you wish to use our repo, you must open a pull request instead.

Now that your `DID Document` is on Github in the correct repo, you can use the `ghdid` did method resolver, and linked data signature verification libraries.

```
ghdid resolve did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a
```

This will resolve the DID to a DID Document by using Github and https.

The signature for the DID Document will be checked.

### What is a DID Method?

```js
const createDID = (method, user, repo, kid) => {
  return `did:${method}:${user}~${repo}~${kid}`;
};
```

The method is always `ghdid` for identifiers of the form `${user}~${repo}~${kid}`. If you wish to create your own, please use a different method name, for example `ghdid-${ext}`, then you can decide how you want to map the github `username` and `repo` to a did document. Technically you don't need the `kid`, you could use the repo as the identifer, for example: `did:gh:username~repo`, but then you would need a new repo for every new DID. Regardless of your choices, a DID Method links a structured identier to a json-ld document, so if you decide you want to do that in a different way, then you must create a new did method.

### How does the DID Resolver work?

A DID Resolver is a simple async function which takes a DID and returns a promise for a DID Document.

This one works, by converting the DID to a path in a git repo and then requesting the json-ld document at that path.

```js
const didToDIDDocumentURL = did => {
  const didToDIDDocumentURL = did => {
  const [_, method, identifier] = did.split(":");
  if (_ !== "did") {
    throw new Error("Invalid DID");
  }
  if (method !== "ghdid") {
    throw new Error("Invalid ghdid");
  }
  const [username, repo, kid] = identifier.split("~");
  const base = "https://raw.githubusercontent.com/";
  const didRepoDir = "/master/dids";
  return `${base}${username}/${repo}${didRepoDir}/${kid}.jsonld`;
};
```

Notice there is nothing here about this repo (`https://github.com/decentralized-identity/github-did`), this is because the `ghdid` method works with any github repo that is public, the identifier includes the details needed to get the did document from dids folder. If you want to create a new folder structure, you must create a new DID method.

### What can I do with my DID?

Use your DIDs to test Linked Data Signatures, such `OpenPgpSignature2019` which is currently being developed. When DID Documents are signed, they include a `proof` attribute, which is used to provide proof that someone controlled the private key associated with the public key listed in the did document at the `created` datetime.

For example:

```json
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a",
  "publicKey": [
    {
      "id": "did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a#kid=1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a",
      "type": "OpenPgpSignature2019",
      "owner": "did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a",
      "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXDqOxhMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRMiYWxpY2VA\r\nZXhhbXBsZS5jb20iwncEEBMIAB8FAlw6jsYGCwkHCAMCBBUICgIDFgIBAhkB\r\nAhsDAh4BAAoJEPwxTLocb2BmC2YA+gONpQ3zIBtHR5uxFGwLTVliYwxz5CcD\r\nNfHPz7q+Z+WzAQCuCyYtkwu3y28HhT6YWVm2EQuVnUw6PRgsITeMUTTsWs5T\r\nBFw6jsYSBSuBBAAKAgMENtibiizsNERI4B9yj5Xb6UC8j23rzup3f77P4VMg\r\nYEQxYQeunmptCoNCv2xbKXexKgUH+bIODI7VtoPlJTDbgAMBCAfCYQQYEwgA\r\nCQUCXDqOxgIbDAAKCRD8MUy6HG9gZlq4AQCV3m/C5VI6meml0AHpWCFd9Rlj\r\nwsosaak1gsd+aawnGgEA95414FwaqMWVVbq7hWBHtBOHJiL5ezHxKmEhL7K9\r\nrf8=\r\n=ViJn\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
    }
  ],
  "authentication": [
    {
      "publicKey": "did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a#kid=1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a",
      "type": "OpenPgpSignature2019"
    }
  ],
  "proof": {
    "type": "OpenPgpSignature2019",
    "creator": "did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a#kid=1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a",
    "domain": "github-did",
    "nonce": "2102e5883aa896c49d205405808a184f",
    "created": "2019-01-13T01:05:11.774Z",
    "signatureValue": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlw6jsgACgkQ/DFMuhxvYGZGLwEAoSZjSgX9QRBscjHNNpR0\r\nGiIrIrF3W+ixFlCTUCIBqlABAJHApKcMekuQrsq7SNY4vlH2W3vklp9lW7S7\r\nHpLvULmp\r\n=BHgj\r\n-----END PGP SIGNATURE-----\r\n"
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

Commercial Support
------------------

Commercial support for this library is available upon request from
Transmute: support@transmute.industries.

### Related Work

- https://w3c-ccg.github.io/did-spec/
- https://w3c-dvcg.github.io/ld-signatures
- https://json-ld.org/spec/latest/json-ld/
