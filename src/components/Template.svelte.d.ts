import type { SvelteComponentTyped } from "svelte";
export default class AsComponent<T = any> extends SvelteComponentTyped<T> {
    $$prop_def: {
        key?: string;
    }
    $$slot_def: {
        item: T;
        default: any;
    }
}
