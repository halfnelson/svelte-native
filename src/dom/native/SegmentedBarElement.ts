import { registerElement } from "../basicdom";
import { SegmentedBar, SegmentedBarItem } from "@nativescript/core";
import NativeViewElementNode, { registerNativeViewElement } from "./NativeViewElementNode";
import {
    NativeElementPropType,
} from "./NativeElementNode";

export default class SegmentedBarElement extends NativeViewElementNode<SegmentedBar> {
    constructor() {
        super("SegmentedBar", SegmentedBar, null, {
            items: NativeElementPropType.Array,
        });
    }

    static register() {
        registerElement("SegmentedBar", () => new SegmentedBarElement());
        registerNativeViewElement(
            "SegmentedBarItem",
            () => SegmentedBarItem,
            "items"
        );
    }
}
