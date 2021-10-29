import { registerElement } from "../basicdom";
import { ProxyViewContainer } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ProxyViewContainerElement extends NativeViewElementNode<ProxyViewContainer> {
    constructor() {
        super("ProxyViewContainer", ProxyViewContainer);
    }

    static register() {
        registerElement(
            "ProxyViewContainer",
            () => new ProxyViewContainerElement()
        );
    }
}
