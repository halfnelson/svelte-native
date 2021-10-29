import { registerElement } from "../basicdom";
import { TimePicker } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class TimePickerElement extends NativeViewElementNode<TimePicker> {
    constructor() {
        super("TimePicker", TimePicker);
    }

    static register() {
        registerElement("TimePicker", () => new TimePickerElement());
    }
}
