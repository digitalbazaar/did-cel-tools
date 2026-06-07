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

const HB_COMMANDS = [
  'create', 'witness', 'heartbeat', 'witness', 'save', 'quit'
];

async function runHeartbeat() {
  const before = listCelFiles();
  const result = await runDidcel({commands: HB_COMMANDS});
  const after = listCelFiles();
  const newFile = after.find(f => !before.includes(f));
  return {...result, newFile};
}

describe('heartbeat', function() {
  this.timeout(120000);

  it('should create, witness, heartbeat, witness, and save', async () => {
    const before = listCelFiles().length;

    const {stdout, stderr, exitCode} = await runDidcel({commands: HB_COMMANDS});

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('create successful: did:cel:');
    expect(stdout).to.include('heartbeat: generated');
    expect(listCelFiles()).to.have.length(before + 1);
  });

  it('should produce a CEL with 2 events (create + heartbeat)', async () => {
    const {exitCode, stderr, newFile} = await runHeartbeat();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = readCel(newFile);

    expect(celContent).to.have.property('log');
    expect(celContent.log).to.have.length(2);
  });

  it('should have heartbeat event with correct operation type', async () => {
    const {exitCode, stderr, newFile} = await runHeartbeat();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = readCel(newFile);

    const heartbeatEntry = celContent.log[1];
    expect(heartbeatEntry.event.operation).to.have.property(
      'type', 'heartbeat');
    expect(heartbeatEntry.event.operation.data).to.be.undefined;
  });

  it('should hash-link heartbeat event to the witnessed create event',
    async () => {
      const {exitCode, stderr, newFile} = await runHeartbeat();

      expect(exitCode, `stderr: ${stderr}`).to.equal(0);

      const celContent = readCel(newFile);

      const heartbeatEntry = celContent.log[1];
      expect(heartbeatEntry.event).to.have.property('previousEventHash');
      expect(heartbeatEntry.event.previousEventHash).to.match(/^z/);
    });

  it('should witness the heartbeat event', async () => {
    const {exitCode, stderr, newFile} = await runHeartbeat();

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);

    const celContent = readCel(newFile);

    const heartbeatEntry = celContent.log[1];
    expect(heartbeatEntry).to.have.property('proof');
    expect(heartbeatEntry.proof).to.be.an('array');
    expect(heartbeatEntry.proof.length).to.be.at.least(1);
  });
});
