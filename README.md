# Github DID

[![Build Status](https://travis-ci.org/transmute-industries/github-did.svg?branch=master)](https://travis-ci.org/transmute-industries/github-did)

##### This is experimental, not endorsed by Github, and under development.

> Decentralized Identifiers (DIDs) are a new type of identifier for verifiable, "self-sovereign" digital identity. DIDs are fully under the control of the DID subject, independent from any centralized registry, identity provider, or certificate authority. DIDs are URLs that relate a DID subject to means for trustable interactions with that subject. DIDs resolve to DID Documents — simple documents that describe how to use that specific DID. Each DID Document contains at least three things: cryptographic material, authentication suites, and service endpoints. Cryptographic material combined with authentication suites provide a set of mechanisms to authenticate as the DID subject (e.g., public keys, pseudonymous biometric protocols, etc.). Service endpoints enable trusted interactions with the DID subject.

### Install CLI

```
npm i -g @transmute/github-did 
```

### Install Library

```
npm i @transmute/github-did --save
```


## Motivation

The `ghdid` method is meant to make working with DIDs very simple at the cost of trusting Github.com for assisting in resolving DID Documents.

Many developers are familar with Github, and its 2 supported public key cryptosystems, GPG and SSH.

Linked Data Signatures are difficult to work with when operating a server or running a local node of some distributed system / blockchain is a requirement.

The objective of Github DID is to encourage contribution to the [DID Spec](https://w3c-ccg.github.io/did-spec/) and [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures), and allow rapid development of extensions to these without requiring the use of slow, or complicated more trustless infrastructure, such as blockchains or other distributed systems.

## Getting Started

```
ghdid init alice@example.com yolo
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
ghdid resolve did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e
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

Notice there is nothing here about this repo (`https://github.com/transmute-industries/github-did`), this is because the `ghdid` method works with any github repo that is public, the identifier includes the details needed to get the did document from dids folder. If you want to create a new folder structure, you must create a new DID method.

### What can I do with my DID?

Use your DIDs to test Linked Data Signatures, such `OpenPgpSignature2019` which is currently being developed. When DID Documents are signed, they include a `proof` attribute, which is used to provide proof that someone controlled the private key associated with the public key listed in the did document at the `created` datetime.

For example:

```json
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e",
  "publicKey": [
    {
      "id": "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e#kid=8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e",
      "type": "OpenPgpSignature2019",
      "owner": "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e",
      "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXDo53RMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRMiYWxpY2VA\nZXhhbXBsZS5jb20iwncEEBMIACkFAlw6Od0GCwkHCAMCCRA/03d/CzwNKwQV\nCAoCAxYCAQIZAQIbAwIeAQAARVEBANrQ9hjBRec22DvJ67hsk+539ooBV16t\nKLCOPAE89nU3AQCYeKyulra02CR4SQaKSqkt9Zd2ZDqAGkpRcpGep34HiM5T\nBFw6Od0SBSuBBAAKAgMENtibiizsNERI4B9yj5Xb6UC8j23rzup3f77P4VMg\nYEQxYQeunmptCoNCv2xbKXexKgUH+bIODI7VtoPlJTDbgAMBCAfCYQQYEwgA\nEwUCXDo53QkQP9N3fws8DSsCGwwAANBPAP9/lUus9vaB/l9Uc4IS8uizYHHL\neJbkD0+kuIsvRy6JEgD/dZ+DipZF2DM3jiRnuf/9/7bccDSSwsDgTBHn9OIi\n0qc=\r\n=NNnu\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n"
    }
  ],
  "authentication": [
    {
      "publicKey": "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e#kid=8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e",
      "type": "OpenPgpSignature2019"
    }
  ],
  "proof": {
    "type": "OpenPgpSignature2019",
    "creator": "did:ghdid:transmute-industries~github-did~8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e#kid=8e3eaf0eddf5bbaea1b6881c819ef4ed1a70ef95ca48ef5c535d2073ca72db9e",
    "domain": "github-did",
    "nonce": "14917f9f7b591cf13ec52dd5d1fc2f93",
    "created": "2019-01-12T19:32:45.415Z",
    "signatureValue": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlw6QN4ACgkQP9N3fws8DSus2QEAiyLiERPrUgBgnZ5V3fUd\r\nFixkUhzk4DvoKfFLeQfBxFkBAIUwuDyIfAYoslCaZaGhxcvDbso4eqIYb9HD\r\n0ZY0DZn/\r\n=LbnT\r\n-----END PGP SIGNATURE-----\r\n"
  }
}
```

### How do Linked Data Signatures work?

They provide authentication for JSON-LD Documents, prooving that a DID has signed the document, by attachign a signature which can be verified by resolving the DID Document. Linked Data Signatures are currently being developed and standardized, here's how they typically work.

When a user wants to sign a json-ld document, they ensure that the public key corrosponding to their private key is listed in their did document. In the document above, the public key is in `publicKeyPem` format and as an `id` which will become the `creator` attribute on the signed linked data.

Next a string that will be signed is created from the document and the signatureOptions, which can include properties like `nonce`, `domain`, `type`, `creator`, etc... This step is called [createVerifyData](https://w3c-dvcg.github.io/ld-signatures/#create-verify-hash-algorithm).

This step ensures that a json document can be converted to the same hash regardless of the language (python, haskell, go, javascript, etc...). The most common cannonization algorithm is [URDNA2015](https://json-ld.github.io/normalization/spec/index.html).

You can see how it is used in [Mastodon](https://github.com/tootsuite/mastodon/blob/cabdbb7f9c1df8007749d07a2e186bb3ad35f62b/app/lib/activitypub/linked_data_signature.rb#L19).

Here is the method used in the [OpenPgpSignature2019](https://github.com/transmute-industries/PROPOSAL-OpenPgpSignature2019/blob/master/src/common.js) Proposal. 

The final string to be signed is of the following format: `${optionsHash}${documentHash}`.

When verifying a linked data signature, first the signing key is retrieved from the `creator` attribute, if the its a url, this is done over http, if its a keyId in a DID, a DID Resolver is used. Once the key is available the signatureValue in the `proof` or `signature` can be verified. Often some encoding transforms are required before the signature can be verified, for example `RsaSignature2017` and `EcdsaKoblitzSignature2016` use `base64` encoding of the result of the signature algorithm. 

### Danger / Fun

The Linked Data Signature Spec is still evolving, and you may find cases where a signature type such as `EcdsaKoblitzSignature2016` is claimed to be used, but where the signatures cannot be verified with libraries such as [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures). This is often due to a lack of understanding regarding Linked Data Signature `type` field. This field should match a value in the [ld-cryptosuite-registry](https://w3c-ccg.github.io/ld-cryptosuite-registry/). Unfortunatly, this registry is very out of date and does not even contain `RsaSignature2017` used by Mastodon, which is probably the mostly widely used signature suite. This can cause developers to make up their own signature type and that will work fine so long as they are the only system verifying and signing. Doing this weakens the JSON-LD Signature spec, making it harder for developers to know what `EcdsaKoblitzSignature2016` means, please don't make this worse. 

If you would like to develop a new signature suite, like the ones we propose such as `OpenPgpSignature2019` and  `EcdsaKoblitzSignature2019`, make sure to make it clear that it is a `PROPOSAL`, and get it registered once its clearly documented, has test coverage, and supports at least the fields described in [terminology](https://w3c-dvcg.github.io/ld-signatures/#terminology).


#### Help Wanted

The DID Spec is long, and this project does not fully support a DID implementation. If you would like to contribute, or have questions about DIDs, please feel free to open an issue or a PR.

### Development

```
npm i
npm run ghdid init alice@example.com yolo
```

### W3 Links

- https://w3c-ccg.github.io/did-spec/
- https://w3c-dvcg.github.io/ld-signatures
- https://json-ld.org/spec/latest/json-ld/