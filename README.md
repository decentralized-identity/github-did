# Github DID

> This is experimental, not endorsed by Github, and under development.

[![Build Status](https://travis-ci.org/transmute-industries/github-did.svg?branch=master)](https://travis-ci.org/transmute-industries/github-did)

### Vault Directory

```
mkdir vault
chmod 700 ./vault
```

### GPG

[Github Instructions](https://help.github.com/articles/generating-a-new-gpg-key/)

#### Create a new key

Be sure not to store PII here, DID Documents should not contain PII or keys which contain PII.

Github integration may require you to violate this policy :(

```
gpg --full-generate-key
```

#### Export both public and private keys to vault directory

```
gpg --export -a "Tim Tim" > ./vault/gpg.public.key
gpg --export-secret-key -a "Tim Tim" > ./vault/gpg.private.key
gpg --fingerprint tim@example.com > ./vault/fingerprint
```

### SSH

[Github Instructions](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

#### Create a new key

```
ssh-keygen -t rsa -b 4096 -C "tim@example.com"
```

Select the vault directory: `./vault`

### DID

#### Create a new DID

[W3C Spec](https://w3c-ccg.github.io/did-spec/)

```
npm run did:create ./vault/gpg.public.key ./vault/ssh.pub ./vault/fingerprint
```


#### Sign DID Document

```
gpg \
--detach-sig \
--armor \
-u 36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9 \
--output ./dids/did:github.com:transmute-industries:github-did:36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9/didDocument.sig \
--sign ./dids/did:github.com:transmute-industries:github-did:36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9/didDocument.json
```

#### Verify DID Document Signature

```
gpg \
--verify ./dids/did:github.com:transmute-industries:github-did:36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9/didDocument.sig \
./dids/did:github.com:transmute-industries:github-did:36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9/didDocument.json
```

Using OpenPGP.js

```
npm run did:verify ./dids/did:github.com:transmute-industries:github-did:36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9/didDocument.json ./dids/did:github.com:transmute-industries:github-did:36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9/didDocument.sig
```

#### Resolver

```
npm run did:resolver
curl http://localhost:7000/1.0/identifiers/github.com:transmute-industries:github-did:36BF2C3C2BED46B69EACA5840B9B6849A9DE4BE9
```