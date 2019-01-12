# Github DID

[![Build Status](https://travis-ci.org/transmute-industries/github-did.svg?branch=master)](https://travis-ci.org/transmute-industries/github-did)

##### This is experimental, not endorsed by Github, and under development.

### Install

```
npm i -g @transmute/github-did
```

#### Getting Started

```
ghdid init alice@example.com yolo
```

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


### Development

```
npm i 
npm run ghdid init alice@example.com yolo
```

