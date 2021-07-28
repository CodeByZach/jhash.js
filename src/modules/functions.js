/*!
 * Functions shared by multiple hashing libraries.
 */

/*
 * Convert a raw string to a hex string.
 */
function rstr2hex(input) {
	try { hexcase } catch(e) { hexcase=0; }
	var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var output  = "";
	var x;
	for (var i = 0; i < input.length; i++) {
		x = input.charCodeAt(i);
		output += hex_tab.charAt((x >>> 4) & 0x0F)
		       +  hex_tab.charAt( x        & 0x0F);
	}
	return output;
}


/*
 * Convert a raw string to a base-64 string.
 */
function rstr2b64(input) {
	try { b64pad } catch(e) { b64pad=''; }
	var tab    = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var output = "";
	var len    = input.length;
	for (var i = 0; i < len; i += 3) {
		var triplet = (input.charCodeAt(i) << 16)
		            | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
		            | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
		for (var j = 0; j < 4; j++) {
			if (i * 8 + j * 6 > input.length * 8) {
				output += b64pad;
			} else {
				output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
			}
		}
	}
	return output;
}


/*
 * Convert a raw string to an arbitrary string encoding.
 */
function rstr2any(input, encoding) {
	var divisor = encoding.length;
	var i, j, q, x, quotient;

	// Convert to an array of 16-bit big-endian values, forming the dividend.
	var dividend = Array(Math.ceil(input.length / 2));
	for (i = 0; i < dividend.length; i++) {
		dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
	}

	/*
	 * Repeatedly perform a long division. The binary array forms the dividend,
	 * the length of the encoding is the divisor. Once computed, the quotient
	 * forms the dividend for the next step. All remainders are stored for later use.
	 */
	var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
	var remainders  = Array(full_length);
	for (j = 0; j < full_length; j++) {
		quotient = Array();
		x        = 0;
		for (i = 0; i < dividend.length; i++) {
			x = (x << 16) + dividend[i];
			q = Math.floor(x / divisor);
			x -= q * divisor;
			if (quotient.length > 0 || q > 0) {
				quotient[quotient.length] = q;
			}
		}
		remainders[j] = x;
		dividend = quotient;
	}

	// Convert the remainders to the output string.
	var output = "";
	for (i = remainders.length - 1; i >= 0; i--) {
		output += encoding.charAt(remainders[i]);
	}

	return output;
}


/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input) {
	var output = "";
	var i = -1;
	var x, y;

	while (++i < input.length) {
		// Decode utf-16 surrogate pairs
		x = input.charCodeAt(i);
		y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
		if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
			x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
			i++;
		}

		// Encode output as utf-8
		if (x <= 0x7F) {
			output += String.fromCharCode(x);
		} else if (x <= 0x7FF) {
			output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
			                              0x80 | ( x         & 0x3F));
		} else if (x <= 0xFFFF) {
			output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
			                              0x80 | ((x >>> 6 ) & 0x3F),
			                              0x80 | ( x         & 0x3F));
		} else if (x <= 0x1FFFFF) {
			output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
			                              0x80 | ((x >>> 12) & 0x3F),
			                              0x80 | ((x >>> 6 ) & 0x3F),
			                              0x80 | ( x         & 0x3F));
		}
	}
	return output;
}


/*
 * Encode a string as utf-16.
 */
function str2rstr_utf16le(input) {
	var output = "";
	for (var i = 0; i < input.length; i++) {
		output += String.fromCharCode(input.charCodeAt(i)        & 0xFF,
		                             (input.charCodeAt(i) >>> 8) & 0xFF);
	}
	return output;
}


function str2rstr_utf16be(input) {
	var output = "";
	for (var i = 0; i < input.length; i++) {
		output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
		                               input.charCodeAt(i)        & 0xFF);
	}
	return output;
}


/*
 * Convert a raw string to an array of little-endian words.
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input) {
	var output = Array(input.length >> 2);
	for (var i = 0; i < output.length; i++) {
		output[i] = 0;
	}
	for (var i = 0; i < input.length * 8; i += 8) {
		output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
	}
	return output;
}


/*
 * Convert an array of little-endian words to a string.
 */
function binl2rstr(input) {
	var output = "";
	for (var i = 0; i < input.length * 32; i += 8) {
		output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
	}
	return output;
}


/*
 * Convert a raw string to an array of big-endian words.
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input) {
	var output = Array(input.length >> 2);
	for (var i = 0; i < output.length; i++) {
		output[i] = 0;
	}
	for (var i = 0; i < input.length * 8; i += 8) {
		output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
	}
	return output;
}


/*
 * Convert an array of big-endian words to a string.
 */
function binb2rstr(input) {
	var output = "";
	for (var i = 0; i < input.length * 32; i += 8) {
		output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
	}
	return output;
}


/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}


/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
	return (num << cnt) | (num >>> (32 - cnt));
}


/*
 * A constructor for 64-bit numbers.
 */
function int64(h, l) {
	this.h = h;
	this.l = l;
	// this.toString = int64toString;
}


/*
 * Copies src into dst, assuming both are 64-bit numbers.
 */
function int64copy(dst, src) {
	dst.h = src.h;
	dst.l = src.l;
}


/*
 * Right-rotates a 64-bit number by shift.
 * Won't handle cases of shift>=32.
 * The function revrrot() is for that.
 */
function int64rrot(dst, x, shift) {
	dst.l = (x.l >>> shift) | (x.h << (32-shift));
	dst.h = (x.h >>> shift) | (x.l << (32-shift));
}


/*
 * Reverses the dwords of the source and then rotates right by shift.
 * This is equivalent to rotation by 32+shift.
 */
function int64revrrot(dst, x, shift) {
	dst.l = (x.h >>> shift) | (x.l << (32-shift));
	dst.h = (x.l >>> shift) | (x.h << (32-shift));
}


/*
 * Bitwise-shifts right a 64-bit number by shift.
 * Won't handle shift>=32, but it's never needed in SHA512.
 */
function int64shr(dst, x, shift) {
	dst.l = (x.l >>> shift) | (x.h << (32-shift));
	dst.h = (x.h >>> shift);
}


/*
 * Adds two 64-bit numbers.
 * Like the original implementation, does not rely on 32-bit operations.
 */
function int64add(dst, x, y) {
	var w0 = (x.l & 0xffff) + (y.l & 0xffff);
	var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
	var w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
	var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
	dst.l = (w0 & 0xffff) | (w1 << 16);
	dst.h = (w2 & 0xffff) | (w3 << 16);
}


/*
 * Same, except with 4 addends. Works faster than adding them one by one.
 */
function int64add4(dst, a, b, c, d) {
	var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
	var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
	var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (w1 >>> 16);
	var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
	dst.l = (w0 & 0xffff) | (w1 << 16);
	dst.h = (w2 & 0xffff) | (w3 << 16);
}


/*
 * Same, except with 5 addends.
 */
function int64add5(dst, a, b, c, d, e) {
	var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff);
	var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16);
	var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (w1 >>> 16);
	var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
	dst.l = (w0 & 0xffff) | (w1 << 16);
	dst.h = (w2 & 0xffff) | (w3 << 16);
}