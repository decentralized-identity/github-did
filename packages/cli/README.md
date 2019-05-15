# @github-did/cli

A command line interface for working with Github DIDs.

## Getting Started

- Go to [Github.com](https://github.com/new) and create a new public repo called `did`.
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

Don't worry about this, its all experimental for now (which means be careful!).

This will clone the repo into `~/.github-did/${repo}`. Your wallet will be created, encrypted and stored:

`~/.github-did/wallet.enc` and `~/.github-did/web.wallet.enc`

Your DID Document will be:

`~/.github-did/${repo}/index.jsonld`;

It will be commited and push automatically by `init`.

Now that your `DID Document` is on Github in the correct repo, you can use the `github` did method resolver, and linked data signature verification libraries.

```
ghdid resolve did:github:OR13
```

This will resolve the DID to a DID Document by using Github and https.

The signature for the DID Document will be checked.
