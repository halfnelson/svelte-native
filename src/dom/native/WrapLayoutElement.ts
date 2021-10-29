import { registerElement } from "../basicdom";
import { WrapLayout } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class WrapLayoutElement extends NativeViewElementNode<WrapLayout> {
    constructor() {
        super("WrapLayout", WrapLayout);
    }

    static register() {
        registerElement("WrapLayout", () => new WrapLayoutElement());
    }
}
