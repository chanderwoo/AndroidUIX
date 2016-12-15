/*
 * Copyright (C) 2006 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path="../../../android/text/TextPaint.ts"/>
///<reference path="../../../android/text/style/MetricAffectingSpan.ts"/>
///<reference path="../../../android/text/style/UpdateAppearance.ts"/>

module android.text.style {
    import TextPaint = android.text.TextPaint;
    import MetricAffectingSpan = android.text.style.MetricAffectingSpan;
    import UpdateAppearance = android.text.style.UpdateAppearance;
    /**
     * The classes that affect character-level text formatting extend this
     * class.  Most extend its subclass {@link MetricAffectingSpan}, but simple
     * ones may just implement {@link UpdateAppearance}.
     */
export abstract class CharacterStyle {
        static type = Symbol();
        mType = CharacterStyle.type;

        abstract updateDrawState(tp:TextPaint):void;

        /**
         * A given CharacterStyle can only applied to a single region of a given
         * Spanned.  If you need to attach the same CharacterStyle to multiple
         * regions, you can use this method to wrap it with a new object that
         * will have the same effect but be a distinct object so that it can
         * also be attached without conflict.
         */
        static wrap(cs:CharacterStyle):CharacterStyle {
            if (cs instanceof MetricAffectingSpan) {
                return new MetricAffectingSpan.Passthrough_MetricAffectingSpan(<MetricAffectingSpan> cs);
            } else {
                return new CharacterStyle.Passthrough_CharacterStyle(cs);
            }
        }

        /**
         * Returns "this" for most CharacterStyles, but for CharacterStyles
         * that were generated by {@link #wrap}, returns the underlying
         * CharacterStyle.
         */
        getUnderlying():CharacterStyle {
            return this;
        }


    }

    export module CharacterStyle {
        /**
         * A Passthrough CharacterStyle is one that
         * passes {@link #updateDrawState} calls through to the
         * specified CharacterStyle while still being a distinct object,
         * and is therefore able to be attached to the same Spannable
         * to which the specified CharacterStyle is already attached.
         */
        export class Passthrough_CharacterStyle extends CharacterStyle {

            private mStyle:CharacterStyle;

            /**
             * Creates a new Passthrough of the specfied CharacterStyle.
             */
            constructor(cs:CharacterStyle) {
                super();
                this.mStyle = cs;
            }

            /**
             * Passes updateDrawState through to the underlying CharacterStyle.
             */
            updateDrawState(tp:TextPaint):void {
                this.mStyle.updateDrawState(tp);
            }

            /**
             * Returns the CharacterStyle underlying this one, or the one
             * underlying it if it too is a Passthrough.
             */
            getUnderlying():CharacterStyle {
                return this.mStyle.getUnderlying();
            }
        }
    }

}