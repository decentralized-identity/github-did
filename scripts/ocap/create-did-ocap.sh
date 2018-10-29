


DID=$1
# echo "DID $DID"
CAP=$2

FINGERPRINT=$(node -e "console.log('$DID'.split(':').pop());")
# echo "FINGERPRINT $FINGERPRINT"

gpg \
--detach-sig \
--armor \
-u $FINGERPRINT \
--output "./scripts/ocap/ocap1.sig" \
--sign $CAP