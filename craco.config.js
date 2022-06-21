const cracoAlias = require("craco-alias");
const path = require(`path`);

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
      "@components": path.resolve(__dirname, "components"),
      "@icons": path.resolve(__dirname, "assets/icons"),
      "@images": path.resolve(__dirname, "assets/images"),
    },
  },
};
