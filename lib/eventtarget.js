import { Assembler, INSTANCE_PROPERTY_NAME } from 'esmodule'

const { CustomEvent, EventTarget } = window
const { getTargetOf } = Assembler

/**
 * @see https://www.w3.org/TR/dom/#interface-eventtarget
 */
export class EventTargetAssembler extends Assembler {
    /**
     * @param {string} type
     * @param {CustomEventInit|{}} [eventInitDict]
     * @param {boolean} [eventInitDict.bubbles]
     * @param {boolean} [eventInitDict.cancelable]
     * @param {*} [eventInitDict.detail]
     */
    emit(type, eventInitDict) {
        getTargetOf(this).dispatchEvent(new CustomEvent(type, eventInitDict))
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {boolean} [capture]
     */
    on(type, callback, capture) {
        getTargetOf(this).addEventListener(type, callback, capture)
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {boolean} [capture]
     */
    un(type, callback, capture) {
        getTargetOf(this).removeEventListener(type, callback, capture)
    }

    /**
     * @returns {EventTarget}
     * @override
     */
    static create() {
        return new EventTarget
    }

    /**
     * @returns {interface} EventTarget
     * @override
     */
    static get interface() {
        return EventTarget
    }
}

Object.defineProperty(
    EventTarget?
        EventTarget.prototype :
        window.Node.prototype, // MSIE fallback
    INSTANCE_PROPERTY_NAME,
    { writable : true, value : null })

/*
 * Workaround for JSDOM, where the Node still is not a superclass of the Attr
 * https://github.com/jsdom/jsdom/issues/1641
 */
if(Object.getPrototypeOf(window.Attr) !== window.Node) {
    Object.defineProperties(window.Attr.prototype, {
        nodeType : {
            configurable : true,
            enumerable : true,
            get() {
                return window.Node.ATTRIBUTE_NODE
            }
        },
        [INSTANCE_PROPERTY_NAME] : {
            writable : true,
            value : null
        }
    })
}
