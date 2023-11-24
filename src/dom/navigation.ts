import { ViewBase, View, NavigatedData, NavigationTransition, Frame, BackstackEntry } from "@nativescript/core";
import FrameElement from "./native/FrameElement";
import { createElement, DocumentNode, logger as log } from "./basicdom";
import PageElement from "./native/PageElement";
import NativeViewElementNode from "./native/NativeViewElementNode";
import { getRootView } from "@nativescript/core/application";
import { _rootModalViews } from "@nativescript/core/ui/core/view";

export type ViewSpec = View | NativeViewElementNode<View>
export type FrameSpec = Frame | FrameElement | string
export type PageSpec<T> = typeof SvelteComponent<T>;
export interface NavigationOptions<T> {
    page: PageSpec<T>;
    props?: T;
    frame?: FrameSpec;

    animated?: boolean;
    backstackVisible?: boolean;
    clearHistory?: boolean;
    transition?: NavigationTransition;
    transitionAndroid?: NavigationTransition;
    transitioniOS?: NavigationTransition;
}

function resolveFrame(frameSpec: FrameSpec): Frame {
    let targetFrame: Frame;
    if (!frameSpec) targetFrame = Frame.topmost();
    if (frameSpec instanceof FrameElement) targetFrame = frameSpec.nativeView as Frame;
    if (frameSpec instanceof Frame) targetFrame = frameSpec;
    if (typeof frameSpec == "string") {
        targetFrame = Frame.getFrameById(frameSpec)
        if (!targetFrame) log.error(() => `Navigate could not find frame with id ${frameSpec}`)
    }
    return targetFrame;
}

function resolveTarget(viewSpec: ViewSpec): View {
    if (viewSpec instanceof View)  {
        return viewSpec;
    }
    return viewSpec?.nativeView;
}

interface ComponentInstanceInfo<T = any> { element: NativeViewElementNode<View>, pageInstance: SvelteComponent<T> }

function resolveComponentElement<T>(pageSpec: PageSpec<T>, props?: T): ComponentInstanceInfo<T> {
    let dummy = createElement('fragment', window.document as unknown as DocumentNode);
    let pageInstance = new pageSpec({ target: dummy, props: props });
    let element = dummy.firstElement() as NativeViewElementNode<View>;
    return { element, pageInstance }
}

export function navigate<T>(options: NavigationOptions<T>): SvelteComponent<T> {
    let { frame, page, props = {}, ...navOptions } = options;

    let targetFrame = resolveFrame(frame);

    if (!targetFrame) {
        throw new Error("navigate requires frame option to be a native Frame, a FrameElement, a frame Id, or null");
    }
    if (!page) {
        throw new Error("navigate requires page to be set to the svelte component class that implements the page or reference to a page element");
    }

    let { element, pageInstance } = resolveComponentElement(page, props);

    if (!(element instanceof PageElement))
        throw new Error("navigate requires a svelte component with a page element at the root");

    let nativePage = element.nativeView;

    const handler = (args: NavigatedData) => {
        if (args.isBackNavigation) {
            // we need to delay because it could create a crash in N as $destroy()
            // will remove all set `navigatedFrom` while we are enumerating to actually send them
            setTimeout(() => {
                nativePage.off('navigatedFrom', handler);
                pageInstance.$destroy();
            }, 0);
        }
    };

    // This is used by svelte-hmr to register navigate-from handler to new native view upon hot module reload
    (nativePage as any).__navigateFromHandler = handler;

    nativePage.on('navigatedFrom', handler);

    targetFrame.navigate({
        ...navOptions,
        create: () => nativePage
    });

    return pageInstance;
}

export interface BackNavigationOptions {
    frame?: FrameSpec;
    to?: PageElement;
}

export function goBack(options: BackNavigationOptions = {}) {
    let targetFrame = resolveFrame(options.frame);
    if (!targetFrame) {
        throw new Error("goback requires frame option to be a native Frame, a FrameElement, a frame Id, or null")
    }
    let backStackEntry: BackstackEntry = null;
    if (options.to) {
        backStackEntry = targetFrame.backStack.find(e => e.resolvedPage === options.to.nativeView);
        if (!backStackEntry) {
            throw new Error("Couldn't find the destination page in the frames backstack")
        }
    }
    return targetFrame.goBack(backStackEntry);
}

export interface ShowModalOptions<T> {
    page: PageSpec<T>
    target?: ViewSpec
    props?: T
    android?: { cancelable: boolean }
    ios?: { presentationStyle: any }
    animated?: boolean
    fullscreen?: boolean
    stretched?: boolean
}

// export const modalStack: ComponentInstanceInfo[] = []

export function showModal<T, U>(modalOptions: ShowModalOptions<U>): Promise<T> {
    let { page, props = {}, target, ...options } = modalOptions;

    let modalLauncher = resolveTarget(target) || getRootView();

    let componentInstanceInfo = resolveComponentElement(page, props);
    let modalView: ViewBase = componentInstanceInfo.element.nativeView;

    return new Promise((resolve, reject) => {

        let resolved = false;
        const closeCallback = (result: T) => {
            if (resolved) return;
            // modalStack.pop();
            resolved = true;
            try {
                componentInstanceInfo.pageInstance.$destroy(); //don't let an exception in destroy kill the promise callback
            } finally {
                resolve(result);
            }
        }
        // modalStack.push(componentInstanceInfo);
        modalLauncher.showModal(modalView, { ...options, context: {}, closeCallback })
    });
}

export function closeModal(result: any, parent?: View): void {
    // let modalPageInstanceInfo = modalStack[modalStack.length-1];
    console.log('closeModal', parent, _rootModalViews[_rootModalViews.length-1]);
    (parent || _rootModalViews[_rootModalViews.length-1]).closeModal(result);
}

export function isModalOpened() {
    return _rootModalViews.length > 0;
}
