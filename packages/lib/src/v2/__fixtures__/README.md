### Key Generation

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout > public.pem
```