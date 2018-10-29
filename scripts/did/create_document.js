#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

const { didMethod } = require("../../src/utils");

const gpgPubKeyPath = path.resolve(process.cwd(), process.argv[2]);
const gpgPubKey = fs
  .readFileSync(gpgPubKeyPath)
  .toString()
  .trim();

const sshPubKeyPath = path.resolve(process.cwd(), process.argv[3]);
const sshPubKey = fs
  .readFileSync(sshPubKeyPath)
  .toString()
  .trim();

const gpgFingerprintPath = path.resolve(process.cwd(), process.argv[4]);
const gpgFingerprint = fs.readFileSync(gpgFingerprintPath);

const formattedGPGFingerprint = gpgFingerprint
  .toString()
  .split("\n")[1]
  .trim()
  .replace(/\s/g, "");

// console.log(formattedGPGFingerprint);
const did = `did:${didMethod}:${formattedGPGFingerprint}`;

const didDocument = `
{
    "@context": "https://w3id.org/did/v1",
    "id": "${did}",
    "publicKey": [
        {
            "id": "${did}#keys-1",
            "type": "RsaVerificationKey2018",
            "owner": "${did}",
            "publicKeyPem": ${JSON.stringify(gpgPubKey)}
        },
        {
            "id": "${did}#keys-2",
            "type": "RsaVerificationKey2018",
            "owner": "${did}",
            "publicKeyPem": "${sshPubKey}"
        }
    ],
    "authentication": [
        {
            "type": "RsaSignatureAuthentication2018",
            "publicKey": "${did}#keys-1"
        },
        {
            "type": "RsaSignatureAuthentication2018",
            "publicKey": "${did}#keys-2"
        }
    ]
  }
`;

const didDocumentPath = path.resolve(
  process.cwd(),
  `./dids/${did}/didDocument.json`
);

fs.outputFileSync(didDocumentPath, didDocument);

console.log(`🔏  Created: ${did}`);
