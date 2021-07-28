#--
# Script to test the JavaScript hash algorithms
# This produces an HTML file, that you load in a browser to run the tests
#--
import hashlib, base64, hmac

all_algs = ['md5', 'sha1', 'ripemd160', 'sha256', 'sha512']
short = {'ripemd160': 'rmd160'}
test_strings = ['hello', 'world', u'fred\u1234'.encode('utf-8'), 'this is a longer test message to confirm that multiple blocks are handled correctly by the hashing algorithm']

print ("""<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"/></head><body><script src="https://cdn.jsdelivr.net/npm/jhash.js@latest/jhash.min.js"></script>""")

for alg in all_algs:
    algs = short.get(alg, alg)

    print ("""
<script>
var pass = 0; fail = 0;
function check(a, b)
{
    if(a != b)
    {
        document.write('Test fail: ' + a + ' != ' + b + '<br/>');
        fail += 1;
    }
    else pass += 1;
}
document.write("Testing %s...<br/>");
""" % (alg))

    for t in test_strings:
        h = hashlib.new(alg)
        h.update(t)
        print ("check(JHash.hex_%s('%s'), '%s');" % (algs, t, h.hexdigest()))
        print ("check(JHash.b64_%s('%s'), '%s');" % (algs, t, base64.b64encode(h.digest()).rstrip('=')))
        h = hmac.new('key', t, lambda: hashlib.new(alg))
        print ("check(JHash.hex_hmac_%s('key', '%s'), '%s');" % (algs, t, h.hexdigest()))
        print ("check(JHash.b64_hmac_%s('key', '%s'), '%s');" % (algs, t, base64.b64encode(h.digest()).rstrip('=')))

    print ("""
document.write('Tests competed - ' + pass + ' passed; ' + fail + ' failed.<br/><br/>');
</script>
""")

print ("</body></html>")
