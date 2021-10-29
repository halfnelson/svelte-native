import { registerElement } from "../basicdom";
import { ScrollView } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ScrollViewElement extends NativeViewElementNode<ScrollView> {
    constructor() {
        super("ScrollView", ScrollView);
    }

    static register() {
        registerElement("ScrollView", () => new ScrollViewElement());
    }
}
