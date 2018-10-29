
DID=$1
# echo "DID $DID"

FINGERPRINT=$(node -e "console.log('$DID'.split(':').pop());")
# echo "FINGERPRINT $FINGERPRINT"

gpg \
--detach-sig \
--armor \
-u $FINGERPRINT \
--output "./dids/$DID/didDocument.sig" \
--sign "./dids/$DID/didDocument.json"