gpg --full-generate-key 
gpg --export -a "Alice" > ./vault/gpg.public.key
gpg --export-secret-key -a "Alice" > ./vault/gpg.private.key
gpg --fingerprint alice@example.com > ./vault/fingerprint

ssh-keygen -t rsa -b 4096 -N "12345" -C "alice@example.com" -f ./vault/ssh