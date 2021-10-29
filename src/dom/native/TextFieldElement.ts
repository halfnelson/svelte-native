import { registerElement } from "../basicdom";
import { TextField } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class TextFieldElement extends NativeViewElementNode<TextField> {
    constructor() {
        super("TextField", TextField);
    }

    static register() {
        registerElement("TextField", () => new TextFieldElement());
    }
}
