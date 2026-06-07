/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {
  listCelFiles, runDidcel, TMP_DIR
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

const DEACTIVATE_COMMANDS = [
  'create', 'witness',
  'add authentication ecdsa', 'update', 'witness',
  'deactivate', 'witness',
  'save', 'quit'
];

async function runDeactivate() {
  const before = listCelFiles();
  const result = await runDidcel({commands: DEACTIVATE_COMMANDS});
  const after = listCelFiles();
  const newFile = after.find(f => !before.includes(f));
  return {...result, newFile};
}

describe('deactivate', function() {
  this.timeout(120000);

  it('should create, witness, add key, update, witness, deactivate, witness, ' +
    'and save', async () => {
    const before = listCelFiles().length;

    const {stdout, stderr, exitCode} = await runDidcel({
      commands: DEACTIVATE_COMMANDS
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('create successful: did:cel:');
    expect(stdout).to.include('deactivation: complete');
    expect(listCelFiles()).to.have.length(before + 1);
  });

  it('should produce a CEL with 3 events (create + update + deactivate)',
    async () => {
      const {exitCode, stderr, newFile} = await runDeactivate();

      expect(exitCode, `stderr: ${stderr}`).to.equal(0);

      const celContent = readCel(newFile);

      expect(celContent).to.have.property('log');
      expect(celContent.log).to.have.length(3);
    });

  it('should have deactivate event with correct operation type', async () => {
    const {exitCode, stderr, newFile} = await runDeactivate();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = readCel(newFile);

    const deactivateEntry = celContent.log[2];
    expect(deactivateEntry.event.operation).to.have.property(
      'type', 'deactivate');
    expect(deactivateEntry.event.operation.data).to.be.undefined;
  });

  it('should hash-link all events in the chain', async () => {
    const {exitCode, stderr, newFile} = await runDeactivate();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = readCel(newFile);

    for(let i = 1; i < celContent.log.length; i++) {
      const entry = celContent.log[i];
      expect(entry.event).to.have.property('previousEventHash');
      expect(entry.event.previousEventHash).to.match(/^z/);
    }
  });

  it('should have witness proofs on all events', async () => {
    const {exitCode, stderr, newFile} = await runDeactivate();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = readCel(newFile);

    for(const entry of celContent.log) {
      expect(entry).to.have.property('proof');
      expect(entry.proof).to.be.an('array');
      expect(entry.proof.length).to.be.at.least(1);
    }
  });
});
