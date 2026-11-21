/**
 * IPv4 CIDR Ingress Allowlist Matcher
 */
function ipToLong(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function matchesCidr(ip, cidr) {
  const [subnet, bits] = cidr.split('/');
  const mask = bits === '0' ? 0 : (~0 << (32 - parseInt(bits, 10))) >>> 0;
  return (ipToLong(ip) & mask) === (ipToLong(subnet) & mask);
}

module.exports = { ipToLong, matchesCidr };
