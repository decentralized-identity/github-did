# @github-did/functions

Firebase Cloud Functions for Github DID

## Setting Environment Variables

```
firebase functions:config:set github_did.env=production
firebase functions:config:set github_did.commit=$(git log -1 --format="%H")
```