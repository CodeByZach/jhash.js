JHash.js
====
[![Latest Release](https://img.shields.io/github/v/tag/CodeByZach/jhash.js?label=release&sort=semver)](https://github.com/CodeByZach/jhash.js/releases/latest) [![Stars](https://img.shields.io/github/stars/CodeByZach/jhash.js.svg)](https://github.com/CodeByZach/jhash.js/stargazers) [![Forks](https://img.shields.io/github/forks/CodeByZach/jhash.js.svg)](https://github.com/CodeByZach/jhash.js/network/members) [![License](https://img.shields.io/github/license/CodeByZach/jhash.js.svg)](LICENSE)

A JavaScript hash generator.

* MD5
* SHA-1
* SHA-256
* SHA-512
* RIPEMD-160

Each one also has an HMAC version.

> **Security note:** MD5 and SHA-1 are no longer secure: practical collision attacks exist. Don't use them for
> passwords, signatures or anything an attacker could exploit. They're still fine for checksums and cache keys.
> For passwords, use a password-hashing function such as Argon2 or bcrypt on the server. In browsers, the
> built-in [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) also
> computes SHA-1, SHA-256 and SHA-512, asynchronously.


Common Usage
-------

```html
<script src="https://cdn.jsdelivr.net/npm/jhash.js@3/jhash.min.js"></script>
<script>
    var md5 = JHash.hex_md5("string");
    var md5_hmac = JHash.hex_hmac_md5("key", "data");

    var sha1_hash = JHash.hex_sha1("string");
    var sha1_hmac = JHash.hex_hmac_sha1("key", "data");

    var sha256_hash = JHash.hex_sha256("string");
    var sha256_hmac = JHash.hex_hmac_sha256("key", "data");

    var sha512_hash = JHash.hex_sha512("string");
    var sha512_hmac = JHash.hex_hmac_sha512("key", "data");

    var rmd160_hash = JHash.hex_rmd160("string");
    var rmd160_hmac = JHash.hex_hmac_rmd160("key", "data");
</script>
```

With npm (`npm install jhash.js`):

```javascript
const JHash = require('jhash.js');
// or: import JHash from 'jhash.js';

const md5 = JHash.hex_md5("string");
```


Other Output Encodings
-------

The scripts support `base64` encoding. Use it like this:

```javascript
var md5 = JHash.b64_md5("string");
var md5_hmac = JHash.b64_hmac_md5("key", "data");

var sha1_hash = JHash.b64_sha1("string");
var sha1_hmac = JHash.b64_hmac_sha1("key", "data");

var sha256_hash = JHash.b64_sha256("string");
var sha256_hmac = JHash.b64_hmac_sha256("key", "data");

var sha512_hash = JHash.b64_sha512("string");
var sha512_hmac = JHash.b64_hmac_sha512("key", "data");

var rmd160_hash = JHash.b64_rmd160("string");
var rmd160_hmac = JHash.b64_hmac_rmd160("key", "data");
```

There is also a mode called "any output encoding". This lets you specify a string of characters, and all those characters will be used to encode the hash. The string can be any length - it does not need to be a power of 2. Use it like this:

```javascript
var encoding = "0123456789abcdefghijklmnopqrstuvwxyz";

var md5 = JHash.any_md5("string", encoding);
var md5_hmac = JHash.any_hmac_md5("key", "data", encoding);

var sha1_hash = JHash.any_sha1("string", encoding);
var sha1_hmac = JHash.any_hmac_sha1("key", "data", encoding);

var sha256_hash = JHash.any_sha256("string", encoding);
var sha256_hmac = JHash.any_hmac_sha256("key", "data", encoding);

var sha512_hash = JHash.any_sha512("string", encoding);
var sha512_hmac = JHash.any_hmac_sha512("key", "data", encoding);

var rmd160_hash = JHash.any_rmd160("string", encoding);
var rmd160_hmac = JHash.any_hmac_rmd160("key", "data", encoding);
```

If the encoding is `0123456789abcdef` the output will be identical to `hex_md5`. It isn't possible to create output that's identical to `base64` encoding.


Advanced Usage
-------

If you want to use more advanced features, such as multiple repetitions of a hash, or `utf-16` encoding, you need to use a slightly lower-level interface to the scripts. These have the concept of a "raw string"; this is a JavaScript string, but all the characters are between 0 and 255 - essentially a binary array. To get a hex hash, using `utf-16` encoding:

```javascript
var hash = JHash.rstr2hex(JHash.rstr_md5(JHash.str2rstr_utf16le("string")));
```

You can also use `JHash.str2rstr_utf16be`. To perform a double hash:

```javascript
var hash = JHash.rstr2hex(JHash.rstr_md5(JHash.rstr_md5(JHash.str2rstr_utf8("string"))));
```

You can use variants of this to produce just about any hash you may need.


Unit Tests
-------

The tests compare every hash, in every output encoding and as an HMAC, with Node's built-in `crypto` module.
With Node.js 26 installed:

```bash
npm ci
npm test
```


Credits
-------

The hash functions are by [Paul Johnston](https://pajhome.org.uk/crypt/md5/) and contributors, combined into
JHash by [Zachary Miller](https://github.com/CodeByZach).
