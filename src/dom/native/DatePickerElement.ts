import { registerElement } from "../basicdom";
import { DatePicker } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class DatePickerElement extends NativeViewElementNode<DatePicker> {
    constructor() {
        super("DatePicker", DatePicker);
    }

    static register() {
        registerElement("DatePicker", () => new DatePickerElement());
    }
}
