/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {
  readCelFile, runAndCapture, runDidcel, TMP_DIR
} from './helpers.js';
import chai from 'chai';
import {gzipSync} from 'node:zlib';
import {join} from 'node:path';
import {writeFileSync} from 'node:fs';

const {expect} = chai;

async function createAndLoad({commands}) {
  const {newFile} = await runAndCapture({commands});
  const filename = join(TMP_DIR, 'logs', newFile);
  return runDidcel({commands: [`load ${filename}`, 'quit']});
}

describe('load', function() {
  this.timeout(120000);

  it('should load and validate a create-only CEL', async () => {
    const {stdout, stderr, exitCode} = await createAndLoad({
      commands: ['create', 'save', 'quit']
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('load: valid CEL with 1 event(s): did:cel:');
  });

  it('should load and validate a witnessed CEL', async () => {
    const {stdout, stderr, exitCode} = await createAndLoad({
      commands: ['create', 'witness', 'save', 'quit']
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('load: valid CEL with 1 event(s): did:cel:');
  });

  it('should load and validate a CEL with an update', async () => {
    const {stdout, stderr, exitCode} = await createAndLoad({
      commands: [
        'create', 'witness',
        'add authentication ecdsa', 'update', 'witness',
        'save', 'quit'
      ]
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('load: valid CEL with 2 event(s): did:cel:');
  });

  it('should load and validate a CEL with a heartbeat', async () => {
    const {stdout, stderr, exitCode} = await createAndLoad({
      commands: ['create', 'witness', 'heartbeat', 'witness', 'save', 'quit']
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('load: valid CEL with 2 event(s): did:cel:');
  });

  it('should load and validate a deactivated CEL', async () => {
    const {stdout, stderr, exitCode} = await createAndLoad({
      commands: [
        'create', 'witness',
        'add authentication ecdsa', 'update', 'witness',
        'deactivate', 'witness',
        'save', 'quit'
      ]
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('load: valid CEL with 3 event(s): did:cel:');
  });

  it('should error on a CEL with a tampered hash chain', async () => {
    const {newFile} = await runAndCapture({
      commands: ['create', 'witness', 'heartbeat', 'witness', 'save', 'quit']
    });
    const filename = join(TMP_DIR, 'logs', newFile);

    // tamper with the previousEventHash in entry 1
    const cel = readCelFile(newFile);
    cel.log[1].event.previousEventHash = 'zTAMPEREDHASH';
    writeFileSync(filename,
      gzipSync(Buffer.from(JSON.stringify(cel), 'utf8')));

    const {stdout, exitCode} = await runDidcel({
      commands: [`load ${filename}`, 'quit']
    });

    expect(exitCode).to.equal(0);
    expect(stdout).to.include('error: entry 1: previousEventHash mismatch');
  });
});
