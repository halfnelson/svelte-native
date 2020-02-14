import { ItemEventData, ItemsSource } from '@nativescript/core/ui/list-view';
import { View } from '@nativescript/core/ui/core/view';
import { NativeViewElementNode, TemplateElement, ViewNode, createElement, logger, registerElement } from 'svelte-native/dom';
import { flush } from 'svelte/internal';
import { CollectionView } from 'nativescript-collectionview';
import { profile } from '@nativescript/core/profiling';

class SvelteKeyedTemplate {
    _key: string;
    _templateEl: TemplateElement;
    constructor(key: string, templateEl: TemplateElement) {
        this._key = key;
        this._templateEl = templateEl;
    }
    get component() {
        return this._templateEl.component;
    }
    get key() {
        return this._key;
    }
    createView() {
        // create a proxy element to eventually contain our item (once we have one to render)
        // TODO is StackLayout the best choice here?
        // logger.debug(`creating view for key ${this.key}`);
        const wrapper = createElement('StackLayout') as NativeViewElementNode<View>;

        const nativeEl = wrapper.nativeView;

        (nativeEl as any).__SvelteComponentBuilder__ = profile('__SvelteComponentBuilder__', props => {
            (nativeEl as any).__SvelteComponent__ = new this.component({
                target: wrapper,
                props
            });
        });
        return nativeEl;
    }
}

export default class CollectionViewViewElement extends NativeViewElementNode<CollectionView> {
    constructor() {
        super('collectionview', CollectionView);
        const nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType: any): View => this.loadView(viewType);
        this.nativeView.on(CollectionView.itemLoadingEvent, this.updateListItem, this);
    }

    private loadView(viewType: string): View {
        if (Array.isArray(this.nativeElement.itemTemplates)) {
            const keyedTemplate = this.nativeElement.itemTemplates.find(t => t.key === 'default');
            if (keyedTemplate) {
                return keyedTemplate.createView();
            }
        }

        const componentClass = this.getComponentForView(viewType);
        if (!componentClass) return null;

        const wrapper = createElement('StackLayout') as NativeViewElementNode<View>;
        const nativeEl = wrapper.nativeView;

        const builder = (props: any) => {
            (nativeEl as any).__SvelteComponent__ = new componentClass({
                target: wrapper,
                props
            });
        };
        (nativeEl as any).__SvelteComponentBuilder__ = builder;
        return nativeEl;
    }

    // For some reason itemTemplateSelector isn't defined as a "property" on radListView, so when we set the property, it is lowercase (due to svelte's forced downcasing)
    // we intercept and fix the case here.
    setAttribute(fullkey: string, value: any): void {
        if (fullkey.toLowerCase() === 'itemtemplateselector') {
            fullkey = 'itemTemplateSelector';
        }
        super.setAttribute(fullkey, value);
    }

    private getComponentForView(viewType: string) {
        const normalizedViewType = viewType.toLowerCase();

        const templateEl = this.childNodes.find(n => n.tagName === 'template' && String(n.getAttribute('type')).toLowerCase() === normalizedViewType) as any;
        if (!templateEl) return null;
        return templateEl.component;
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        super.onInsertedChild(childNode, index);
        if (childNode instanceof TemplateElement) {
            const key = childNode.getAttribute('key') || 'default';
            const templates = !this.nativeView.itemTemplates || typeof this.nativeView.itemTemplates === 'string' ? [] : (this.nativeView.itemTemplates as any[]);
            this.nativeView.itemTemplates = templates.concat([new SvelteKeyedTemplate(key, childNode)]);
        }
    }

    onRemovedChild(childNode: ViewNode) {
        super.onRemovedChild(childNode);
        if (childNode instanceof TemplateElement) {
            const key = childNode.getAttribute('key') || 'default';
            if (this.nativeView.itemTemplates && typeof this.nativeView.itemTemplates !== 'string') {
                this.nativeView.itemTemplates = this.nativeView.itemTemplates.filter(t => t.key !== key);
            }
        }
    }
    private updateListItem(args: ItemEventData & { bindingContext }) {
        const _view = args.view as any;
        const props = { item: args.bindingContext };
        const componentInstance = _view.__SvelteComponent__;
        if (!componentInstance) {
            if (_view.__SvelteComponentBuilder__) {
                _view.__SvelteComponentBuilder__(props);
                _view.__SvelteComponentBuilder__ = null;
            }
        } else {
            // console.log('updateListItem', args.index, props.item);
            componentInstance.$set(props);
            flush(); // we need to flush to make sure update is applied right away
        }
    }

    static register() {
        registerElement('collectionview', () => new CollectionViewViewElement());
    }
}
