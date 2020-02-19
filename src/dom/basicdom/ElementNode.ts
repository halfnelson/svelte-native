
import ViewNode from './ViewNode'
import TextNode from './TextNode';
import PropertyNode from './PropertyNode';
import { profile } from "@nativescript/core/profiling";


export interface IClassList {
    length: number;
    add(...classNames: string[]): void;
    remove(...classNames: string[]): void;
}


export default class ElementNode extends ViewNode {
    _classList: IClassList

    constructor(tagName: string) {
        super()
        this.nodeType = 1
        this.tagName = tagName

    }

    get id() {
        return this.getAttribute('id')
    }

    set id(value: string) {
        this.setAttribute('id', value)
    }

    @profile
    get classList() {
        if (!this._classList) {
            const getClasses = () => (this.getAttribute('class') || "").split(/\s+/).filter((k: string) => k != "")

            this._classList = {
                add: (...classNames: string[]) => {
                    this.setAttribute('class', [...new Set(getClasses().concat(classNames))].join(" "))
                },

                remove: (...classNames: string[]) => {
                    this.setAttribute('class', getClasses().filter((i: string) => classNames.indexOf(i) == -1).join(" "))
                },

                get length() {
                    return getClasses().length
                }
            }
        }
        return this._classList;
    }

    @profile
    appendChild(childNode: ViewNode) {
        super.appendChild(childNode)

        if (childNode.nodeType === 3 && (childNode as TextNode).text) {
            this.setText((childNode as TextNode).text)
        }

        if (childNode.nodeType === 7) {
            (childNode as PropertyNode).setOnNode(this);
        }
    }

    @profile
    insertBefore(childNode: ViewNode, referenceNode: ViewNode) {
        super.insertBefore(childNode, referenceNode)

        if (childNode.nodeType === 3) {
            this.setText((childNode as TextNode).text)
        }

        if (childNode.nodeType === 7) {
            (childNode as PropertyNode).setOnNode(this);
        }
    }

    @profile
    removeChild(childNode: ViewNode) {
        super.removeChild(childNode)

        if (childNode.nodeType === 3) {
            this.setText('')
        }

        if (childNode.nodeType === 7) {
            (childNode as PropertyNode).clearOnNode(this);
        }
    }
}
