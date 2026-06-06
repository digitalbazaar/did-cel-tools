/*!
 * Copyright (c) 2024-2026 Digital Bazaar, Inc.
 */

// Re-export start/stop from the didcel library's mock witness server.
// start() spins up an in-process HTTP witness and pushes its URL into
// TEST_WITNESSES.  stop() shuts the server down after the suite finishes.
export {start, stop} from 'didcel/tests/mocha/mock-witness.js';

// TEST_WITNESSES is the shared mutable array that start() populates.
// Because Node.js caches ES module instances, the array that mock-witness.js
// writes into is the same object we read here.
export {TEST_WITNESSES} from 'didcel/tests/mocha/helpers.js';
