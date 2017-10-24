if(typeof window === 'undefined' &&
    typeof require === 'function' &&
    typeof global === 'object') {
        const { JSDOM } = eval('require("jsdom")')
        const { window } = new JSDOM
        global.window = window
}
