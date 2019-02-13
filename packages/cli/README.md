# @github-did/cli

A command line interface for working with Github DIDs.

## Get started with the CLI

In order to create an empty wallet, run
```
ghdid init my-password
```
This will create a wallet.json file, encrypted with the provided password
Check it out at `~/.github-did/wallet.json`

Then add your first openpgp key
```
ghdid addKey my-password
```

The output will be a list of the key ids stored in the wallet, and the did associated with the did document created with that key

If you want to hold the keys of several different did documents into the same wallet, you can use tags

```
ghdid addKey my-password work-did-document
ghdid addKey my-password perso-did-document
```
## Send encrypted messages

Using the Transmute wallet, you now hold on your machine the private keys associated with your newly created did document, let's use them to send encrypted messages over Slack!

### Setting up Slack integration

First, go to: [https://api.slack.com/apps](https://api.slack.com/apps) and select your app (create one if you don't have one)

Then go to incoming webhooks -> Add new webhook to workspace -> Setup the channel you want ghdid cli to publish the encrypted messages in -> Copy the webhook url

Then run

```
export SLACK_HOOK=<your_webhook_url>
```

You're all set!

### Send encrypted messages over Slack

First lets create two sets of keys, associated with two did documents:
```
$ ghdid addKey my-password from

2019-02-13 13:25:20 [console] info: Created did document for did:ghdid:transmute-industries~github-did~1231cf0fd1851d69fba4371a508d5d96e218a108b1df28bef4b4805572bd7b6b
2019-02-13 13:25:20 [console] info: Keys for tag "from" stored in the wallet are
1231cf0fd1851d69fba4371a508d5d96e218a108b1df28bef4b4805572bd7b6b

```

```
ghdid addKey my-password to

2019-02-13 13:25:30 [console] info: Created did document for did:ghdid:transmute-industries~github-did~f80bdaae3978a1854e997d19cba3bae4363a9a257a80b9cf5e33a364265cc4a7
2019-02-13 13:25:30 [console] info: Keys for tag "to" stored in the wallet are
f80bdaae3978a1854e997d19cba3bae4363a9a257a80b9cf5e33a364265cc4a7

```

Then copy the did from and did to from the stout and run the following command:

```
ghdid sendMessageOnSlack my-password \
  did:ghdid:transmute-industries~github-did~1231cf0fd1851d69fba4371a508d5d96e218a108b1df28bef4b4805572bd7b6b \
  did:ghdid:transmute-industries~github-did~f80bdaae3978a1854e997d19cba3bae4363a9a257a80b9cf5e33a364265cc4a7 \
  Hello this is a super secret message
```

If the Slack integration worked, you should see a message in your Slack channel:

```
{
 "type": "github-did message",
 "didFrom": "did:ghdid:transmute-industries~github-did~1231cf0fd1851d69fba4371a508d5d96e218a108b1df28bef4b4805572bd7b6b",
 "didTo": "did:ghdid:transmute-industries~github-did~f80bdaae3978a1854e997d19cba3bae4363a9a257a80b9cf5e33a364265cc4a7",
 "message": "-----BEGIN PGP MESSAGE-----\r\nVersion: OpenPGP.js v4.4.6\r\nComment: https://openpgpjs.org\r\n\r\nwX4DbMQE5ct/nhkSAgMEddbKKzUa+pwOcqHOs/IPtZ/BLjP1qfvWVIfLHS/u\r\n+k/CidWlc1MLI2VgaEsryiNUNQ5pQVm5zamESxx1w4ELbTCvQ2Zo33yYtdtt\r\n8LjPAg3XqQPTQUKjZyJw/fPguxyrvbdOWdwJlc038V8LX+R2vw3SrAE7Fj07\r\nE22BbuzQhzGBsjCghpK+fE9a2pKQTcpmCV1rnx8VF+6qs2bZILiEP9btZQKU\r\noDov5+7fYw1cob9G50alRJJfRToBEbMVNjvEDAoKqXsBLNj48CrNl5lzzABF\r\nTiswZLMPJgk/7kh62qZfcMrmiDWBRFDsGrk6C4oMs/FtDBoS8w96+R6qXuKl\r\nhp+A/i5+PFT/uWNGd2B0GXFuBQAQKXr+UhjaCTmtIpo=\r\n=t152\r\n-----END PGP MESSAGE-----\r\n"
}
```

The payload is the message we send, encrypted using didTo's public key and signed with didFrom private key.

In order to decrypt it, you should copy the JSON message and paste it into a file:

```
pbpaste > out.json
```

Then you can decrypt it using the didTo's private key by running

```
ghdid decrypt my-password out.json
```
