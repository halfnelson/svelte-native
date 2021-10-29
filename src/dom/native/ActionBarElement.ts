import { ActionBar, ActionItem, NavigationButton } from "@nativescript/core";
import NativeViewElementNode from "./NativeViewElementNode";
import { registerElement, ViewNode } from "../basicdom";
import NativeElementNode, { registerNativeConfigElement } from "./NativeElementNode";

export default class ActionBarElement extends NativeViewElementNode<ActionBar> {
    constructor() {
        super("ActionBar", ActionBar);
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        //ActionItems isn't an array or ObservableArray, it is a special ActionItems type, so we handle it here
        if (childNode instanceof NativeElementNode) {
            let propName = childNode.propAttribute;
            if (propName) {
                if (propName.toLowerCase() == "actionitems") {
                    this.nativeView.actionItems.addItem(
                        childNode.nativeElement
                    );
                    return; //skip rest of the processing.
                }
            }
        }

        super.onInsertedChild(childNode, index);
    }

    onRemovedChild(childNode: ViewNode) {
        if (childNode instanceof NativeElementNode) {
            let propName = childNode.propAttribute;
            if (propName) {
                if (propName.toLowerCase() == "actionitems") {
                    this.nativeView.actionItems.removeItem(
                        childNode.nativeElement
                    );
                    return; //skip rest of the processing.
                }
            }
        }

        super.onRemovedChild(childNode);
    }

    static register() {
        registerElement("ActionBar", () => new ActionBarElement())

        registerNativeConfigElement(
            "NavigationButton",
            () => NavigationButton,
            "navigationButton"
        );

        registerNativeConfigElement(
            "ActionItem",
            () => ActionItem,
            "actionItems"
        );
    }
}
