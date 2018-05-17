const { isArray } = Array
const { HTMLCollection, NodeList } = window

export const EMPTY_STRING = ''
export const NAMESPACE_SEPARATOR = ':'
export const NO_PARENT_INDEX = -1
export const TYPE_FUNCTION = 'function'
export const TYPE_STRING = 'string'
export const TYPE_UNDEFINED = 'undefined'

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
        else if(item instanceof NodeList || item instanceof HTMLCollection) {
            result.push(...Array.from(item))
        }
        else if(item) {
            result.push(item)
        }
    })
    return result
}
