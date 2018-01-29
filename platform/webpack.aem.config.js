/*eslint-env node */

const webpack = require('webpack');
const path = require('path');

// process ENV
const env = process.env;
const NODE_ENV = env.NODE_ENV || 'development';
const BRAND = env.BRAND || 'whitelabel';

const packageName = require('./package.json').name.split('/')[1];

let entry = {
    main: path.resolve(__dirname, 'dist', 'library', 'js', 'ssr')
};

module.exports = {

    devtool: 'none',

    entry,

    output: {
        path: path.resolve(__dirname, 'dist', 'jcr_root', 'apps', packageName),
        libraryTarget: 'umd',
        filename: `server.js`,
        library: packageName
    },

    resolve: {
        alias: {
            '@carnival-abg/platform$': path.resolve(__dirname, 'dist', 'components', 'index.js'),
            components: path.resolve(__dirname, 'dist', 'components'),
            'platform-theme': path.resolve(__dirname, 'dist', 'themes', BRAND)
        }
    },

    plugins: [

        new webpack.NormalModuleReplacementPlugin(
            /\.css$/,
            path.resolve(__dirname, 'dist', 'library', 'js', 'ssr', 'null-style.js')
        ),

        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr|it|en|es|nl/),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        })

    ],

    stats: {
        usedExports: true,
        optimizationBailout: true,
        entrypoints: true
    }
};

