/*
 The MIT License (MIT)

 Copyright (C) 2017-2023 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { Size } from './size.interface';

/**
 * Interface `PlainGalleryConfig` to configure plain-gallery features.
 */
export interface PlainGalleryConfig {
  strategy: PlainGalleryStrategy;
  layout: PlainGalleryLayout;
  advanced?: AdvancedConfig;
}

/**
 * Interface `PlainGalleryLayout` to configure the layout. This interface isn't used directly, instead
 * refers to either `LineLayout`, `GridLayout`.
 */
// tslint:disable-next-line no-empty-interface
export interface PlainGalleryLayout {}

/**
 * Class `LineLayout` to configure a linear plain gallery.
 */
export class LineLayout implements PlainGalleryLayout {
  breakConfig: BreakConfig;
  justify: string;
  size: Size;

  constructor(size: Size, breakConfig: BreakConfig, justify: string) {
    this.size = size;
    this.breakConfig = breakConfig;
    this.justify = justify;
  }
}

/**
 * Class `GridLayout` to configure a grid plain gallery.
 */
export class GridLayout implements PlainGalleryLayout {
  breakConfig: BreakConfig;
  size: Size;

  constructor(size: Size, breakConfig: BreakConfig) {
    this.size = size;
    this.breakConfig = breakConfig;
  }
}

/**
 * Enum `PlainGalleryStrategy` to choose the behaviour of the plain gallery.
 */
export enum PlainGalleryStrategy {
  // don't use 0 here
  // the first index is 1 and all of the following members are auto-incremented from that point on
  ROW = 1,
  COLUMN,
  GRID,
  CUSTOM // full custom strategy
}

/**
 * Interface `BreakConfig` to limit the number of items of the plain gallery or to force it to fill other lines.
 */
export interface BreakConfig {
  length: number;
  wrap: boolean;
}

/**
 * Interface `AdvancedConfig` to use `<a>` tags instead of `<img>`.
 * It also contains a string property to customize the css background property.
 * For more info check here https://www.w3schools.com/cssref/css3_pr_background.asp
 */
export interface AdvancedConfig {
  aTags: boolean;
  additionalBackground: string;
}
