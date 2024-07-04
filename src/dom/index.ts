import { registerSvelteElements } from "./svelte-elements";
import { registerNativeElements } from "./nativescript-elements";

import SvelteNativeDocument from "./svelte/SvelteNativeDocument";
import NativeViewElementNode from "./native/NativeViewElementNode";
import { Trace, View } from "@nativescript/core";
import { time } from '@nativescript/core/profiling';
import { logger, LogLevel } from "./basicdom";

export { default as HeadElement } from "./svelte/HeadElement";
export { default as TemplateElement } from "./svelte/TemplateElement";
export { default as SvelteNativeDocument } from "./svelte/SvelteNativeDocument";
export { default as StyleElement } from "./svelte/StyleElement";

export {
    default as NativeElementNode,
    NativeElementPropConfig,
    NativeElementPropType,
    registerNativeConfigElement,
} from "./native/NativeElementNode";
export {
    default as NativeViewElementNode,
    registerNativeViewElement,
} from "./native/NativeViewElementNode";

export * from "./nativescript-elements";
export * from "./basicdom";
export * from "./navigation";

function installGlobalShims(): SvelteNativeDocument {
    //expose our fake dom as global document for svelte components
    let window = global as any;

    window.window = global;
    window.document = new SvelteNativeDocument();

    window.getComputedStyle = (node: NativeViewElementNode<View>) => {
        return node.nativeView.style;
    };
    if (!window.performance) {
        window.performance = {
            now: time,
        };
    }
    

    window.CustomEvent = class {
        detail: any;
        eventName: string;
        type: string;
        constructor(name: string, detail: any = null) {
            this.eventName = name; //event name for nativescript
            this.type = name; // type for svelte
            this.detail = detail;
        }
    };

    window.dispatchEvent = function (event: CustomEvent) {
        logger.info(() => `Event dispatched ${event}`);
    };

    return window.document;
}

export const DomTraceCategory = "SvelteNativeDom";

function initializeLogger() {
    logger.setHandler((message, level) => {
        let traceLevel = Trace.messageType.log;
        switch (level) {
            case LogLevel.Debug:
                traceLevel = Trace.messageType.log;
                break;
            case LogLevel.Info:
                traceLevel = Trace.messageType.info;
                break;
            case LogLevel.Warn:
                traceLevel = Trace.messageType.warn;
                break;
            case LogLevel.Error:
                traceLevel = Trace.messageType.error;
                break;
        }
        if (Trace.isEnabled() || traceLevel == Trace.messageType.error) {
            Trace.write(message(), DomTraceCategory, traceLevel);
        }
    });
}

let initializedDom = false;
export function initializeDom() {
    if ( initializedDom) {
        return;
    }
    initializedDom = true;
    initializeLogger();
    if (typeof __UI_USE_EXTERNAL_RENDERER__ != "undefined" &&  __UI_USE_EXTERNAL_RENDERER__) {
    } else {
        registerNativeElements();
    }
    registerSvelteElements();
    return installGlobalShims();
}
initializeDom();