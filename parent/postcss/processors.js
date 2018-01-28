const lost = require('lost');
const postcssImport = require('postcss-import');
const postcssMixins = require('postcss-mixins');
const postcssCSSnext = require('postcss-cssnext');
const postcssPxtorem = require('postcss-pxtorem');
const postcssUtilities = require('postcss-utilities');
const postcssFlexibility = require('postcss-flexibility');
const postcssCssVariables = require('postcss-css-variables');
const postcssFor = require('postcss-for');
const postcssFontFace = require('postcss-fontpath');
const postcssPrependImports = require('postcss-prepend-imports');

const path = require('path');

module.exports = {
    processors: themeLocation => ([
        postcssPrependImports({
            path: path.resolve(themeLocation, 'styles', 'config'),
            files: ['index.css']
        }),
        postcssImport(),
        postcssMixins(),
        postcssCssVariables(),
        postcssFor(),
        postcssUtilities(),
        postcssFlexibility(),
        postcssCSSnext(),
        postcssPxtorem(),
        lost(),
        postcssFontFace({
            formats: [
                {type: 'woff', ext: 'woff'},
                {type: 'woff2', ext: 'woff2'},
                {type: 'truetype', ext: 'ttf'},
                {type: 'svg', ext: 'svg'}
            ]
        })
    ])
};
