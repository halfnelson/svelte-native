import { registerElement } from "../basicdom";
import { StackLayout } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class StackLayoutElement extends NativeViewElementNode<StackLayout> {
    constructor() {
        super("StackLayout", StackLayout);
    }

    static register() {
        registerElement("StackLayout", () => new StackLayoutElement());
    }
}
