import { registerElement } from "../basicdom";
import { SearchBar } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";

export default class SearchBarElement extends NativeViewElementNode<SearchBar> {
    constructor() {
        super("SearchBar", SearchBar);
    }

    static register() {
        registerElement("SearchBar", () => new SearchBarElement());
    }
}
