import { registerElement } from "../basicdom";
import { HtmlView } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class HtmlViewElement extends NativeViewElementNode<HtmlView> {
    constructor() {
        super("HtmlView", HtmlView);
    }

    static register() {
        registerElement("HtmlView", () => new HtmlViewElement());
    }
}
