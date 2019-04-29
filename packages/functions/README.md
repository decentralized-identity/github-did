# @github-did/functions

Firebase Cloud Functions for GitHub DID

##### [Local API Docs](http://localhost:5000/github-did/us-central1/main/docs)


## Setting Environment Variables

```
firebase functions:config:set github_did.env=production
firebase functions:config:set github_did.commit=$(git log -1 --format="%H")
```