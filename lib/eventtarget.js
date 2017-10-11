import { TargetAssembler } from './target'

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
}
