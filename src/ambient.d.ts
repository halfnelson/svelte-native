export class SvelteComponent<T = any> {
    $destroy(): void;
    constructor(options: ComponentConstructorOptions<T>);
    $set(props: Partial<T>): void;
}
const _SvelteComponent = SvelteComponent;
declare global {
    var SvelteComponent: typeof _SvelteComponent
    interface SvelteComponent<T = any> extends InstanceType<typeof SvelteComponent<T>> { }
}
declare module "*.svelte" {
    var SvelteComponent: typeof _SvelteComponent
    interface SvelteComponent<T = any> extends InstanceType<typeof SvelteComponent<T>> { }
    export interface ComponentConstructorOptions<T> {
        target?: ViewNode | Element;
        props?: T;
        anchor?: ViewNode | Element;
        intro?: boolean;
    }
}