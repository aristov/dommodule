import { Assembler, INSTANCE_PROPERTY_NAME } from 'esmodule'

const { CustomEvent, EventTarget } = window
const { getTargetOf } = Assembler

/**
 * @see https://www.w3.org/TR/dom/#interface-eventtarget
 */
export class EventTargetAssembler extends Assembler {
    /**
     * @param {*} [init]
     */
    assemble(init) {
        Object.defineProperty(this, '__event_handlers__', {
            enumarable : false,
            value : {}
        })
        super.assemble(init)
    }

    /**
     * @param {Event|string|*} eventOrType
     * @param {CustomEventInit|{}} [eventInitDict]
     * @param {boolean} [eventInitDict.bubbles]
     * @param {boolean} [eventInitDict.cancelable]
     * @param {*} [eventInitDict.detail]
     * @returns {boolean}
     */
    emit(eventOrType, eventInitDict) {
        if(typeof eventOrType === 'string') {
            eventOrType = new CustomEvent(eventOrType, eventInitDict)
        }
        return getTargetOf(this).dispatchEvent(eventOrType)
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {boolean} [capture]
     */
    on(type, callback, capture) {
        callback = this.__event_handlers__[callback] = callback.bind(this)
        getTargetOf(this).addEventListener(type, callback, capture)
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {boolean} [capture]
     */
    un(type, callback, capture) {
        getTargetOf(this).removeEventListener(type, this.__event_handlers__[callback], capture)
        delete this.__event_handlers__[callback]
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
