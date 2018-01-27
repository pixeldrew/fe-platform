// This is referenced from the EnzymeJS site: http://airbnb.io/enzyme/docs/guides/jsdom.html

require('module-alias/register');
require('ignore-styles').default(['.css']);

const jsdom = require('jsdom');
const virtualConsole = new jsdom.VirtualConsole();

virtualConsole.on('error', console.error);
virtualConsole.on('warn', console.warn);
virtualConsole.on('info', console.info);
virtualConsole.on('dir', console.dir);

require('jsdom-global')(`<!doctype html><html><body></body></html>`, { pretendToBeVisual: true, virtualConsole });

global.requestAnimationFrame = window.requestAnimationFrame;
global.cancelAnimationFrame = window.cancelAnimationFrame;

const Adapter = require('enzyme-adapter-react-16');
const configure = require('enzyme').configure;

configure({ adapter: new Adapter() });

