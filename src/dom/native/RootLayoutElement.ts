import { registerElement } from "../basicdom";
import { RootLayout } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class RootLayoutElement extends NativeViewElementNode<RootLayout> {
    constructor() {
        super("RootLayout", RootLayout);
    }

    static register() {
        registerElement("RootLayout", () => new RootLayoutElement());
    }
}
