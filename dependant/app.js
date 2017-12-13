
const express = require('express');
const processors = require('cssnext-parent/postcss/processors').processors;

const path = require('path');
const postcssReporter = require('postcss-reporter');
const pm = require('postcss-middleware');
const PORT = process.env.PORT || 3034;

const postcssMiddleware = pm({
    inlineSourcemaps: true,
    src: (req) => {
        return path.join(`css`, req.url);
    },
    plugins: [
        ...processors,
        postcssReporter({clearReportedMessages: true})
    ]
});

const app = express();

app.use( `/css`, postcssMiddleware );

const server = require( 'http' ).createServer( app );

server.listen( PORT );
