/**
 * EventTarget
 *  on
 *  un
 *  emit
 * Node
 * Document
 * DocumentType
 * DocumentFragment
 * ShadowRoot
 * Element
 * CharacterData
 * Text
 * CDATASection
 * ProcessingInstruction
 * Comment
 *
 */

class EventTargetAssembler {
    set on(on) {
        Object.keys(on).forEach(type => {
            this.eventTarget.addEventListener(type, on[type]);
        });
    }
}

class NodeAssembler extends EventTargetAssembler {
    set children(children) {
        this.node.append(...children);
    }
}


