/**
 * @file Encrypted private key storage.
 * Saves and loads private keys to ~/.config/didcel/secrets/<ID>.yaml.
 * Each secretKeyMultibase is encrypted with AES-256-GCM, with the encryption
 * key derived from a user-supplied password via scrypt.
 */

import {mkdirSync, writeFileSync} from 'node:fs';
import {config} from './config.js';
import crypto from 'node:crypto';
import {join} from 'node:path';
import yaml from 'js-yaml';

// scrypt parameters: N=2^14, r=8, p=1
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;

/**
 * Encrypts and saves all secret key pairs to the secrets file for a DID.
 *
 * @param {object} options - Configuration options.
 * @param {string} options.didIdentifier - Method-specific ID (part after
 *   did:cel:).
 * @param {object} options.secretKeys - Session secretKeys object keyed by
 *   verification relationship, each an array of keyPair objects.
 * @param {string} options.password - Password used to encrypt each secret key.
 */
export async function saveSecrets({didIdentifier, secretKeys, password}) {
  const keys = [];
  for(const [relationship, keyPairs] of Object.entries(secretKeys)) {
    for(const keyPair of keyPairs) {
      const exported = await keyPair.export(
        {publicKey: true, secretKey: true, includeContext: true});
      const {secretKeyMultibase, ...publicFields} = exported;
      if(!secretKeyMultibase) {
        continue;
      }
      const encryptedSecretKeyMultibase =
        await _encrypt(secretKeyMultibase, password);
      keys.push({...publicFields, relationship, encryptedSecretKeyMultibase});
    }
  }

  mkdirSync(config.secrets, {recursive: true});
  writeFileSync(_secretsPath(didIdentifier), yaml.dump({keys}));
}

function _secretsPath(didIdentifier) {
  return join(config.secrets, `${didIdentifier}.yaml`);
}

function _deriveKey(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LEN,
      {N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P},
      (err, key) => err ? reject(err) : resolve(key));
  });
}

async function _encrypt(plaintext, password) {
  const salt = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  const key = await _deriveKey(password, salt);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat(
    [cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // pack: salt(32) || iv(12) || tag(16) || ciphertext, encode as base64
  return Buffer.concat([salt, iv, tag, enc]).toString('base64');
}

