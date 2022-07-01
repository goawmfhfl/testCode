const cracoAlias = require("craco-alias");
const path = require(`path`);
const webpack = require("webpack");

module.exports = {
  plugins: [
    {
      plugin: cracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.json",
      },
    },
  ],
  webpack: {
    alias: {
      "@pages": path.resolve(__dirname, "pages"),
      "@components": path.resolve(__dirname, "components"),
      "@icons": path.resolve(__dirname, "assets/icons"),
      "@images": path.resolve(__dirname, "assets/images"),
      "@fonts": path.resolve(__dirname, "assets/fonts"),
      "@styles": path.resolve(__dirname, "styles"),
      "@utils": path.resolve(__dirname, "utils"),
    },
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          os: require.resolve("os-browserify"),
          path: require.resolve("path-browserify"),
          fs: false,
          tls: false,
          net: false,
          child_process: false,
        },
        alias: {
          process: "process/browser",
        },
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false, // disable the behaviour
            },
          },
        ],
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  },
};
