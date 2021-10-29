import { registerElement } from "../basicdom";
import { FlexboxLayout } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class FlexboxLayoutElement extends NativeViewElementNode<FlexboxLayout> {
    constructor() {
        super("FlexboxLayout", FlexboxLayout);
    }

    static register() {
        registerElement("FlexboxLayout", () => new FlexboxLayoutElement());
    }
}
