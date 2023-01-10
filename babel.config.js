module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@src": "./src",
            "@assets": "./assets",
            modules: "./src/modules",
            lib: "./src/lib",
            types: "./src/types",
            constants: "./src/constants",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
    env: {
      production: {
        plugins: [
          [
            "inline-dotenv",
            {
              path: ".env.production",
            },
          ],
        ],
      },
      development: {
        plugins: [
          [
            "inline-dotenv",
            {
              path: ".env.development",
            },
          ],
        ],
      },
    },
  };
};
