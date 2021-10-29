import { registerElement } from "../basicdom";
import { SegmentedBar, SegmentedBarItem } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";
import {
    NativeElementPropType,
    registerNativeConfigElement,
} from "./NativeElementNode";

export default class SegmentedBarElement extends NativeViewElementNode<SegmentedBar> {
    constructor() {
        super("SegmentedBar", SegmentedBar, null, {
            items: NativeElementPropType.Array,
        });
    }

    static register() {
        registerElement("SegmentedBar", () => new SegmentedBarElement());
        registerNativeConfigElement(
            "SegmentedBarItem",
            () => SegmentedBarItem,
            "items"
        );
    }
}
