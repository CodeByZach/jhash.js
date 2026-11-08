// Checks every hash, in every output encoding and as an HMAC, against Node's
// own crypto module. Runs against jhash.js and jhash.min.js.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { describe, test } from 'node:test';

const require = createRequire(import.meta.url);

// JHash name -> Node crypto name.
const ALGORITHMS = { md5: 'md5', sha1: 'sha1', sha256: 'sha256', sha512: 'sha512', rmd160: 'ripemd160' };

const INPUTS = [
  '',
  'hello',
  'world',
  'fredሴ', // non-ASCII, hashed as UTF-8
  'this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm',
  'x'.repeat(1000),
];

const HEX = '0123456789abcdef';

// jhash's base64 has no "=" padding by default (b64pad = "").
const base64 = (buffer) => buffer.toString('base64').replace(/=+$/, '');

for (const file of ['jhash.js', 'jhash.min.js']) {
  const JHash = require(`../${file}`);

  describe(file, () => {
    for (const [name, nodeName] of Object.entries(ALGORITHMS)) {
      test(name, () => {
        for (const input of INPUTS) {
          const digest = crypto.createHash(nodeName).update(input, 'utf8').digest();
          const hmac = crypto.createHmac(nodeName, 'key').update(input, 'utf8').digest();
          assert.equal(JHash[`hex_${name}`](input), digest.toString('hex'), `hex_${name}(${JSON.stringify(input)})`);
          assert.equal(JHash[`b64_${name}`](input), base64(digest), `b64_${name}(${JSON.stringify(input)})`);
          assert.equal(JHash[`any_${name}`](input, HEX), digest.toString('hex'), `any_${name}`);
          assert.equal(JHash[`hex_hmac_${name}`]('key', input), hmac.toString('hex'), `hex_hmac_${name}`);
          assert.equal(JHash[`b64_hmac_${name}`]('key', input), base64(hmac), `b64_hmac_${name}`);
        }
      });
    }
  });
}

test('import works too', async () => {
  const { default: JHash } = await import('../jhash.js');
  assert.equal(JHash.hex_md5('hello'), crypto.createHash('md5').update('hello').digest('hex'));
});
