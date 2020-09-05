import { createElement, TabsElement, NativeViewElementNode } from 'svelte-native/dom'
import { tick } from 'svelte';
import TabsHarness from './TabsHarness.svelte'


describe('Tabs', function () {
    let test_subject: TabsElement;
    let harness: TabsHarness;
    before(async function () {
        console.log("3i");
        let el = createElement('fragment');
        try {
            harness = new TabsHarness({ target: el as any });
        } catch (e) {
            console.log(e);
            assert.fail("Error creating tab harness");
        }
        console.log("3j");
        test_subject = (harness as any).test_subject
        assert.isDefined(test_subject);
    })

    it('it assigns child tabstrip to tabstrip property', function () {
        console.log("3")
        assert.isNotNull(test_subject.nativeView.tabStrip);
    })

    it('it assigns child tabcontentitems to items property', function () {
        console.log("4")
        assert.isNotNull(test_subject.nativeView.items);
        assert.equal(test_subject.nativeView.items.length, 1);

    })

    it('has the right content showing', function () {
        console.log("5")
        let content = (test_subject.nativeView.items[0]).content;
        assert.isNotNull(content);
        assert.equal((content as any).text, "tab content 1");
    });

    it('it assigns/removes revealed/hidden child tabcontentitems to items property', async function () {
        console.log("6")
        assert.equal(test_subject.nativeView.items.length, 1);
        harness.$set({ show_extra_tab: true });
        await tick();
        assert.equal(test_subject.nativeView.items.length, 2);
        harness.$set({ show_extra_tab: false });
        await tick();
        assert.equal(test_subject.nativeView.items.length, 1);
    })
});



