#!/usr/bin/env node

/**
 * Build script to generate config.js from .env
 * Run with: node build-config.js
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        console.error('Error: .env file not found!');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        }
    });

    return envVars;
}

function generateConfig(envVars) {
    const assetVersion = envVars.ASSET_VERSION || '1.0.0';

    return `/**
 * Application Configuration
 * Auto-generated from .env file - DO NOT EDIT DIRECTLY
 * Generated on: ${new Date().toISOString()}
 */

// Asset version for cache busting
const ASSET_VERSION = '${assetVersion}';

// Export for use in other scripts
window.APP_CONFIG = {
    ASSET_VERSION: ASSET_VERSION
};

// Also set the legacy window.ASSET_VERSION for backward compatibility
window.ASSET_VERSION = ASSET_VERSION;

console.log('Config loaded - Asset version:', ASSET_VERSION);
`;
}

function main() {
    try {
        const envVars = loadEnv();
        const configContent = generateConfig(envVars);

        const configPath = path.join(__dirname, 'assets', 'js', 'config.js');
        fs.writeFileSync(configPath, configContent, 'utf8');

        console.log(`✅ Config updated with ASSET_VERSION: ${envVars.ASSET_VERSION}`);
        console.log('📝 config.js has been regenerated from .env');
    } catch (error) {
        console.error('❌ Error updating config:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { loadEnv, generateConfig };