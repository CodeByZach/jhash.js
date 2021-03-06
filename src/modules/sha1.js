/*!
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */


/*
 * These are the functions you'll usually want to call.
 * They take string arguments and return either hex or base-64 encoded strings.
 */
function hex_sha1(s)            { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)            { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e)         { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)    { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)    { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e) { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }


/*
 * Perform a simple self-test to see if the VM is working.
 */
function sha1_vm_test() {
	return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}


/*
 * Calculate the SHA1 of a raw string.
 */
function rstr_sha1(s) {
	return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}


/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings).
 */
function rstr_hmac_sha1(key, data) {
	var bkey = rstr2binb(key);
	if (bkey.length > 16) {
		bkey = binb_sha1(bkey, key.length * 8);
	}

	var ipad = Array(16), opad = Array(16);
	for (var i = 0; i < 16; i++) {
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5C5C5C5C;
	}

	var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
	return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}


/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length.
 */
function binb_sha1(x, len) {
	// Append padding
	x[len >> 5] |= 0x80 << (24 - len % 32);
	x[((len + 64 >> 9) << 4) + 15] = len;

	var w = Array(80);
	var a =  1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d =  271733878;
	var e = -1009589776;

	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
		var olde = e;

		for (var j = 0; j < 80; j++) {
			if (j < 16) {
				w[j] = x[i + j];
			} else {
				w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
			}
			var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
			e = d;
			d = c;
			c = bit_rol(b, 30);
			b = a;
			a = t;
		}

		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
		e = safe_add(e, olde);
	}
	return Array(a, b, c, d, e);

}


/*
 * Perform the appropriate triplet combination function for the current iteration.
 */
function sha1_ft(t, b, c, d) {
	if (t < 20) { return (b & c) | ((~b) & d); }
	if (t < 40) { return b ^ c ^ d; }
	if (t < 60) { return (b & c) | (b & d) | (c & d); }
	return b ^ c ^ d;
}


/*
 * Determine the appropriate additive constant for the current iteration.
 */
function sha1_kt(t) {
	return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}