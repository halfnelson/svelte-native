import { registerElement } from "../basicdom";
import { FormattedString, Span } from "@nativescript/core";
import NativeElementNode, {
    NativeElementPropType,
    registerNativeConfigElement,
} from "./NativeElementNode";

export default class FormattedStringElement extends NativeElementNode<FormattedString> {
    constructor() {
        super("FormattedString", FormattedString, "formattedText", {
            spans: NativeElementPropType.ObservableArray,
        });
    }

    static register() {
        registerElement("FormattedString", () => new FormattedStringElement());
        registerNativeConfigElement("Span", () => Span, "spans");
    }
}
