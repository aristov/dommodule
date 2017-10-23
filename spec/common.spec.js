import chai from 'chai'
import {
    CharacterData, CharacterDataAssembler,
    EventTarget, EventTargetAssembler,
    Node, NodeAssembler
} from '../lib'

const { assert } = chai

describe('Common', () => {
    describe('CharacterDataAssembler', () => {
        it('static domInterface', () => {
            assert.equal(CharacterDataAssembler.domInterface, CharacterData)
        })
    })
    describe('EventTargetAssembler', () => {
        it('static domInterface', () => {
            assert.equal(EventTargetAssembler.domInterface, EventTarget)
        })
    })
    describe('NodeAssembler', () => {
        it('static domInterface', () => {
            assert.equal(NodeAssembler.domInterface, Node)
        })
    })
})
