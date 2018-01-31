/* eslint-env node */

const path = require('path');

module.exports = (BRAND, dir = __dirname ) => ({
    '@carnival-abg/cun$': path.resolve(dir, 'components', 'index.js'),
    'platform-theme': path.resolve(dir, 'themes', BRAND), // used to override the default platform
    'cun-theme': path.resolve(dir, 'themes', BRAND)
});
