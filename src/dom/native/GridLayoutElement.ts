import { registerElement } from "../basicdom";
import { GridLayout } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class GridLayoutElement extends NativeViewElementNode<GridLayout> {
    constructor() {
        super("GridLayout", GridLayout);
    }

    static register() {
        registerElement("GridLayout", () => new GridLayoutElement());
    }
}
