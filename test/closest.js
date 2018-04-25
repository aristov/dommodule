module.exports = function(selectors) {
    let parentNode = this, matches
    while(
        // document has no .matches
    (matches = parentNode && parentNode.matches) &&
    !parentNode.matches(selectors)
        ) {
        parentNode = parentNode.parentNode
    }
    return matches? parentNode : null
}
