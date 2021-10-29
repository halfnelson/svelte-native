import { registerElement } from "../basicdom";
import { WebView } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class WebViewElement extends NativeViewElementNode<WebView> {
    constructor() {
        super("WebView", WebView);
    }

    static register() {
        registerElement("WebView", () => new WebViewElement());
    }
}
