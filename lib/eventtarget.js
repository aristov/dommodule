import { CustomEvent, EventTarget } from './dom'
import { TargetAssembler } from './target'
import { INSTANCE_PROPERTY_NAME } from './const'

export class EventTargetAssembler extends TargetAssembler {
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
     * @param {String} eventType
     * @param {CustomEventInit|{}} [eventInit]
     */
    emit(eventType, eventInit) {
        const event = new CustomEvent(eventType, eventInit)
        this._target.dispatchEvent(event)
    }

    /**
     * @returns {Function}
     */
    static get interface() {
        return EventTarget
    }
}

Object.defineProperty(
    EventTarget.prototype,
    INSTANCE_PROPERTY_NAME, {
        writable : true,
        value : null
    })
