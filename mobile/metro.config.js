const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce the number of watched files
config.watchFolders = [];
config.resolver.sourceExts = [...config.resolver.sourceExts];

module.exports = config;

