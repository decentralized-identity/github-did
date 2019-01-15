# Github DID

[![Build Status](https://travis-ci.org/transmute-industries/github-did.svg?branch=master)](https://travis-ci.org/transmute-industries/github-did)

##### This is experimental, not endorsed by Github, and under development.

> Decentralized Identifiers (DIDs) are a new type of identifier for verifiable, "self-sovereign" digital identity. DIDs are fully under the control of the DID subject, independent from any centralized registry, identity provider, or certificate authority. DIDs are URLs that relate a DID subject to means for trustable interactions with that subject. DIDs resolve to DID Documents — simple documents that describe how to use that specific DID. Each DID Document contains at least three things: cryptographic material, authentication suites, and service endpoints. Cryptographic material combined with authentication suites provide a set of mechanisms to authenticate as the DID subject (e.g., public keys, pseudonymous biometric protocols, etc.). Service endpoints enable trusted interactions with the DID subject.

## Motivation

The `ghdid` method is meant to make working with DIDs very simple at the cost of trusting github for assisting in resolving DID Documents.

Many developers are familar with Github, and its 2 supported public key cryptosystems, GPG and SSH.

Linked Data Signatures are difficult to work with when operating a server or running a local node of some distributed system is a requirement.

The objective of Github DID is to encourage contribution to the [DID Spec](https://w3c-ccg.github.io/did-spec/) and [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures).

## Help Wanted

The DID Spec is long, and this project does not fully support a DID implementation. If you would like to contribute, or have questions about DIDs, please feel free to open an issue.


### Install

```
npm i -g @transmute/github-did
```

#### Getting Started

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

### Development

```
npm i
npm run ghdid init alice@example.com yolo
```

### W3 Links

- https://w3c-ccg.github.io/did-spec/
- https://w3c-dvcg.github.io/ld-signatures
- https://json-ld.org/spec/latest/json-ld/