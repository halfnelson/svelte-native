import { Page } from '@nativescript/core'
import { registerElement } from '../basicdom';
import NativeViewElementNode from './NativeViewElementNode';

export default class PageElement extends NativeViewElementNode<Page> {
    constructor() {
        super("Page", Page);
    }

    static register() {
        registerElement("Page", () => new PageElement())
    }
}