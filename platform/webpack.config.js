/*eslint-env node */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

// process images in assets to this quality
const imageQuality = 85;

// process ENV
const env = process.env;
const NODE_ENV = env.NODE_ENV || 'development';
const BRAND = env.BRAND || 'whitelabel';

// path where content lives in AEM
const publicPath = `/etc/designs/${BRAND}/`;
const brandSrcDir = path.resolve(__dirname, 'themes', BRAND);
const shareModuleAfter = 2;
const maxFileSizeToInline = 8192; // 8.192kb

const isDevelop = NODE_ENV === 'development';

const themeLocation = path.resolve(__dirname, 'themes', BRAND);

const postcssPlugins = require('./postcss.config').processors(themeLocation);

const extractBundles = bundles => (
    isDevelop ? [] : bundles.map(bundle => new webpack.optimize.CommonsChunkPlugin(bundle))
);

const isVendor = ({resource}) => /node_modules/.test(resource);

const globalIncludes = ['normalize.css'];

let entry = {
    'js/mediators/home': [path.resolve(__dirname, 'library', 'js', 'mediators', 'home')],
    'js/mediators/aboutUsPage': [path.resolve(__dirname, 'library', 'js', 'mediators', 'aboutUsPage')]
};

entry = Object.entries(entry).map(([key, value]) => [key, [...globalIncludes, ...value]]).reduce((a, v) => {
    a[v[0]] = v[1];
    return a;
}, {});

if (isDevelop) {
    entry = Object.entries(entry).map(([key, value]) => [key, ['react-hot-loader/patch', 'webpack-hot-middleware/client', ...value]]).reduce((a, v) => {
        a[v[0]] = v[1];
        return a;
    }, {});
}

module.exports = {

    devtool: isDevelop ? 'eval-source-map' : 'none',

    entry,

    output: {
        path: path.resolve(__dirname, 'dist', 'jcr_root', 'etc', 'designs', BRAND),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: 'js/[name].js'
    },

    resolve: {
        alias: {
            '@carnival-abg/platform$': path.resolve(__dirname, 'components', 'index.js'),
            components: path.resolve(__dirname, 'components'),
            'platform-theme': path.resolve(__dirname, 'themes', BRAND)
        }
    },

    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|woff2|otf|svg)(\?v=\d+\.\d+\.\d+)?$/,
                include: [
                    path.resolve(brandSrcDir, 'fonts')
                ],
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: maxFileSizeToInline,
                        name: file => (file.split(`${BRAND}/`)[1]),
                        publicPath
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                include: [
                    path.resolve(brandSrcDir, 'images')
                ],
                use: [
                    isDevelop ? null : {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: imageQuality
                            }
                        }
                    },
                    {
                        loader: 'url-loader',
                        options: {
                            limit: maxFileSizeToInline,
                            name: file => (file.split(`${BRAND}/`)[1]),
                            publicPath
                        }
                    }
                ].filter(p => p)
            },
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'components'),
                    path.resolve(__dirname, 'library', 'js'),
                ],
                exclude: [
                    path.resolve(__dirname, 'library', 'js', 'vendor')
                ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: '.babel-cache'
                        }
                    },
                    isDevelop ? 'eslint-loader' : null
                ].filter(p => p)

            },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'components'),
                    path.resolve(themeLocation, 'styles'),
                    path.resolve(__dirname, 'node_modules', 'normalize.css')
                ],
                use: isDevelop ? [
                    {loader: 'style-loader', options: {sourceMap: true}},
                    {loader: 'css-loader', options: {modules: false, importLoaders: 1, sourceMap: true}},
                    {loader: 'postcss-loader', options: {sourceMap: true, plugins: postcssPlugins}}
                ] : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader', options: {modules: false, importLoaders: 1}},
                        {loader: 'postcss-loader', options: {sourceMap: false, plugins: postcssPlugins}}
                    ]
                })
            }
        ]
    },
    plugins: [

        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr|it|en|es|nl/),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        }),

        isDevelop ? new webpack.HotModuleReplacementPlugin() : null,

        isDevelop ? new webpack.NoEmitOnErrorsPlugin() : null,

        isDevelop ? new webpack.NamedModulesPlugin() : null,

        isDevelop ? null : new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: shareModuleAfter,
            moveToParents: true
        }),

        ...extractBundles([
            {name: 'js/common', minChunks: (module, count) => count >= shareModuleAfter},
            {name: 'js/vendor', minChunks: module => isVendor(module) && !/\.css/.test(module.resource)}
        ]),

        isDevelop ? null : new ExtractTextPlugin({
            allChunks: true,
            filename(getPath) {
                return getPath('css/[name].css').replace('css/js/', 'css/').replace('mediators', 'pages');
            }
        }),

        isDevelop ? null : new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {discardComments: {removeAll: true}},
            canPrint: true
        }),

        isDevelop ? null : new webpack.optimize.UglifyJsPlugin()

    ].filter(p => p),
    stats: {
        usedExports: true,
        optimizationBailout: true,
        entrypoints: true
    }
};
