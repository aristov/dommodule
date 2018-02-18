import { AttrAssembler } from './attr'
/**
 * !!! Workaround !!!
 * Garbage collector in Safari drops AttrAssembler instances
 * which have no links from a static memory structure.
 * TODO Write a bug report
 * TODO Implement a custom garbage collector here
 */
if(/safari/i.test(navigator.userAgent)) {
    const proto = AttrAssembler.prototype
    const setInstance = proto.setInstance
    AttrAssembler.__instances__ = []
    Object.defineProperty(proto, 'setInstance', {
        configurable : true,
        value : function(target) {
            setInstance.call(this, target)
            AttrAssembler.__instances__.push(this)
        }
    })
}
