import { registerElement } from "../basicdom";
import { Progress } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ProgressElement extends NativeViewElementNode<Progress> {
    constructor() {
        super("Progress", Progress);
    }

    static register() {
        registerElement("Progress", () => new ProgressElement());
    }
}
