import { Animation, AnimationDefinition, CubicBezierAnimationCurve, Pair } from "@nativescript/core/ui/animation";
import { AnimationCurve } from "@nativescript/core/ui/enums";
import { ease_in, ease_out, ease, linear, ease_in_out, animation_curve, normalizeCurve, partialCurveFrom, reverseCurve, CubicBezier } from "./bezier"
import { Color } from "@nativescript/core/color";
import * as easings from './easing'
import { NativeViewElementNode } from "../dom";
import { View } from "@nativescript/core/ui/core/view/view";


enum AnimationDirection { Unknown, In, Out }


export interface NativeAnimationDefinition {
    opacity?: number;
    backgroundColor?: Color;
    translate?: Pair;
    scale?: Pair;
    rotate?: number;
}


export function asSvelteTransition(node: NativeViewElementNode<View>, delay: number = 0, duration: number = 300, curve: string | CubicBezierAnimationCurve = AnimationCurve.linear, nativeAnimationProps: (t: number) => NativeAnimationDefinition) {

    let svelteAnim: any = {
        delay: delay,
        duration: duration,
    }

    let svelteCurve: CubicBezier;

    if (typeof curve == "string") {
        switch (curve) {
            case AnimationCurve.ease: svelteCurve = ease; break;
            case AnimationCurve.easeIn: svelteCurve = ease_in; break;
            case AnimationCurve.easeOut: svelteCurve = ease_out; break;
            case AnimationCurve.easeInOut: svelteCurve = ease_in_out; break;
            case AnimationCurve.linear: svelteCurve = linear; break;
            default:
                console.warn("Unsupported nativescript animation name, reverting to linear")
                svelteCurve = linear;
        }
    }

    if (curve instanceof CubicBezierAnimationCurve) {
        //convert to our bezier format
        svelteCurve = animation_curve(curve.x1, curve.y1, curve.x2, curve.y2);
    }

    //default to linear
    if (!curve) {
        svelteCurve = linear
    }

    let direction = AnimationDirection.Unknown
    let animation: Animation = null;
    let last_t = -1;

    const cancelNativeAnimation = () => {
        if (animation && animation.isPlaying) {
            //  console.log("cancelling animation on ", node);
            let oldanimation = animation;
            animation = null;
            oldanimation.cancel();
        }
        animation = null;
    }

    //Tick is our hook into sveltes transition system. We want to detect a forward or backward animation,
    //determine the end value, and do a single native animation for the entire duration.
    //the spanner in the works is that there is a transistion type (in_out) that can stop mid animation and play in reverse
    //we need to do some math to generate a curve that can apply to the shortened time that mirrors the intro that has already played.


    // we note the following svelte behaviour:
    // "in" animations always get an explicit tick(0, 1) even before any delay.
    // "out" animations have no such quality, therefore we can expect that if we have not been initialized, and get a t=0 we are an Intro

    svelteAnim.tick = (t: number) => {

        //when you cancel an animation, it appears to set the values back to the start. we use this to reapply them at the given time.
        function applyAnimAtTime(time: number) {
            let animDef = nativeAnimationProps(time);
            if (typeof animDef.opacity !== 'undefined') node.nativeView.opacity = animDef.opacity;
            if (typeof animDef.backgroundColor != 'undefined') node.nativeView.backgroundColor = animDef.backgroundColor;
            if (typeof animDef.rotate != 'undefined') node.nativeView.rotate = animDef.rotate;
            if (typeof animDef.scale != 'undefined') {
                node.nativeView.scaleX = animDef.scale.x;
                node.nativeView.scaleY = animDef.scale.y;
            }
            if (typeof animDef.translate != 'undefined') {
                node.nativeView.translateX = animDef.translate.x;
                node.nativeView.translateY = animDef.translate.y;
            }
        }

        //our first frame! are we an in or out
        if (direction == AnimationDirection.Unknown) {
            //intro: do an initialize
            if (t === 0) {
                applyAnimAtTime(0);
                direction = AnimationDirection.In
                last_t = 0;
                //   console.log("forward animation detected!", node);
                //don't start our full animation yet since this is just the init frame, and there will be a delay. so wait for next frame
                return;
            } else {
                //we must be an outro since all intros get a t==0
                //  console.log("reverse animation detected!", node);
                direction = AnimationDirection.Out
                last_t = t;
            }
        }

        //have we changed direction?
        if (direction == AnimationDirection.In && last_t > t) {
            // console.log("animation changed direction (In -> Out)", t, node);
            direction = AnimationDirection.Out
            cancelNativeAnimation();
            applyAnimAtTime(t);
        }
        if (direction == AnimationDirection.Out && last_t < t) {
            //    console.log("animation changed direction (Out -> In)", t, node);
            direction = AnimationDirection.In
            cancelNativeAnimation();
            applyAnimAtTime(t);
        }
        last_t = t;

        if (!animation) {
            //create a new animation that will cover us from now to either t=duration or t=0
            let target_t = (direction == AnimationDirection.In) ? 1 : 0;
            let animProps = nativeAnimationProps(target_t)
            let nsAnimation: AnimationDefinition = { ...animProps }
            nsAnimation.delay = 0;
            if (direction == AnimationDirection.Out) {
                //we need to play in reverse, and we might not be playing the whole thing
                let forwardCurve = t == 1 ? svelteCurve : partialCurveFrom(svelteCurve, 0, t)
                let finalCurve = normalizeCurve(reverseCurve(forwardCurve));
                nsAnimation.curve = AnimationCurve.cubicBezier(finalCurve.x1, finalCurve.y1, finalCurve.x2, finalCurve.y2);
                nsAnimation.duration = t * duration;
            } else {
                //we might be starting from halfway (intro->outro-intro again)
                let forwardCurve = t == 0 ? svelteCurve : partialCurveFrom(svelteCurve, t, 1)
                let finalCurve = normalizeCurve(forwardCurve);
                nsAnimation.curve = AnimationCurve.cubicBezier(finalCurve.x1, finalCurve.y1, finalCurve.x2, finalCurve.y2);
                nsAnimation.duration = (1 - t) * duration;
            }
            //console.log("animation created", t, (direction == AnimationDirection.In) ? "Intro" : "Outro", nsAnimation, node);
            // kick it off
            animation = node.nativeView.createAnimation(nsAnimation);
            animation.play();
        }
    }

    return svelteAnim;
}

/* ported from svelte transitions */

export function fade(node: NativeViewElementNode<View>, {
    delay = 0,
    duration = 400
}) {
    const o = node.nativeView.opacity;
    return asSvelteTransition(node, delay, duration, AnimationCurve.linear,
        (t) => ({
            opacity: t * o
        })
    );
}

export function fly(node: NativeViewElementNode<View>, {
    delay = 0,
    duration = 400,
    easing = AnimationCurve.easeOut,
    x = 0,
    y = 0
}) {
    const opacity = node.nativeView.opacity;
    const translateX = node.nativeView.translateX;
    const translateY = node.nativeView.translateY;

    return asSvelteTransition(node, delay, duration, easing,
        (t) => ({
            opacity: t * opacity,
            translate: {
                x: translateX + (1 - t) * x,
                y: translateY + (1 - t) * y
            }
        })
    );
}

export function slide(node: NativeViewElementNode<View>, {
    delay = 0,
    duration = 400,
    easing = AnimationCurve.easeOut
}) {

    const height = node.nativeView.effectiveHeight;
    const scaleX = node.nativeView.scaleX;
    const scaleY = node.nativeView.scaleY;
    const translateX = node.nativeView.translateX;
    const translateY = node.nativeView.translateY;

    return asSvelteTransition(node, delay, duration, easing,
        t => ({
            scale: {
                x: scaleX,
                y: (1 - t) * scaleY
            },
            translate: {
                x: translateX,
                y: translateY - t * 0.05 * height
            }
        })
    );
}


export { easings }