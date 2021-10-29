import { registerElement } from "../basicdom";
import { ListPicker } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ListPickerElement extends NativeViewElementNode<ListPicker> {
    constructor() {
        super("ListPicker", ListPicker);
    }

    static register() {
        registerElement("ListPicker", () => new ListPickerElement());
    }
}
