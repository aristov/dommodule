const config = {}
if(typeof window !== 'undefined') {
    config.window = window
}
else {
    const { JSDOM } = eval('require("jsdom")')
    const { window } = new JSDOM
    config.window = window
}
module.exports = config
