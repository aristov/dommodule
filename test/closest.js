module.exports = function(selector) {
    let element = this
    while(element) {
        if(element.matches(selector)) {
            return element
        }
        element = element.parentElement
    }
}
