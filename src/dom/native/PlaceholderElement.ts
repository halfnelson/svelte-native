import { registerElement } from "../basicdom";
import { Placeholder } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class PlaceholderElement extends NativeViewElementNode<Placeholder> {
    constructor() {
        super("Placeholder", Placeholder);
    }

    static register() {
        registerElement("Placeholder", () => new PlaceholderElement());
    }
}
