import { registerElement } from "../basicdom";
import { ActivityIndicator } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ActivityIndicatorElement extends NativeViewElementNode<ActivityIndicator> {
    constructor() {
        super("ActivityIndicator", ActivityIndicator);
    }

    static register() {
        registerElement(
            "ActivityIndicator",
            () => new ActivityIndicatorElement()
        );
    }
}
