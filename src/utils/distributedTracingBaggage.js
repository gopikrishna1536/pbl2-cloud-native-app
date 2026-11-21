/**
 * W3C Trace Context & Baggage Header Parser
 */
function parseTraceparent(header) {
  if (!header || typeof header !== 'string') return null;
  const parts = header.trim().split('-');
  if (parts.length !== 4 || parts[0] !== '00') return null;
  return {
    version: parts[0],
    traceId: parts[1],
    parentId: parts[2],
    traceFlags: parts[3]
  };
}

module.exports = { parseTraceparent };
