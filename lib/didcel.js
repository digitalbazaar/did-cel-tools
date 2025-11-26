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

export async function create({options}) {
  const keyPair =
    await EcdsaMultikey.generate({curve: options?.curve || 'P-256'});
  const publicKey =
    await keyPair.export({publicKey: true, includeContext: false});
  publicKey.id = '#' + publicKey.publicKeyMultibase;

  // update document loader
  jdl.addStatic(publicKey.id, publicKey);

  let didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1.1',
    assertionMethod: [publicKey]
  }

  // generate the did:cel identifier
  const utf8Encoder = new TextEncoder();
  const canonicalizedDidDocument = canonicalize(didDocument);
  const sha3256Hasher = mfHasher.from({
    name: 'sha3-256',
    code: 0x16,
    encode: input => sha3_256(input),
  });
  const mfHash = await sha3256Hasher.digest(
    utf8Encoder.encode(canonicalizedDidDocument)).bytes;
  const encodedHash = base58btc.encode(mfHash);
  const controller = 'did:cel:' + encodedHash;
  didDocument.id = controller;
  publicKey.controller = controller;

  // place a proof on the DID Document
  const ecdsaJcs2019Cryptosuite = createSignCryptosuite();
  const suite = new DataIntegrityProof({
    signer: keyPair.signer(), cryptosuite: ecdsaJcs2019Cryptosuite
  });

  // create signed credential
  let documentLoader = jdl.build();
  const signedDidDocument = await jsigs.sign(didDocument, {
    suite,
    purpose: new AssertionProofPurpose(),
    documentLoader
  });
  // TODO: Determine if there is a better way to set the proof VM
  signedDidDocument.proof.verificationMethod = controller + publicKey.id;

  // rewrite DID Document to place the `id` at the top of the document
  didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1.1',
    id: controller,
    assertionMethod: [publicKey],
    proof: signedDidDocument.proof
  }

  return {keyPair, didDocument};
}

export async function addVm({didDocument, verificationRelationship, curve}) {
  // TODO: replace with modern clone
  const newDidDocument = JSON.parse(JSON.stringify(didDocument));
  const keyPair =
    await EcdsaMultikey.generate({curve: curve || 'P-256'});
  const publicKey =
    await keyPair.export({publicKey: true, includeContext: false});
  publicKey.id = '#' + publicKey.publicKeyMultibase;
  publicKey.controller = didDocument.id;

  // add verification method to DID Document
  if(!Array.isArray(didDocument[verificationRelationship])) {
    newDidDocument[verificationRelationship] = [];
  }
  newDidDocument[verificationRelationship].push(publicKey);

  // remove old proof and place new proof on didDocument
  delete newDidDocument.proof;

  // update document loader
  jdl.addStatic(publicKey.id, publicKey);

  return {keyPair, didDocument: newDidDocument};
}

export async function updateProof({didDocument, assertionMethod}) {
  // TODO: replace with modern clone
  const newDidDocument = JSON.parse(JSON.stringify(didDocument));
  if(newDidDocument.proof) {
    delete newDidDocument.proof;
  }

  // create signed DID document
  let documentLoader = jdl.build();
  const ecdsaJcs2019Cryptosuite = createSignCryptosuite();
  const suite = new DataIntegrityProof({
    signer: assertionMethod.signer(), cryptosuite: ecdsaJcs2019Cryptosuite
  });
  const signedDidDocument = await jsigs.sign(newDidDocument, {
    suite,
    purpose: new AssertionProofPurpose(),
    documentLoader
  });

  // TODO: determine if there is a better way to set verificationMethod
  newDidDocument.proof.verificationMethod = newDidDocument.id + '#' +
    assertionMethod.publicKeyMultibase;

  return {didDocument: newDidDocument};
}

export default {create, addVm, updateProof};
