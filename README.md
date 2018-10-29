# Github DID

> This is experimental, not endorsed by Github, and under development.

[![Build Status](https://travis-ci.org/transmute-industries/github-did.svg?branch=master)](https://travis-ci.org/transmute-industries/github-did)

## Getting Started

```
git clone git@github.com:transmute-industries/github-did.git
cd github-did
npm i
mkdir vault
chmod 700 ./vault
```

## Create your DID Keys

```
gpg --full-generate-key
gpg --export -a "Alice" > ./vault/gpg.public.key
gpg --export-secret-key -a "Alice" > ./vault/gpg.private.key
gpg --fingerprint alice@example.com > ./vault/fingerprint

ssh-keygen -t rsa -b 4096 -N "12345" -C "alice@example.com" -f ./vault/ssh
```

## Create your DID Document

```
npm run did:create_document ./vault/gpg.public.key ./vault/ssh.pub ./vault/fingerprint
```

## Sign your DID Document

```
./scripts/shell/sign_did_document.sh $DID
```

## Verify your DID Document

```
./scripts/shell/verify_did_document.sh
```

## Verify all DID Documents

```
npm run did:check
```

## Add your DID Document to git

```
git add ./dids/
git commit -m "adding my did documents"
git push origin master
```

## Conclusion

### Positive

- Free! No cost in USD or crypto to store DIDs.
- Fast! Easy to resolve and update DID Documents.
- Easy! Simple construction, using legacy crypto systems.
- Ownable! Users can own their own DID repo.

### Negative

- Censorable! Github or network adversaries can censor the resolver. 
- Not Scalable! Keeping a copy with git is probably not scalable.
- Forkable! Leading to lots of duplication, confusion or stale documents...

### Further Reading

[Generating a GPG Key for Github](https://help.github.com/articles/generating-a-new-gpg-key/)

[Generating an SSH Key for Github](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

[Learn more about the W3C DID Spec](https://w3c-ccg.github.io/did-spec/)
