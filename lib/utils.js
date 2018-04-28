const { isArray } = Array

/**
 * @param {Array} array
 * @returns {Array}
 */
export function flatten(array) {
    const result = []
    array.forEach(item => {
        if(isArray(item)) {
            result.push(...flatten(item))
        }
        else if(item) {
            result.push(item)
        }
    })
    return result
}
