/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {
  listCelFiles, listSecretFiles, runDidcel, TMP_DIR
} from './helpers.js';
import chai from 'chai';
import {gunzipSync} from 'node:zlib';
import {join} from 'node:path';
import {readFileSync} from 'node:fs';

const {expect} = chai;

function readCel(filename) {
  return JSON.parse(
    gunzipSync(readFileSync(join(TMP_DIR, 'logs', filename))).toString('utf8'));
}

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
      const before = listCelFiles();

      const {stderr, exitCode} = await runDidcel({
        commands: ['create', 'witness', 'save', 'quit']
      });

      expect(exitCode, `stderr: ${stderr}`).to.equal(0);

      const after = listCelFiles();
      const newFile = after.find(f => !before.includes(f));
      const celContent = readCel(newFile);

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
    const before = listCelFiles();

    const {exitCode, stderr} = await runDidcel({
      commands: ['create', 'witness', 'save', 'quit']
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const after = listCelFiles();
    const newFile = after.find(f => !before.includes(f));
    const celContent = readCel(newFile);

    const proof = celContent.log[0].proof[0];
    // verificationMethod should reference a real did:key (not a placeholder)
    expect(proof.verificationMethod).to.match(/^did:key:/);
  });
});
