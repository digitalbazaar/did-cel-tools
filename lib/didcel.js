export function create({options}) {
  let didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1.1',
    id: 'did:cel:zhU7329bdjo83Jw739ndhJSkejJAAp323bWq',
    verificationMethod: [{
      id: '#key-1',
      type: 'Multikey',
      controller: 'did:cel:zhU7329bdjo83Jw739ndhJSkejJAAp323bWq',
      publicKeyMultibase: 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv'
    }],
    authentication: [],
    assertionMethod: ['#key-1'],
    capabilityDelegation: [],
    capabilityInvocation: [],
    proof: {
      type: 'DataIntegrityProof',
      cryptosuite: 'ecdsa-jcs-2019',
      created: '2025-11-29T13:56:28Z',
      verificationMethod: 'did:cel:zhU7329bdjo83Jw739ndhJSkejJAAp323bWq#key-1',
      proofPurpose: 'assertionMethod',
      proofValue: 'z5obCSsrQxuFJdq6PrUMCtqY93gBHqGDBtQLPFxpZxzwVWgHYrXxoV'
    }
  }

  return didDocument;
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

export default {create, update};
