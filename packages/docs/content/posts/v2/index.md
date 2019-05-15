---
title: V2... Even More Centralized
date: "2019-05-14T22:12:03.284Z"
image: "/imgs/micro_8.jpg"
---

We've done a major rewrite in an attempt to simplify the setup process, and clarify how centralized and dependant on GitHub this method really is.

Recently, there has been a lot of discussion regarding centralization and the DID spec.

#### [General: current language precludes DIDs/methods leased from an authority](https://github.com/w3c-ccg/did-wg-charter/issues/16)

#### [Decentralized Identifier: "Decentralized" in working group name](https://github.com/w3c-ccg/did-wg-charter/issues/22)

#### [Prioritizing Individual Sovereignty over Interoperability](https://stories.jolocom.com/prioritizing-individual-sovereignty-over-interoperability-95ec17a36c9b)

GitHub DID method should be used mostly for testing and development, and its risks, tradeoffs and implementation details must be clearly communicated to users, and to put an even finer point on it:

> GitHub DID is centralized, github.com is the root of trust, and repo permissions MUST be considered when deciding whether a DID Document should be trusted.

That being said, git has a lot of nice features that are in the family of features used to build truley decentralized identifiers, and there is a lot of interesting work around git    (small g... the software) / git-like protocols and DIDs.

#### [Toward scalable decentralized identifier systems](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Toward-scalable-decentralized-identifier-systems/ba-p/560168)

#### [Why Decentralized Identity Matters: Github’s Identity Innovation and Shortcoming](https://continuations.com/post/131622514215/why-decentralized-identity-matters-githubs)

### Whats new in "v2"

There is no official release yet... 

##### New DID format: did:github:USERNAME

We opted to abandon complicated identifier creation in favor of directly relying on the github username and repo. This means less DIDs, but much simpler resolver, and much more user friendly identifiers. We think its worth it for now, and we can add more complex options later if more people are interested in contributing or using GitHub DID.

This means that we also changed the format of the `didToDIDDocumentURL` function, which converts a "did" to a URL to a JSON-LD Document on github.com.

The new format is: `https://github.com/OR13/ghdid/blob/master/index.jsonld`

We "did" this because it unlikely to conflict with any existing repo, and we thought it might be cool to link the cli binary `ghdid` to the repo that a user uses to store their GitHub DID.

If you hate this idea, [please open an issue](https://github.com/decentralized-identity/github-did/issues/new).

We've also updated the wallet demo, used for sign, verify, encrypt and decrypt with a proposed OpenPGP Signature Suite. If you are interested in helping develop the signature suite used in these demos, please consider contributing:

- [W3C OpenPgpSignature2019 Proposal](https://github.com/w3c-ccg/community/issues/71)
- [OpenPgpSignature2019 JS Implementation and Spec](https://github.com/transmute-industries/PROPOSAL-OpenPgpSignature2019)

### Next steps?

#### GitHub API Integration

We provide a REST API which can be used to resolve GitHub DIDs, but we'd like to integrate GitHub APIs and provide a more managed easier to use experience. This would also give us a chance to experiment with GitHub OAuth and GitHub DID.

#### RSA / ECC Signature Suite Demos

We would like to add some other key types to support interoperability with other DID Methods, especially ones that use `secp256k1` curve, used by Bitcoin and Ethereum.

