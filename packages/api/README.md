# @github-did/functions

Firebase Cloud Functions for GitHub DID

##### [Local API Docs](http://localhost:5000/github-did/us-central1/main/docs)
##### [Local API Docs](https://github-did.com/api/docs)


## Setting Environment Variables

```
firebase functions:config:set github_did.env=production
firebase functions:config:set github_did.commit=$(git log -1 --format="%H")
```

## .runtimeconfig.json

Set RUNTIME_CONFIG_PASSWORD in travis.

Be sure not build PRs, only pushed branches. Make sure you don't merge a PR that exfiltrates RUNTIME_CONFIG_PASSWORD.

See:
- [pull-requests-and-security-restrictions](https://docs.travis-ci.com/user/pull-requests/#pull-requests-and-security-restrictions)
- [Please note that encrypted environment variables are not available for pull requests from forks.](https://docs.travis-ci.com/user/encryption-keys/)

### Encrypting 

```
openssl enc -aes-256-cbc -in .runtimeconfig.json -out .runtimeconfig.json.enc -pass file:<( echo -n "$RUNTIME_CONFIG_PASSWORD" )
```

### Decrypting

```
openssl enc -d -aes-256-cbc -in .runtimeconfig.json.enc -out .runtimeconfig.json -pass file:<( echo -n "$RUNTIME_CONFIG_PASSWORD" )
```