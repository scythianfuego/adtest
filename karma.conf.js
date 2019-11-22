module.exports = function(config) {
  config.set({
    frameworks: ["mocha", "chai", "sinon"],
    files: ["test/*.js"],
    browsers: ["ChromeHeadless"],
    preprocessors: {
      "test/*.js": ["webpack"]
    },
    webpack: {
      mode: "development"
    },
    client: {
      useIframe: false
    }
  });
};
