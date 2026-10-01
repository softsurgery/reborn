const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch monorepo packages (source + assets such as Lottie JSON in mobile-components).
config.watchFolders = [workspaceRoot];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

const metroPort = process.env.PORT || process.env.RCT_METRO_PORT;
if (metroPort) {
  config.server = {
    ...config.server,
    port: Number(metroPort),
  };
}

module.exports = withNativeWind(config, { input: "./global.css", inlineRem: 16 });
