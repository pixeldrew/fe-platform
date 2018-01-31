const path = require('path');

module.exports = (BRAND, dir = __dirname) => ({
    '@carnival-abg/platform$': path.resolve(dir, 'components', 'index.js'),
    'platform-theme': path.resolve(dir, 'themes', BRAND)
});
