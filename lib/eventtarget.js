import { Assembler } from 'esmodule'
import { INSTANCE_PROPERTY_NAME } from './const'

const { CustomEvent, EventTarget } = window
const { getTargetOf } = Assembler

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-eventtarget}
 */
export class EventTargetAssembler extends Assembler {
    /**
     * @param {String} type
     * @param {CustomEventInit|{}} [eventInitDict]
     */
    emit(type, eventInitDict) {
        getTargetOf(this).dispatchEvent(new CustomEvent(type, eventInitDict))
    }

    /**
     * @param {String} type
     * @param {Function} callback
     * @param {Object} [capture=false]
     */
    on(type, callback, capture = false) {
        getTargetOf(this).addEventListener(type, callback, capture)
    }

    /**
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} [capture=false]
     */
    un(type, callback, capture = false) {
        getTargetOf(this).removeEventListener(type, callback, capture)
    }

    /**
     * @returns {Window.EventTarget}
     * @override
     */
    static create() {
        return new EventTarget
    }

    /**
     * @returns {window.EventTarget}
     * @override
     */
    static get interface() {
        return EventTarget
    }
}

Object.defineProperty(
    EventTarget? EventTarget.prototype : window.Node.prototype, // MSIE fallback
    INSTANCE_PROPERTY_NAME, // todo import from esmodule
    { writable : true, value : null })
