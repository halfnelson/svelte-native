import { Application, View } from '@nativescript/core';
import { navigate, ViewNode, createElement, initializeDom, FrameElement, NativeElementNode } from './dom';
import { DocumentNode } from './dom/basicdom';
import type {SvelteComponent} from './ambient.js';

// Override this function as the default is currently resetting entire content on NativeScript
global.__onLiveSyncCore = () => {
    Application.getRootView()?._onCssStateChange();
};

export function svelteNativeNoFrame<T>(rootElement: typeof SvelteComponent<T>, data: T): Promise<SvelteComponent<T>> {
    return new Promise((resolve, reject) => {

        let elementInstance: SvelteComponent;

        const buildElement = () => {
            let frag = createElement('fragment', window.document as unknown as DocumentNode);
            elementInstance = new rootElement({
                target: frag,
                props: data || {}
            })
            return (frag.firstChild as NativeElementNode<View>).nativeElement;
        }

        //wait for launch before returning
        Application.on(Application.launchEvent, () => {
            resolve(elementInstance);
        })
        Application.on(Application.exitEvent, () => {
            elementInstance.$destroy();
            elementInstance = null;
        })

        try {
            Application.run({ create: buildElement });
        } catch (e) {
            reject(e);
        }
    });
}

export function svelteNative<T>(startPage: typeof SvelteComponent<T>, data: T): Promise<SvelteComponent<T>> {
    let rootFrame: FrameElement; 
    let pageInstance: SvelteComponent;

    return new Promise((resolve, reject) => {
        //wait for launch
        Application.on(Application.launchEvent, () => {
            resolve(pageInstance);
        })
        Application.on(Application.exitEvent, () => {
            pageInstance.$destroy();
            pageInstance = null;
        })

        try {
            Application.run({ create: () => {
                rootFrame = createElement('frame', window.document as unknown as DocumentNode) as FrameElement;
                rootFrame.setAttribute("id", "app-root-frame");

                pageInstance = navigate({
                    page: startPage,
                    props: data || {},
                    frame: rootFrame
                })

                return rootFrame.nativeView;
            }});
        } catch (e) {
            reject(e);
        }
    });
}

// Svelte looks to see if window is undefined in order to determine if it is running on the client or in SSR.
// any imports of svelte/internals global also bind to the current value of window (during module import) so we need to 
// configure our dom now.
initializeDom()


export { navigate, goBack, showModal, closeModal, isModalOpened, initializeDom, DomTraceCategory } from "./dom"
