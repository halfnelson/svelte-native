import { NativeViewElementNode, createElement } from "svelte-native/dom";
import { TabStrip } from "@nativescript/core/ui";
import TabsHarness from './TabsHarness.svelte'
import { tick } from "svelte";

describe('TabStrip', async function () {
    let test_subject: NativeViewElementNode<TabStrip>;
    let harness: TabsHarness;
    before(async function () {
        console.log("0")
        let el = createElement('fragment');
        harness = new TabsHarness({ target: el as any });
        test_subject = (harness as any).tab_strip_subject;
        assert.isDefined(test_subject);
    })

    it('it assigns child tabstripitems to items property', function () {
        console.log("1")
        assert.isNotNull(test_subject.nativeView.items);
        assert.equal(test_subject.nativeView.items.length, 1);
        assert.equal(test_subject.nativeView.items[0].title, "tab button 1");
    })

    it('it assigns/removes revealed/hidden child to items property', async function () {
        console.log("2")
        try {
            assert.equal(test_subject.nativeView.items.length, 1);
            assert.equal(test_subject.nativeView.items[0].title, "tab button 1");
            harness.$set({ show_extra_tab: true });
            await tick();
            console.log("2.1")
            assert.equal(test_subject.nativeView.items.length, 2);
            assert.equal(test_subject.nativeView.items[0].title, "tab button 1");
            assert.equal(test_subject.nativeView.items[1].title, "extra tab button");
            //harness.$set({ show_extra_tab: false });
            //await tick();
            //console.log("2.2")
            //assert.equal(test_subject.nativeView.items.length, 1);
            //assert.equal(test_subject.nativeView.items[0].title, "tab button 1");
        } catch (e) {
            console.log(" *** ERROR *** ", e);
            assert.fail("blah")
        }
        console.log("2.3")
    })
})
