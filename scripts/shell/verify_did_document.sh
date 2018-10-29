
DOC=$(node -e "console.log('./dids/$1/didDocument.json');")
SIG=$(node -e "console.log('$DOC'.replace('.json','.sig'));")
gpg \
--verify $SIG \
$DOC