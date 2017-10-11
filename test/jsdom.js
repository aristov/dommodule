const { JSDOM } = require('jsdom')
const { window } = new JSDOM
global.window = window

const dommodule = require('../dist/dist.jsdom.dommodule')

const { element } = dommodule
const node = element('test').node

console.log(node.outerHTML)
