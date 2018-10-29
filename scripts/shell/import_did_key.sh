DID=$1

node -e "fs.writeFileSync('./temp-$DID.key', require('./dids/$DID/didDocument.json').publicKey[0].publicKeyPem)"

gpg --import ./temp-$DID.key

rm ./temp-$DID.key