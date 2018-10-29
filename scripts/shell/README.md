### Create DID Keys

```
./scripts/shell/create_did_keys.sh
```

### Create DID Document

```
npm run did:create_document ./vault/gpg.public.key ./vault/ssh.pub ./vault/fingerprint
```

### Sign DID Document

```
./scripts/shell/sign_did_document.sh $DID
```

### Verify DID Document

```
./scripts/shell/verify_did_document.sh $DID
```

### Cleanup

```
./scripts/cleanup.sh
```