import { registerElement } from "../basicdom";
import { Slider } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class SliderElement extends NativeViewElementNode<Slider> {
    constructor() {
        super("Slider", Slider);
    }

    static register() {
        registerElement("Slider", () => new SliderElement());
    }
}
