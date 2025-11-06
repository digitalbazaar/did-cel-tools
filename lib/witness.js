import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {JsonLdDocumentLoader} from 'jsonld-document-loader';
import {base58btc} from 'multiformats/bases/base58';
import canonicalize from 'canonicalize';
import {createSignCryptosuite} from '@digitalbazaar/ecdsa-jcs-2019-cryptosuite';
import jsigs from 'jsonld-signatures';
import * as mfHasher from 'multiformats/hashes/hasher';
import {sha3_256} from '@noble/hashes/sha3.js';

const {purposes: {AssertionProofPurpose}} = jsigs;
const jdl = new JsonLdDocumentLoader();

// TODO: move to separate service -- generate all of the witness keys
const secretKeys = [{
  "@context": "https://w3id.org/security/multikey/v1",
  "id": "did:web:red-witness.example#vm-red-1",
  "type": "Multikey",
  "controller": "did:web:red-witness.example",
  "publicKeyMultibase": "zDnaeRQKUJYxFwB1zgHisFGeHXYhgoDkXQ3cgzTJHVPfxtfxY",
  "secretKeyMultibase": "z42twzpeKSKsX7NNH5v4CGREKhmcEKGu5RXXAVQQCqjDMnPg"
}, {
  "@context": "https://w3id.org/security/multikey/v1",
  "id": "did:web:green-witness.example#vm-green-1",
  "type": "Multikey",
  "controller": "did:web:green-witness.example",
  "publicKeyMultibase": "zDnaecDuyWKVKwfHEZrh6bNtLDK46Y88nGLEEEjqcTbCYwWYW",
  "secretKeyMultibase": "z42tp2TDou6md8m7oq78f52mdYCDdUwSqhuvYEPsdG6cXGHo"
}, {
  "@context": "https://w3id.org/security/multikey/v1",
  "id": "did:web:blue-witness.example#vm-blue-1",
  "type": "Multikey",
  "controller": "did:web:blue-witness.example",
  "publicKeyMultibase": "zDnaeo6TCxLGbQ2G1k4jvzv5keBaaADp8v7vgiYLbi2heCFPF",
  "secretKeyMultibase": "z42ttRq6VGC727Z4F5c8q6zjBvgJ6MTT3t16JoJEWFzujeSq"
}];
let witnesses = {};
for(let secretKey of secretKeys) {
  const keyPair =
    await EcdsaMultikey.from(secretKey);
  const publicKey =
    await keyPair.export({publicKey: true, includeContext: false});
  const exportedKeyPair =
    await keyPair.export({publicKey: true, secretKey: true});
  console.log('WITNESS KEY:', JSON.stringify(exportedKeyPair, null, 2));

  // update document loader
  witnesses[secretKey.controller] = {secretKey, keyPair};
  jdl.addStatic(publicKey.id, publicKey);
}


export async function generateProof({data, options}) {
  const keyPair = witnesses[options.witness].keyPair;
  const ecdsaJcs2019Cryptosuite = createSignCryptosuite();
  const suite = new DataIntegrityProof({
    signer: keyPair.signer(), cryptosuite: ecdsaJcs2019Cryptosuite
  });

  // create signed credential
  let documentLoader = jdl.build();
  const signedData = await jsigs.sign(data, {
    suite,
    purpose: new AssertionProofPurpose(),
    documentLoader
  });
  console.log("WITNESSED", signedData);

  return signedData.proof;
}

export default {generateProof};
