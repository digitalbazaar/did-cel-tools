/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {
  existsSync, mkdirSync, readdirSync, readFileSync, rmSync
} from 'node:fs';
import {execFile} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {join} from 'node:path';
import path from 'node:path';
import {promisify} from 'node:util';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const TESTS_DIR = path.resolve(__dirname, '..');
export const ROOT_DIR = path.resolve(TESTS_DIR, '..');
export const TMP_DIR = join(TESTS_DIR, 'tmp');
// config.yaml is written dynamically by 00-setup.js with the mock witness URL
export const CONFIG_PATH = join(TMP_DIR, 'config.yaml');
export const DIDCEL_PATH = join(ROOT_DIR, 'didcel');

export const TEST_PASSWORD = 'test-password-for-automated-tests';

export function clearTmpDir() {
  if(existsSync(TMP_DIR)) {
    for(const entry of readdirSync(TMP_DIR)) {
      rmSync(join(TMP_DIR, entry), {recursive: true, force: true});
    }
  }
  mkdirSync(join(TMP_DIR, 'logs'), {recursive: true});
  mkdirSync(join(TMP_DIR, 'secrets'), {recursive: true});
}

/**
 * Reads and decompresses a gzipped CEL file from the test tmp/logs directory.
 *
 * @param {string} filename - The filename within tmp/logs to read.
 * @returns {object} The parsed CEL object.
 */
export function readCelFile(filename) {
  return JSON.parse(
    gunzipSync(
      readFileSync(join(TMP_DIR, 'logs', filename))).toString('utf8'));
}

/**
 * Runs the didcel CLI with the given commands and returns stdout/stderr.
 *
 * @param {object} options - Options.
 * @param {Array<string>} options.commands - Commands to pass via -c flags.
 * @param {string} [options.password] - Encryption password (-p flag).
 * @param {number} [options.timeout] - Timeout in ms (default 120000).
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 *   The output of the command.
 */
export async function runDidcel({
  commands,
  password = TEST_PASSWORD,
  timeout = 120000
} = {}) {
  const args = ['-g', CONFIG_PATH, '-p', password];
  for(const cmd of commands) {
    args.push('-c', cmd);
  }

  try {
    const {stdout, stderr} = await execFileAsync(
      DIDCEL_PATH, args,
      {cwd: ROOT_DIR, timeout}
    );
    return {stdout, stderr, exitCode: 0};
  } catch(err) {
    return {
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? '',
      exitCode: err.code ?? 1,
      error: err
    };
  }
}

/**
 * Runs the didcel CLI with the given commands and returns the result along
 * with the new .cel.gz file that was created during the run.
 *
 * @param {object} options - Options.
 * @param {Array<string>} options.commands - Commands to pass via -c flags.
 * @param {string} [options.password] - Encryption password (-p flag).
 * @returns {Promise<object>} Result from runDidcel extended with {newFile}.
 */
export async function runAndCapture({commands, password}) {
  const before = listCelFiles();
  const result = await runDidcel({commands, password});
  const after = listCelFiles();
  const newFile = after.find(f => !before.includes(f));
  return {...result, newFile};
}

/**
 * Lists .cel.gz files in the test tmp/logs directory.
 *
 * @returns {Array<string>} Array of filenames.
 */
export function listCelFiles() {
  const logsDir = join(TMP_DIR, 'logs');
  if(!existsSync(logsDir)) {
    return [];
  }
  return readdirSync(logsDir).filter(f => f.endsWith('.cel.gz'));
}

/**
 * Lists .yaml files in the test tmp/secrets directory.
 *
 * @returns {Array<string>} Array of filenames.
 */
export function listSecretFiles() {
  const secretsDir = join(TMP_DIR, 'secrets');
  if(!existsSync(secretsDir)) {
    return [];
  }
  return readdirSync(secretsDir).filter(f => f.endsWith('.yaml'));
}
