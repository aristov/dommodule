import { TargetAssembler } from './target'
import { INSTANCE_PROPERTY_NAME } from './const'

const { CustomEvent, EventTarget } = window

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-eventtarget}
 */
export class EventTargetAssembler extends TargetAssembler {
    /**
     * @param {String} eventType
     * @param {CustomEventInit|{}} [eventInit]
     */
    emit(eventType, eventInit) {
        const event = new CustomEvent(eventType, eventInit)
        this._target.dispatchEvent(event)
    }

    /**
     * @param {String} type
     * @param {Function} callback
     * @param {Object} [capture=false]
     * @returns {EventTargetAssembler}
     */
    on(type, callback, capture = false) {
        this._target.addEventListener(type, callback, capture)
        return this
    }

    /**
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} [capture=false]
     * @returns {EventTargetAssembler}
     */
    un(type, callback, capture = false) {
        this._target.removeEventListener(type, callback, capture)
        return this
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
    INSTANCE_PROPERTY_NAME,
    { writable : true, value : null })
