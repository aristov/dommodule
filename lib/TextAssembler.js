import { CharacterDataAssembler } from './CharacterDataAssembler'

const { Text } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-text
 */
export class TextAssembler extends CharacterDataAssembler {
    /**
     * @returns {string}
     */
    toString() {
        return this.data
    }

    /**
     * @returns {interface} Text
     * @override
     */
    static get interface() {
        return Text
    }
}

TextAssembler.register()
