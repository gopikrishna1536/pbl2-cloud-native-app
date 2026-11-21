/**
 * 12-Factor App Environment Variable Validator
 */
function validateEnv(env, schema) {
  const errors = [];
  const parsed = {};

  Object.entries(schema).forEach(([key, rule]) => {
    const val = env[key];
    if (!val && rule.required) {
      errors.push(`Missing required environment variable: ${key}`);
      return;
    }
    if (val && rule.type === 'number') {
      const num = Number(val);
      if (isNaN(num)) errors.push(`Environment variable ${key} must be a valid number`);
      else parsed[key] = num;
    } else {
      parsed[key] = val || rule.default;
    }
  });

  return { valid: errors.length === 0, errors, parsed };
}

module.exports = { validateEnv };
