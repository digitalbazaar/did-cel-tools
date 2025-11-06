import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {JsonLdDocumentLoader} from 'jsonld-document-loader';
import {base58btc} from 'multiformats/bases/base58';
import canonicalize from 'canonicalize';
import {createSignCryptosuite} from '@digitalbazaar/ecdsa-jcs-2019-cryptosuite';
import jsigs from 'jsonld-signatures';
import * as mfHasher from 'multiformats/hashes/hasher';
import {sha3_256} from '@noble/hashes/sha3.js';
import * as witnessService from './witness.js';

const {purposes: {AssertionProofPurpose}} = jsigs;
const jdl = new JsonLdDocumentLoader();

let witnesses = [
  "did:web:red-witness.example",
  "did:web:green-witness.example",
  "did:web:blue-witness.example"
];

export function create({data, options}) {
  let log = {
    log: [{
      event: {
        operation: {
          type: 'create',
          data
        }
      }
    }]
  };

  // set a previous log if there is one
  if(options?.previousLog) {
    log.previousLog = options.previousLog;
  }

  return log;
}

export async function witness({cel, options}) {
  const proofs = [];
  const event = cel.log[cel.log.length-1];

  // 1. If a previous event exists:
  if(cel.log.length > 1) {
    // 1.1. Get the previous event
    // 1.2. Calculate hash of previous event
    // 1.3. Include the previous event hash in the current event
    let previousEvent = 'TODO';
  }

  // 2. For each witness:
  // 2.1. Create a proof for the current event
  for(let witness of witnesses) {
    const proof = await witnessService.generateProof(
      {data: event, options: {witness}});
    proofs.push(proof);
  }

  return proofs;
}

export function update({cel, data, options}) {
  // TODO: Calculate hash of previous event
  let previousEvent = 'TODO';

  // push event to end of log
  cel.log.push({
    event: {
      previousEvent,
      operation: {
        type: 'update',
        data
      }
    }
  });

  return log;
}

export default {create, update, witness};
