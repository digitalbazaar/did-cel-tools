/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {
  listCelFiles, listSecretFiles, runDidcel
} from './helpers.js';
import chai from 'chai';

const {expect} = chai;

describe('create', function() {
  this.timeout(30000);

  it('should create a new DID document and save', async () => {
    const {stdout, stderr, exitCode} = await runDidcel({
      commands: ['create', 'save', 'quit']
    });

    expect(exitCode, `stderr: ${stderr}`).to.equal(0);
    expect(stdout).to.include('create successful: did:cel:');

    const celFiles = listCelFiles();
    expect(celFiles).to.have.length(1);

    const secretFiles = listSecretFiles();
    expect(secretFiles).to.have.length(1);
  });

  it('should create multiple DIDs independently', async () => {
    const before = listCelFiles().length;

    const result1 = await runDidcel({commands: ['create', 'save', 'quit']});
    expect(result1.exitCode, `stderr: ${result1.stderr}`).to.equal(0);
    expect(result1.stdout).to.include('create successful: did:cel:');

    const result2 = await runDidcel({commands: ['create', 'save', 'quit']});
    expect(result2.exitCode, `stderr: ${result2.stderr}`).to.equal(0);
    expect(result2.stdout).to.include('create successful: did:cel:');

    const celFiles = listCelFiles();
    expect(celFiles).to.have.length(before + 2);
  });
});
