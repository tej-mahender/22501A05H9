
/**
 * Frontend Logging Middleware
 * This module provides a reusable logging function for use in frontend applications.
 * It ensures all logs are validated and sent to the evaluation server.
 *
 * To use:
 * import log from '../path-to-logging/index';
 * await log('frontend', 'error', 'component', 'Something went wrong');
 */

const VALID_STACKS = ['frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils'
];

const LOGGING_API = 'http://20.244.56.144/eva1uation-service/logs';
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN; // Set this in your .env file

console.log(ACCESS_TOKEN)
const log = async (stack, level, pkg, message) => {
  try {
    // Validate inputs
    if (!VALID_STACKS.includes(stack)) {
      console.warn(`Invalid stack: ${stack}`);
      return;
    }
    if (!VALID_LEVELS.includes(level)) {
      console.warn(`Invalid level: ${level}`);
      return;
    }
    if (!VALID_PACKAGES.includes(pkg)) {
      console.warn(`Invalid package: ${pkg}`);
      return;
    }

    // Construct payload
    const body = {
      stack: stack.trim().toLowerCase(),
      level: level.trim().toLowerCase(),
      package: pkg.trim().toLowerCase(),
      message: message.trim(),
    };

    // Call logging server
    const res = await fetch(LOGGING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      console.error(`Failed to log: ${res.status} ${res.statusText}`);
      return;
    }

    const result = await res.json();
    console.log('Log created successfully:', result.logID);
  } catch (err) {
    console.error('Logging error:', err);
  }
};

export default log;
