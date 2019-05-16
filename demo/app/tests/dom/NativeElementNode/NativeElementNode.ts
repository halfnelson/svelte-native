// This file could be named index.ts, but it is a lame filename in editor's
// tab title, and we don't need it since this is grep'd by the test runner

import { createElement, NativeElementNode } from 'svelte-native/dom'

// Using a Child in a Parent's slot because svelte uses className in
// slots implementation
import Child from './className/Child.svelte'

describe('NativeElementNode', function () {
    describe('className', () => {
        let test_subject: NativeElementNode
        beforeEach(async function () {
            let el = createElement('fragment')
            let harness = new Child({ target: el })
            test_subject = (harness as any).test_subject
            assert.isNotNull(test_subject)
        })

        describe('class directive', () => {
            let cssClasses
            beforeEach(() => {
              cssClasses = (test_subject.nativeView as any).cssClasses
              assert.isNotNull(cssClasses)
            })

            it('sets constant class', function () {
                assert.isTrue(cssClasses.has('constClass'))
            })

            it('sets true class', function () {
                assert.isTrue(cssClasses.has('trueClass'))
            })

            it('does not set false class', function () {
                assert.isFalse(cssClasses.has('falseClass'))
            })
        })

        it('sets className', () => {
            const className = (test_subject.nativeView as any).className
            assert.equal(className, 'constClass trueClass')
        })
    })
});
