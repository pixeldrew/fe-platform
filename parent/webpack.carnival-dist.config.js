const webpack = require('webpack');
const webpackNodeExternals = require('webpack-node-externals');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';

const isDevelop = NODE_ENV === 'development';

module.exports = {

    devtool: isDevelop ? 'eval-source-map' : 'none',

    entry: {
        'carnival': path.resolve(__dirname, 'components', 'index')
    },

    externals: [webpackNodeExternals()],

    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'carnival',
        filename: '[name].js',
        libraryTarget: 'umd'
    },

    resolve: {
        alias: {
            'carnival$': path.resolve(__dirname, 'components', 'index.js'),
        }
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'components'),
                ],
                loader: 'babel-loader',
                options: {
                    cacheDirectory: '.babel-cache'
                }
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        isDevelop ? null : new webpack.optimize.UglifyJsPlugin()
    ].filter(p => p)
};
