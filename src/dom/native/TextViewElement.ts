import { registerElement } from "../basicdom";
import { TextView } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class TextViewElement extends NativeViewElementNode<TextView> {
    constructor() {
        super("TextView", TextView);
    }

    static register() {
        registerElement("TextView", () => new TextViewElement());
    }
}
