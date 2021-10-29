import { registerElement } from "../basicdom";
import { Image } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class ImageElement extends NativeViewElementNode<Image> {
    constructor() {
        super("Image", Image);
    }

    static register() {
        registerElement("Image", () => new ImageElement());
    }
}
