import { ViewNode, logger as log } from "../basicdom";
import { TabNavigationBase, TabContentItem, Trace } from '@nativescript/core'
import NativeViewElementNode from "./NativeViewElementNode";
import { DomTraceCategory } from "..";

export default class BaseTabNavigationElement extends NativeViewElementNode<TabNavigationBase> {

    pendingInserts: TabContentItem[] = []

    constructor(tagName: string, viewClass: new () => TabNavigationBase) {
        super(tagName, viewClass);
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        try {
            if (childNode instanceof NativeViewElementNode && childNode.nativeView instanceof TabContentItem) {
                if(Trace.isEnabled()) {
            Trace.write( `adding tab content to nav`, DomTraceCategory, Trace.messageType.log);
        };
                this.pendingInserts.push(childNode.nativeView)
                //wait for next turn so that any content for our tab is attached to the dom
                Promise.resolve().then(() => {
                    if (this.pendingInserts.length == 0) return;
                    let items = (this.nativeView.items || []).concat(this.pendingInserts);
                    this.pendingInserts = [];
                    this.nativeView.items = [];
                    this.nativeView.items = items;
                });
                return;
            }
        } catch (e) {
            console.error(e);
        }
        super.onInsertedChild(childNode, index);
    }

    onRemovedChild(childNode: ViewNode) {
        try {
            if (childNode instanceof NativeViewElementNode && childNode.nativeView instanceof TabContentItem) {
                if(Trace.isEnabled()) {
            Trace.write( `removing content item from nav`, DomTraceCategory, Trace.messageType.log);
        };
                let items = (this.nativeView.items || []).filter(i => i != childNode.nativeView);
                this.nativeView.items = [];
                this.nativeView.items = items;
                return;
            }
        } catch (e) {
            console.error(e);
        }
        super.onRemovedChild(childNode);
    }

}
