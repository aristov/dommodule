import { Assembler } from 'esmodule'

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
        let context = this
        if(typeof options === 'boolean') {
            options = { capture : options }
        }
        else if(options instanceof EventTargetAssembler) {
            context = options
            options = {}
        }
        const handlers = context.__event_handlers__[Boolean(options.capture)]
        const map = handlers[type] || (handlers[type] = new Map)
        if(!map.has(callback)) {
            map.set(callback, callback = callback.bind(context))
            getTargetOf(this).addEventListener(type, callback, options)
        }
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {{capture}|boolean} [options]
     */
    un(type, callback, options = {}) {
        let context = this
        if(typeof options === 'boolean') {
            options = { capture : options }
        }
        else if(options instanceof EventTargetAssembler) {
            context = options
            options = {}
        }
        const map = context.__event_handlers__[Boolean(options.capture)][type]
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
