const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });
config.resolver.platforms = ["ios", "android", "native", "web"];

module.exports = withNativeWind(config, { input: "./global.css" });
