import { AttrAssembler } from './attr'

const getPrototypeOf = Object.getPrototypeOf

const CLASS_NAME_SEPARATOR = ' '

export class Class extends AttrAssembler {
    /**
     * @returns {String}
     */
    static get value() {
        let classType = this
        let className = classType.name
        while((classType = getPrototypeOf(classType))) {
            if(classType === Class) break
            className += CLASS_NAME_SEPARATOR + classType.name
        }
        return className
    }
}

export const proto = {
    /**
     *
     * @param {String} className
     */
    set className(className) {
        this.node.className = className
    },
    /**
     * @returns {String}
     */
    get className() {
        return this.node.className
    }
}
