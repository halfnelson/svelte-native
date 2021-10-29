import { registerElement } from "../basicdom";
import NativeViewElementNode from "./NativeViewElementNode";
import { Label } from "@nativescript/core";

export default class LabelElement extends NativeViewElementNode<Label> {
    constructor() {
        super("Label", Label);
    }

    static register() {
        registerElement("Label", () => new LabelElement());
    }
}
