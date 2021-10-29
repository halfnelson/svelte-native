import { registerElement } from "../basicdom";
import { AbsoluteLayout } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class AbsoluteLayoutElement extends NativeViewElementNode<AbsoluteLayout> {
    constructor() {
        super("AbsoluteLayout", AbsoluteLayout);
    }

    static register() {
        registerElement("AbsoluteLayout", () => new AbsoluteLayoutElement());
    }
}
