/*eslint-env node */

const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// process ENV
const env = process.env;
const NODE_ENV = env.NODE_ENV || 'development';
const BRAND = env.BRAND || 'cun';

const alias = require('./webpack.aliases')(BRAND, 'dist');
const packageName = require('./package.json').name.split('/')[1];

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

        // used to disable css modules
        new webpack.NormalModuleReplacementPlugin(
            /\.css$/,
            require.resolve('@carnival-abg/platform/dist/library/js/ssr/null-style')
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
