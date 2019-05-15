
# Change this before running this script!
GITHUB_USERNAME="OR13"
# NOT YOUR GITHUB PASSWORD!!! DO NOT REUSE PASSWORDS!!!!!!!!!
GITHUB_DID_PASSWORD="cake"
GITHUB_DID_CLAIM="./scripts/data/claim.json"
GITHUB_DID_CLAIM_SIGNED="./scripts/data/claim.signed.json"
GITHUB_DID_CLAIM_SIGNED_ENCRYPTED="./scripts/data/claim.signed.encrypted.json"
GITHUB_DID_CLAIM_SIGNED_ENCRYPTED_DECRYPTED="./scripts/data/claim.signed.decrypted.json"


npm run ghdid init $GITHUB_DID_PASSWORD https://github.com/$GITHUB_USERNAME/ghdid -- --force
NODE_ENV='production' npm --silent run ghdid resolve did:github:$GITHUB_USERNAME > ./scripts/data/did:github:$GITHUB_USERNAME.jsonld
npm run ghdid sign $GITHUB_DID_PASSWORD $GITHUB_DID_CLAIM $GITHUB_DID_CLAIM_SIGNED 
npm run ghdid verify $GITHUB_DID_CLAIM_SIGNED

KEY_1=$(cat ./scripts/data/did:github:$GITHUB_USERNAME.jsonld | jq '.publicKey[1].id')
KEY_2=$(cat ./scripts/data/did:github:$GITHUB_USERNAME.jsonld | jq '.publicKey[1].id')
npm run ghdid encrypt $GITHUB_DID_PASSWORD $GITHUB_DID_CLAIM_SIGNED $GITHUB_DID_CLAIM_SIGNED_ENCRYPTED $KEY_1 $KEY_2 
npm run ghdid decrypt $GITHUB_DID_PASSWORD $GITHUB_DID_CLAIM_SIGNED_ENCRYPTED $GITHUB_DID_CLAIM_SIGNED_ENCRYPTED_DECRYPTED
