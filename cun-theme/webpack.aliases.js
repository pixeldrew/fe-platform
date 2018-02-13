/* eslint-env node */

const path = require('path');

module.exports = (BRAND, dir = __dirname ) => ({
    '@carnival-abg/cunplatform$': path.resolve(dir, 'components', 'index.js'),
    '@carnival-abg/platform$': require.resolve('@carnival-abg/platform/dist/components/index.js'),
    '@carnival-abg/platform': path.dirname(require.resolve('@carnival-abg/platform')),
    'platform-theme': path.resolve(dir, 'themes', BRAND), // used to override the default platform
    'cunplatform-theme': path.resolve(dir, 'themes', BRAND)
});
