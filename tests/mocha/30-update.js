/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {
  listCelFiles, runDidcel, TMP_DIR
} from './helpers.js';
import chai from 'chai';
import {join} from 'node:path';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';

const {expect} = chai;

const UPDATE_COMMANDS = [
  'create', 'witness',
  'add authentication ecdsa',
  'update', 'witness',
  'save', 'quit'
];

async function runUpdate() {
  const before = listCelFiles();
  const result = await runDidcel({commands: UPDATE_COMMANDS});
  const after = listCelFiles();
  const newFile = after.find(f => !before.includes(f));
  return {...result, newFile};
}

describe('update', function() {
  this.timeout(120000);

  it('should create, witness, add auth key, update, witness, and save',
    async () => {
      const before = listCelFiles().length;

      const {stdout, stderr, exitCode} = await runDidcel({
        commands: UPDATE_COMMANDS
      });

      expect(exitCode, `stderr: ${stderr}`).to.equal(0);
      expect(stdout).to.include('create successful: did:cel:');
      expect(stdout).to.include(
        'add: new verification method for authentication');
      expect(listCelFiles()).to.have.length(before + 1);
    });

  it('should produce a CEL with 2 events (create + update)', async () => {
    const {exitCode, stderr, newFile} = await runUpdate();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = JSON.parse(
      gunzipSync(readFileSync(join(TMP_DIR, 'logs', newFile))).toString('utf8'));

    expect(celContent).to.have.property('log');
    expect(celContent.log).to.have.length(2);
  });

  it('should hashlink events via previousEventHash', async () => {
    const {exitCode, stderr, newFile} = await runUpdate();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = JSON.parse(
      gunzipSync(readFileSync(join(TMP_DIR, 'logs', newFile))).toString('utf8'));

    const updateEntry = celContent.log[1];
    expect(updateEntry.event).to.have.property('previousEventHash');
    expect(updateEntry.event.previousEventHash).to.be.a('string');
    expect(updateEntry.event.previousEventHash).to.match(/^z/);
  });

  it('should include the new authentication key in the update event',
    async () => {
      const {exitCode, stderr, newFile} = await runUpdate();

      expect(exitCode, `stderr: ${stderr}`).to.equal(0);

      const celContent = JSON.parse(
        gunzipSync(readFileSync(join(TMP_DIR, 'logs', newFile))).toString('utf8'));

      const updateEntry = celContent.log[1];
      const didDoc = updateEntry.event.operation.data;
      expect(didDoc).to.have.property('authentication');
      expect(didDoc.authentication).to.be.an('array');
      expect(didDoc.authentication.length).to.be.at.least(1);
    });

  it('should witness proofs on both events', async () => {
    const {exitCode, stderr, newFile} = await runUpdate();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = JSON.parse(
      gunzipSync(readFileSync(join(TMP_DIR, 'logs', newFile))).toString('utf8'));

    for(const entry of celContent.log) {
      expect(entry).to.have.property('proof');
      expect(entry.proof).to.be.an('array');
      expect(entry.proof.length).to.be.at.least(1);
    }
  });
});
