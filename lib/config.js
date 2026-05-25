/**
 * @fileoverview Configuration loader.
 * Reads config.yaml from ~/.config/didcel/.
 */

import {existsSync, readFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
import yaml from 'js-yaml';

const configPath = join(homedir(), '.config', 'didcel', 'config.yaml');

if(!existsSync(configPath)) {
  throw new Error(`Configuration file not found: ${configPath}`);
}

const raw = yaml.load(readFileSync(configPath, 'utf8')) ?? {};

// resolve leading ~/ in path values to the user's home directory
function _resolvePath(value) {
  if(typeof value === 'string' && value.startsWith('~/')) {
    return join(homedir(), value.slice(2));
  }
  return value;
}

export const config = {
  ...raw,
  logs: _resolvePath(raw.logs),
  secrets: _resolvePath(raw.secrets)
};
