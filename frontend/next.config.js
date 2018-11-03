/* eslint-disable */
const { parsed: DATA_API } = require("dotenv").config();
const webpack = require("webpack");
/* eslint-enable */

module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(DATA_API));

    return config;
  },
};
