import { registerSvelteElements } from './svelte-elements'
import { registerNativeElements } from './nativescript-elements'
import SvelteNativeDocument from './svelte/SvelteNativeDocument'
import NativeViewElementNode from './native/NativeViewElementNode'
import { write, messageType } from '@nativescript/core/trace'
import { logger, LogLevel } from './basicdom'
import { View } from '@nativescript/core/ui/core/view'

export { default as HeadElement } from './svelte/HeadElement'
export { default as TemplateElement } from './svelte/TemplateElement'
export { default as SvelteNativeDocument } from './svelte/SvelteNativeDocument'
export { default as StyleElement } from './svelte/StyleElement'

export { default as NativeElementNode, NativeElementPropConfig, NativeElementPropType, registerNativeConfigElement } from './native/NativeElementNode'
export { default as NativeViewElementNode, registerNativeViewElement } from './native/NativeViewElementNode'
export { default as ActionBarElement } from './native/ActionBarElement'
export { default as FrameElement } from "./native/FrameElement"
export { default as TabsElement } from './native/TabsElement'
export { default as PageElement } from './native/PageElement'
export { default as ListViewElement, SvelteKeyedTemplate } from './native/ListViewElement'
export { default as BottomNavigationElement } from './native/BottomNavigationElement'

export { registerElement, createElement, ViewNode, ElementNode, logger, LogLevel } from './basicdom'
export { navigate, goBack, showModal, closeModal, ShowModalOptions, NavigationOptions, BackNavigationOptions } from './navigation'


function installGlobalShims(): SvelteNativeDocument {

    //expose our fake dom as global document for svelte components
    let window = global as any;

    window.window = global;
    window.document = new SvelteNativeDocument();

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (action: (now: DOMHighResTimeStamp) => {}) => {
            setTimeout(() => action(window.performance.now()), 33); //about 30 fps
        }
    }

    window.getComputedStyle = (node: NativeViewElementNode<View>) => {
        return node.nativeView.style;
    }

    window.performance = {
        now() {
            return Date.now();
        }
    };

    window.CustomEvent = class {
        detail: any;
        eventName: string;
        type: string;
        constructor(name: string, detail: any = null) {
            this.eventName = name; //event name for nativescript
            this.type = name; // type for svelte
            this.detail = detail;
        }
    }

    return window.document;
}

export const DomTraceCategory = 'SvelteNativeDom'

function initializeLogger() {
    logger.setHandler((message, level) => {
        let traceLevel = messageType.log
        switch (level) {
            case LogLevel.Debug: traceLevel = messageType.log; break;
            case LogLevel.Info: traceLevel = messageType.info; break;
            case LogLevel.Warn: traceLevel = messageType.warn; break;
            case LogLevel.Error: traceLevel = messageType.error; break;
        }
        write(message, DomTraceCategory, traceLevel)
    })
}

export function initializeDom() {
    initializeLogger();
    registerSvelteElements();
    registerNativeElements();
    return installGlobalShims();
}