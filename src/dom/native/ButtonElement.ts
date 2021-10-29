import { registerElement } from "../basicdom";
import { Button } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ButtonElement extends NativeViewElementNode<Button> {
    constructor() {
        super("Button", Button);
    }

    static register() {
        registerElement("Button", () => new ButtonElement());
    }
}
