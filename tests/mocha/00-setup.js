/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */
import {clearTmpDir, CONFIG_PATH, TMP_DIR} from './helpers.js';
import {start, stop, TEST_WITNESSES} from './mock-witness.js';
import {join} from 'node:path';
import {writeFileSync} from 'node:fs';
import yaml from 'js-yaml';

before(async () => {
  clearTmpDir();
  await start();
  // write a config.yaml into the tmp dir with the mock witness URL and
  // absolute paths to the tmp logs/secrets dirs so the CLI subprocess can
  // find them regardless of its working directory
  const config = {
    witnesses: TEST_WITNESSES.slice(),
    logs: join(TMP_DIR, 'logs'),
    secrets: join(TMP_DIR, 'secrets')
  };
  writeFileSync(CONFIG_PATH, yaml.dump(config));
});

after(() => stop());
