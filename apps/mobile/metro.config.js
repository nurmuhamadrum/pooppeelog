const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Temukan root monorepo
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Pantau semua folder di root monorepo (termasuk packages/shared)
config.watchFolders = [monorepoRoot];

// 2. Izinkan Metro me-resolve node_modules dari apps/mobile dan root monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
