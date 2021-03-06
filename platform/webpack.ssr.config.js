/*eslint-env node */

const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {camelCase} = require('lodash');

// process ENV
const env = process.env;
const NODE_ENV = env.NODE_ENV || 'development';
const BRAND = env.BRAND || 'whitelabel';

const alias = require('./webpack.aliases')(BRAND, 'dist');
const packageName = camelCase(require('./package.json').name.split('/').pop());

const aem = {

    devtool: 'none',

    entry: {
        main: path.resolve(__dirname, 'dist', 'library', 'js', 'ssr')
    },

    output: {
        path: path.resolve(__dirname, 'dist', 'jcr_root', 'apps', packageName),
        libraryTarget: 'umd',
        filename: `server.js`,
        library: packageName
    },

    resolve: {
        alias
    },

    plugins: [

        // disables css styles required in modules from being converted
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

    ]
};

const node = Object.assign({},
    aem,
    {
        target: 'node',

        externals: [nodeExternals()],

        entry: {
            main: path.resolve(__dirname, 'dist', 'components')
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'umd',
            filename: `${packageName}.umd.js`,
            library: packageName
        }
    }
);

module.exports = [aem, node];
