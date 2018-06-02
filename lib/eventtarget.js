import { Assembler, INSTANCE_PROPERTY_NAME } from 'esmodule'

const { CustomEvent, EventTarget } = window
const { getTargetOf } = Assembler

/**
 * @see https://www.w3.org/TR/dom/#interface-eventtarget
 */
export class EventTargetAssembler extends Assembler {
    /**
     * @param {*} [init]
     * @returns {EventTarget|*}
     */
    assemble(init) {
        Object.defineProperty(this, '__event_handlers__', {
            value : { true : {}, false : {} }
        })
        return super.assemble(init)
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
     * @param {{capture,once,passive}|boolean|EventTargetAssembler|*} [options]
     */
    on(type, callback, options = {}) {
        if(typeof options === 'boolean') {
            options = { capture : options }
        }
        else if(options instanceof EventTargetAssembler) {
            options = { context : options }
        }
        const handlers = this.__event_handlers__[Boolean(options.capture)]
        const map = handlers[type] || (handlers[type] = new Map)
        if(!map.has(callback)) {
            map.set(callback, callback = callback.bind(options.context || this))
            getTargetOf(this).addEventListener(type, callback, options)
        }
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {{capture}|boolean} [options]
     */
    un(type, callback, options = {}) {
        if(typeof options === 'boolean') {
            options = { capture : options }
        }
        else if(options instanceof EventTargetAssembler) {
            options = {}
        }
        const map = this.__event_handlers__[Boolean(options.capture)][type]
        if(map) {
            getTargetOf(this).removeEventListener(type, map.get(callback), options)
            map.delete(callback)
        }
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
