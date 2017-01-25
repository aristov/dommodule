import { xmlelement, xmldocument, doctype, fragment, text, cdata, comment, instruction } from '../lib'

const element = xmlelement('title', 'XML Document')

document.documentElement.append(element.node)
