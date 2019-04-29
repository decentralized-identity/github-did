---
title: Using the CLI
date: "2019-04-29T22:12:03.284Z"
image: "/imgs/micro_2.jpg"
---

In this tutorial, we'll walk you through how to set up a GitHub DID repo using the CLI and a local wallet to manage keys.


### Clone the github-did repo

Head over to [https://github.com/transmute-industries/github-did](https://github.com/transmute-industries/github-did) and fork the repository.

In the `dids` folder is where you will publish your did document(s).

### Setup the CLI

GitHub DID comes with a command line interface.

```bash
npm i -g @github-did/cli
```

You can now use the `ghdid` cli too to manage a local wallet.

In order to create an empty wallet, run

```bash
ghdid init my-password https://github.com/<your-github-username>/github-did
```
Note that you need to specify the url of your forked github-did repo.

This will create a wallet.json file, encrypted with the provided password. Check it out at `~/.github-did/wallet.json`

### Create and submit your first DID Document

```bash
ghdid addKey my-password
```

This will:
- add an openpgp key to your wallet
- create a DID document in your local repo `~/.github-did/github-did/dids/`
- display the resulting DID. It should be of the format: `did:ghdid:gjgd~github-did~f9f083a49f35feb0a1e50785f6ac92398ae1b406c39c111084f09579f4687369`

Now you can use git to commit your new DID and push it to your repo:

```
cd ~/.github-did/github-did
git add ./dids
git commit -m "Add my did"
git push origin master
```

Finally, head over to [https://github-did.com/resolver](https://github-did.com/resolver) and try to resolve your DID.

Congrats! You should now have a usable / resolvable DID to experiment with!

To learn how to use your keys / DID documents head over to the [next article](#)