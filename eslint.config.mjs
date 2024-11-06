import tsLintConfigs from '@aserto/ts-linting-configs'
// Define the type AnyObject
/**
 * @typedef {Object.<string, any>} AnyObject
 */

/**
 * Merges an array of objects, keeping objects as values for overlapping keys.
 * @param {AnyObject[]} objects - Array of objects to merge.
 * @returns {AnyObject} - The merged object.
 */
export function mergeObjects(objects) {
  return objects.reduce((acc, obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (acc[key] && typeof acc[key] === "object" && typeof value === "object") {
        // Recursively merge objects for overlapping keys
        acc[key] = mergeObjects([acc[key], value]);
      } else {
        // Otherwise, directly assign the new key-value pair
        acc[key] = value;
      }
    }
    return acc;
  }, {});
}

const defaultConfigs = mergeObjects(tsLintConfigs)
const rules = defaultConfigs.rules

export default {
  ...defaultConfigs,
  files: ["src/**/*.{ts,tsx}"],
  ignores: [".yarn", "node_modules", ".yalc"],

  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: rules,
}
