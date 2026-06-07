/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {
  listCelFiles, listSecretFiles, readCelFile, runAndCapture, runDidcel
} from './helpers.js';
import chai from 'chai';

const {expect} = chai;

describe('witness', function() {
  this.timeout(60000);

  it('should create, witness, and save a DID', async () => {
    const before = listCelFiles().length;
    const secretsBefore = listSecretFiles().length;

    const {stdout, stderr, exitCode} = await runDidcel({
      commands: ['create', 'witness', 'save', 'quit']
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('create successful: did:cel:');
    expect(stdout).to.include('witness: proofs complete');

    expect(listCelFiles()).to.have.length(before + 1);
    expect(listSecretFiles()).to.have.length(secretsBefore + 1);
  });

  it('should produce a CEL with a witness proof on the create event',
    async () => {
      const {exitCode, stderr, newFile} = await runAndCapture({
        commands: ['create', 'witness', 'save', 'quit']
      });

      expect(exitCode, `stderr: ${stderr}`).to.equal(0);

      const celContent = readCelFile(newFile);

      expect(celContent).to.have.property('log');
      expect(celContent.log).to.have.length(1);

      const createEntry = celContent.log[0];
      expect(createEntry).to.have.property('proof');
      expect(createEntry.proof).to.be.an('array');
      expect(createEntry.proof.length).to.be.at.least(1);

      const proof = createEntry.proof[0];
      expect(proof).to.have.property('type', 'DataIntegrityProof');
      expect(proof).to.have.property('verificationMethod');
    });

  it('should have witness proof with a real verificationMethod', async () => {
    const {exitCode, stderr, newFile} = await runAndCapture({
      commands: ['create', 'witness', 'save', 'quit']
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = readCelFile(newFile);

    const proof = celContent.log[0].proof[0];
    // verificationMethod should reference a real did:key (not a placeholder)
    expect(proof.verificationMethod).to.match(/^did:key:/);
  });
});
