import { AttrAssembler } from '../lib'

const ROLE_ATTR_NAME = 'role'
const ROLE_SEPARATOR = ' '

export class Role extends AttrAssembler {
    set value(value) {
        this.node.value = this.constructor.value || value
    }

    get value() {
        return this.node.value
    }

    static get value() {
        const roleList = []
        let roleType = this
        do if(roleType.abstract === false) {
            roleList.push(roleType.name)
        }
        while((roleType = Object.getPrototypeOf(roleType)) && ROLE_ATTR_NAME in roleType)
        return roleList.join(ROLE_SEPARATOR).toLowerCase()
    }

    static get localName() {
        return ROLE_ATTR_NAME
    }

    static get abstract() {
        return true
    }
}

export function role(...init) {
    return new Role(...init)
}

export class Busy extends AttrAssembler {
    static get localName() {
        return 'aria-busy'
    }
}

export class RoleType extends Role {
    init(init) {
        if(init && init.constructor !== Object) {
            this.childNodes = init
            super.init()
        }
        else super.init(init)
    }

    set disabled(disabled) {
        if(!this.ownerElement) {
            this.ownerElement = this.constructor.ownerElement
        }
        const node = this.ownerElement.node
        if(disabled) node.setAttribute('aria-disabled', 'true')
        else node.removeAttribute('aria-disabled')
    }

    get disabled() {
        return this.ownerElement.node.getAttribute('aria-disabled') === 'true'
    }

    set busy(busy) {
        if(!this.ownerElement) {
            this.ownerElement = this.constructor.ownerElement
        }
        const node = this.ownerElement.node.getAttributeNode('aria-busy')
        const attr = this.getInstance(node)
        if(attr) attr.value = busy
        else {
            new Busy({
                ownerElement : this.ownerElement,
                value : busy
            })
        }
    }

    get busy() {
        return this.ownerElement.node.attributes
    }
}

export class Widget extends RoleType {}

export class Command extends Widget {}

export class Button extends Command {
    static get abstract() {
        return false
    }
}

export function button(...init) {
    return new Button(...init)
}
