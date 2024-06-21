// config-overrides.js

module.exports = {
    webpack: function(config, env) {
      config.output.libraryTarget = 'commonjs2';
      return config;
    }
  };
  