process.env.CHROME_BIN = require("puppeteer").executablePath()

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["mocha"],
    files: [
      {
        pattern: "./components/src/**/test/*.test.js",
        type: "module",
        included: true,
      },
      {
        pattern: "./components/src/**/dist/*.js",
        type: "module",
        included: false,
      },
      { pattern: "./utils/*.js", type: "module", included: false },
    ],
    exclude: [],
    preprocessors: {},
    reporters: ["mocha"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatchBatchDelay: 1000,
    browserNoActivityTimeout: 400000,
    browsers: ["FirefoxHeadless", "ChromeHeadless"], // "ChromeCanary" for Chrome Development Browser
    // singleRun: true,
    concurrency: Infinity,
  })
}
