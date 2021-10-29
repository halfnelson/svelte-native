import { registerElement } from "../basicdom";
import { DockLayout } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class DockLayoutElement extends NativeViewElementNode<DockLayout> {
    constructor() {
        super("DockLayout", DockLayout);
    }

    static register() {
        registerElement("DockLayout", () => new DockLayoutElement());
    }
}
