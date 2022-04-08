import { Application } from '@nativescript/core'
import { navigate, ViewNode, createElement, initializeDom, FrameElement, NativeElementNode } from './dom';
import { View } from '@nativescript/core';
import { DocumentNode } from './dom/basicdom';

declare global {
    export class SvelteComponent {
        $destroy(): void;
        constructor(options: { target?: ViewNode | Element , props?: any, anchor?: ViewNode | Element, intro?: boolean });
        $set(props: any): void;
    }
    interface Svelte2TsxComponentConstructorParameters<T> {
        target?: ViewNode | Element;
        props?: T;
        anchor?: ViewNode | Element;
        intro?: boolean;
    }
}

export function svelteNativeNoFrame(rootElement: typeof SvelteComponent, data: any): Promise<SvelteComponent> {
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

        try {
            Application.run({ create: buildElement });
        } catch (e) {
            reject(e);
        }
    });
}

export function svelteNative(startPage: typeof SvelteComponent, data: any): Promise<SvelteComponent> {
    let rootFrame: FrameElement; 
    let pageInstance: SvelteComponent;

    return new Promise((resolve, reject) => {
        //wait for launch
        Application.on(Application.launchEvent, () => {
            resolve(pageInstance);
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
