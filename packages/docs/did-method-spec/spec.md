# Github DID method specification

The `github` method is meant to make working with DIDs very simple at the cost of trusting Github.com for assisting in resolving DID Documents.

Many developers are familar with Github, and its 2 supported public key cryptosystems, GPG and SSH.

Linked Data Signatures are difficult to work with when operating a server or running a local node of some distributed system / blockchain is a requirement.

The objective of GitHub DID is to encourage contribution to the [DID Spec](https://w3c-ccg.github.io/did-spec/) and [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures), and allow rapid development of extensions to these without requiring the use of slow, or complicated more trustless infrastructure, such as blockchains or other distributed systems.

## Method syntax

The namestring identifying this did method is `github`

A DID that uses this method MUST begin with the following prefix: `did:github`. Per the DID specification, this string MUST be in lowercase.

The remainder of a DID after the prefix, called the did unique suffix, MUST be a valid Github username

Example: `did:github:gjgd`

## CRUD Operations

### Create

In order to create a Github DID, a Github user MUST:
- Create a repo named `ghdid`
- Create a valid did document named `index.jsonld`
- Push the document on the `master` branch

### Read

In order to resolve a `did:github:USERNAME`, you MUST read the `index.jsonld` document on the `master` branch of the `ghdid` repository of the user USERNAME

As a shortcut, a user MAY resolve the following URL:
```
https://raw.githubusercontent.com/USERNAME/ghdid/master/index.jsonld
```

### Update

In order to update a did document, a Github MUST update the `index.jsonld` file on the `master` branch of their `ghdid` repo

### Delete

In order to delete a did document, a Github MUST delete the `index.jsonld` file on the `master` branch of their `ghdid` repo

## Security and privacy considerations

1. This method relies on trusting Github's for resolving DID Documents
2. This method relies on trusting Github's for authenticating updates to a did document, but a user MAY chose to use Linked Data Signatures via the `proof` field of their did document for a strong verifiable cryptographic proof 
