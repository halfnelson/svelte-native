import { registerElement } from "../basicdom";
import { FormattedString, Span } from "@nativescript/core";
import { NativeElementPropType } from "./NativeElementNode";
import  NativeViewElementNode, { registerNativeViewElement } from "./NativeViewElementNode";

export default class FormattedStringElement extends NativeViewElementNode<FormattedString> {
    constructor() {
        super("FormattedString", FormattedString, "formattedText", {
            spans: NativeElementPropType.ObservableArray,
        });
    }

    static register() {
        registerElement("FormattedString", () => new FormattedStringElement());
        registerNativeViewElement("Span", () => Span, "spans");
    }
}
