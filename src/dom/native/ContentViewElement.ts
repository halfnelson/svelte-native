import { registerElement } from "../basicdom";
import { ContentView } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ContentViewElement extends NativeViewElementNode<ContentView> {
    constructor() {
        super("ContentView", ContentView);
    }

    static register() {
        registerElement("ContentView", () => new ContentViewElement());
    }
}
