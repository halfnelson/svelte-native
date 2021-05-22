export {} //Ensure this is a module
import { NativeElementNode } from "src/dom";

declare global {
   function __sveltets_mapElementTag(
        tag: any
    ): NativeElementNode<any>;
}