import { registerElement } from "../basicdom";
import { Switch } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class SwitchElement extends NativeViewElementNode<Switch> {
    constructor() {
        super("Switch", Switch);
    }

    static register() {
        registerElement("Switch", () => new SwitchElement());
    }
}
