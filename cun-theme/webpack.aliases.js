/* eslint-env node */

const path = require('path');

module.exports = (BRAND, dir = __dirname ) => ({
    '@carnival-abg/cunplatform$': path.resolve(dir, 'components', 'index.js'),
    'platform-theme': path.resolve(dir, 'themes', BRAND), // used to override the default platform
    'cunplatform-theme': path.resolve(dir, 'themes', BRAND)
});
