JHash.js
====
[![Latest Release](https://img.shields.io/github/tag/CodeByZach/jhash.js.svg?label=release)](https://github.com/CodeByZach/jhash.js/releases/latest) [![Stars](https://img.shields.io/github/stars/CodeByZach/jhash.js.svg)](https://github.com/CodeByZach/jhash.js/stargazers) [![Forks](https://img.shields.io/github/forks/CodeByZach/jhash.js.svg)](https://github.com/CodeByZach/jhash.js/network/members) [![License](https://img.shields.io/github/license/CodeByZach/jhash.js.svg)](LICENSE)

A JavaScript hash generator.

* MD5
* SHA-1
* SHA-256
* SHA-512
* RIPEMD-160


Common Usage
-------

```html
<script src="https://cdn.jsdelivr.net/gh/codebyzach/jhash.js@latest/jhash.js"></script>
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

There is also a mode called "any output encoding". This lets you specify a string of characters, and all those characters will be used to encode the password. The string can be any length - it does not need to be a power of 2. This is useful for applications like password generation, when you want to get as much unpredictability as possible into a short password. Use it like this:

```javascript
var md5 = JHash.any_md5("string");
var md5_hmac = JHash.any_hmac_md5("key", "data");

var sha1_hash = JHash.any_sha1("string");
var sha1_hmac = JHash.any_hmac_sha1("key", "data");

var sha256_hash = JHash.any_sha256("string");
var sha256_hmac = JHash.any_hmac_sha256("key", "data");

var sha512_hash = JHash.any_sha512("string");
var sha512_hmac = JHash.any_hmac_sha512("key", "data");

var rmd160_hash = JHash.any_rmd160("string");
var rmd160_hmac = JHash.any_hmac_rmd160("key", "data");
```

If the encoding is `0123456789ABCDEF` the output will be identical to `hex_md5`. It isn't possible to create output that's identical to `base64` encoding.


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

To run the unit tests, you will need Python 2 or newer. The script `test.py` generates an HTML file that runs the tests:

```bash
python test.py > test.html
```

Next, open `test.html` in a browser to run the tests, and see the results.