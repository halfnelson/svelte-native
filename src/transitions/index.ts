import { CubicBezierAnimationCurve, Pair } from "@nativescript/core/ui/animation";
import { CoreTypes, Trace } from "@nativescript/core";
import { Animation, AnimationDefinition, Color, View } from "@nativescript/core";

import { ease_in, ease_out, ease, linear, ease_in_out, animation_curve, normalizeCurve, partialCurveFrom, reverseCurve, CubicBezier } from "./bezier"
import * as easings from './easing'
import { NativeViewElementNode } from "../dom";


enum AnimationDirection { Unknown, In, Out }


export interface NativeAnimationDefinition {
    opacity?: number;
    backgroundColor?: Color;
    translate?: Pair;
    scale?: Pair;
    rotate?: number;
}


export function asSvelteTransition(node: NativeViewElementNode<View>, delay: number = 0, duration: number = 300, curve: string | CubicBezierAnimationCurve = CoreTypes.AnimationCurve.linear, nativeAnimationProps: (t: number) => NativeAnimationDefinition, applyNativeAnimationProps?: (view:View, def:NativeAnimationDefinition) => void) {

    let svelteAnim: any = {
        delay: delay,
        duration: duration,
    }

    let svelteCurve: CubicBezier;

    if (typeof curve == "string") {
        switch (curve) {
            case CoreTypes.AnimationCurve.ease: svelteCurve = ease; break;
            case CoreTypes.AnimationCurve.easeIn: svelteCurve = ease_in; break;
            case CoreTypes.AnimationCurve.easeOut: svelteCurve = ease_out; break;
            case CoreTypes.AnimationCurve.easeInOut: svelteCurve = ease_in_out; break;
            case CoreTypes.AnimationCurve.linear: svelteCurve = linear; break;
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
            const view  = node.nativeView;
            view._batchUpdate(()=>{
                let animDef = nativeAnimationProps(time);
                if (applyNativeAnimationProps) {
                    applyNativeAnimationProps(view, animDef)
                } else {
                    Object.keys(animDef).forEach(k => {
                        //@ts-ignore
                        const value = animDef[k];
                        switch(k) {
                            case 'scale':
                            view.scaleX = value.scale.x;
                            view.scaleY = value.scale.y;
                            break;
                            case 'translate':
                            view.translateX = value.translate.x;
                            view.translateY = value.translate.y;
                            break;
                            default:
                            //@ts-ignore
                            (view.style || view)[k] = value;
                            break;
                        }
                    })
                }
            });
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
                // return;
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
            if (!node.nativeView.nativeViewProtected) {
                applyAnimAtTime(target_t);
                return;
            }
            let animProps = nativeAnimationProps(target_t);
            let nsAnimation: AnimationDefinition = { ...animProps }
            nsAnimation.delay = 0;
            if (direction == AnimationDirection.Out) {
                //we need to play in reverse, and we might not be playing the whole thing
                let forwardCurve = t == 1 ? svelteCurve : partialCurveFrom(svelteCurve, 0, t)
                let finalCurve = normalizeCurve(reverseCurve(forwardCurve));
                nsAnimation.curve = CoreTypes.AnimationCurve.cubicBezier(finalCurve.x1, finalCurve.y1, finalCurve.x2, finalCurve.y2);
                nsAnimation.duration = t * duration;
            } else {
                //we might be starting from halfway (intro->outro-intro again)
                let forwardCurve = t == 0 ? svelteCurve : partialCurveFrom(svelteCurve, t, 1)
                let finalCurve = normalizeCurve(forwardCurve);
                nsAnimation.curve = CoreTypes.AnimationCurve.cubicBezier(finalCurve.x1, finalCurve.y1, finalCurve.x2, finalCurve.y2);
                nsAnimation.duration = (1 - t) * duration;
            }
            //console.log("animation created", t, (direction == AnimationDirection.In) ? "Intro" : "Outro", nsAnimation, node);
            // kick it off
            animation = node.nativeView.createAnimation(nsAnimation);
            function animateBlock() {
                try {
                    animation.play();
                } catch (error) {
                    if (Trace.isEnabled()) {
                        Trace.error(error);
                    }
                }
            }
            if(direction == AnimationDirection.Out) {
                animateBlock();
            } else {
                //we use setTimeout to ensure transition works if triggered
                //with a suspend animation block like CollectionView item update
                //we dont do it in out or view might already be unloaded
                setTimeout(() => {
                    animateBlock();
                }, 0);
            }
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
    return asSvelteTransition(node, delay, duration, CoreTypes.AnimationCurve.linear,
        (t) => ({
            opacity: t * o
        })
    );
}

export function fly(node: NativeViewElementNode<View>, {
    delay = 0,
    duration = 400,
    easing = CoreTypes.AnimationCurve.easeOut,
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
    easing = CoreTypes.AnimationCurve.easeOut
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
                y: t * scaleY
            },
            translate: {
                x: translateX,
                y: translateY - t * 0.5 * height
            }
        })
    );
}


export { easings }