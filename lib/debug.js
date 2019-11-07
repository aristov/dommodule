import 'esmodule/lib/debug'
import { NodeAssembler } from './NodeAssembler'

if(typeof global !== 'undefined') {
    global.NodeAssembler = NodeAssembler
}

if(typeof window !== 'undefined') {
    window.NodeAssembler = NodeAssembler
}
