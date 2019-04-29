---
title: Getting Started
date: "2019-04-29T22:12:03.284Z"
image: "/imgs/micro_0.jpg"
---

In this tutorial, we'll walk you through how GitHub DID works.

## DID Method

At the core a DID is the `method`. its the process that helps resolve the identifier that looks like `did:method:123` to the document which is JSON-LD and contains the `publicKey` and `service` properties.

GitHub DID is experimental and supports a couple different formats for methods.


### Username DIDs

They look like this: 

```
did:github:or13
```

The resolver knows to convert this string to this url: 

```
https://raw.githubusercontent.com/OR13/did/master/did.jsonld
```

So long as `did.jsonld` is a properly formatted DID Document, `did:github:or13` is a valid DID.

### Repository DIDs

They look like this:

```
did:ghdid:gjgd~github-did~f9f083a49f35feb0a1e50785f6ac92398ae1b406c39c111084f09579f4687369
```

The resolver knows to convert this string to this url: 

```
https://raw.githubusercontent.com/gjgd/github-did/master/dids/f9f083a49f35feb0a1e50785f6ac92398ae1b406c39c111084f09579f4687369.jsonld
```

So long as `f9f083a49f35feb0a1e50785f6ac92398ae1b406c39c111084f09579f4687369.jsonld` is a properly formatted DID Document, `did:ghdid:gjgd~github-did~f9f083a49f35feb0a1e50785f6ac92398ae1b406c39c111084f09579f4687369` is a valid DID.

## Managing DID Documents

DID Documents can be signed with a `proof` property or not. The keys and services listed are up the the controller, and you can create a DID Document simply by copying one of the examples above and updating the id property and keys.

The entire security of this method relies on Github. Obviously, Github can censor, revoke, tamper or delete DIDs, which makes this method a "Centralized DID" or "Weak DID", the terminology is still evolving, you can see a healthy debate [here](https://github.com/w3c-ccg/did-wg-charter/issues/22).

## Managing Keys

Private keys associated with public keys listed in a document can be managed by various methods including, GPG, custom wallet systems, vaults or cloud based key management systems. Its obviously critical that private keys remain private, and that public keys are revoked (removed from documents), if private keys are compromised.

## Conclusion

You should now understand how to create a GitHub DID, using Github.com's built in UI and the examples provided

To learn how to use github-did's custom test wallet and cli to manage keys, and create documents, head over to the [using the cli](/using-the-cli/) 