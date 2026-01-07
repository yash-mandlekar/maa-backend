/**
 * Puppeteer configuration for Render deployment
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Download Chrome to a path within the project directory
  cacheDirectory: require("path").join(__dirname, ".cache", "puppeteer"),
};
