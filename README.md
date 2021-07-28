jhash
====

A JavaScript hash generator.

* MD4
* MD5
* SHA-1


Loading the libraries
-------

First [download the bundle](https://github.com/CodeByZach/hash.js/releases/tag/2.1.0). Copy the .js file into the same directory as your html file, and insert a tag like:

```html
<script type="text/javascript" src="md5.js"></script>
```

The scripts don't interfere with each other - you can use them all in the same document.

Alternatively, you can copy the code and paste it straight into your html file, inside a script tag. I tend to keep the code separate, but including it will load faster.


Calculating a hash
-------

Usually you'll want to get the result in hexadecimal, so it can be submitted as part of a form without worrying about URL encoding.

```html
<script type="text/javascript">
    var hash = hex_md5("input string");
</script>
```

Note that the input must be a string - `hex_md5(Math.random())` will not function correctly; you must do `hex_md5(Math.random().toString())`.

You can also get the result in base-64 encoding:

```html
<script type="text/javascript">
    var hash = b64_md5("input string");
</script>
```

You can also get the result as a binary string; this is discussed below.


HMAC - keyed hashes
-------

In many uses of hashes you end up wanting to combine a key with some data. It isn't so bad to do this by simple concatenation, but HMAC is specifically designed for this use. The usage is:

```html
<script type="text/javascript">
    var hash = hex_hmac_md5("key", "data");
</script>
```

The HMAC result is also available base-64 encoded or as a binary string, using `b64_hmac_*` or `str_hmac_*`.

Some other hash libraries have the arguments the other way round. If the JavaScript HMAC doesn't match the value your server library generates, try swapping the order.


Configurable options
-------

There are a few configurable variables; you may have to tweak these to be compatible with the hash function on the server.

| Variable    | Description                                                       | Options                                                       |
| ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| **hexcase** | The case of the letters A-F in hexadecimal output                 | 0 - lower case (default)<br/>1 - upper case                   |
| **b64pad**  | The character used to pad base-64 output to a multiple of 3 bytes | "" - no padding (default)<br/>"=" - for strict RFC compliance |
| **chrsz**   | Whether string input should be treated as ASCII or Unicode.       | 8 - ASCII (default)<br/>16 - Unicode                          |

The Unicode support uses utf-16 encoding, which is rarely what people want. Version 2.2 has better Unicode support, with utf-8 encoding.

To set a variable, use a syntax like this:

```html
<script type="text/javascript" src="md5.js"></script>
<script type="text/javascript">
    var chrsz = 16;
</script>
```

In general, it's ok to change the values of these variables between calls to the library; for example you can do ASCII and Unicode hashes on the same page. However, you can't change `chrsz` and then re-use data returned by a `str_*` function.


Binary string output
-------

This representation is useful when you want to feed the result of a hash operation back into another operation. The ability to do this lets you create a variety of cryptographic protocols.

For example, to do a double hash:

```javascript
var double_hash = hex_md5(str_md5(data));
```

The string is encoded so each character of a string represents either one or two bytes, in ASCII and Unicode respectively. This would be troublesome to send over HTTP as form data, but JavaScript strings are completely binary safe.