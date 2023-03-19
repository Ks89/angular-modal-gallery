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

/**
 * Interface `BreakpointsConfig` to configure responsive breakpoints as numbers to express pixels
 */
export interface BreakpointsConfig {
  xSmall: number;
  small: number;
  medium: number;
  large: number;
  xLarge: number;
}

/**
 * Interface `CarouselPreviewConfig` to configure carousel's previews
 */
export interface CarouselPreviewConfig {
  visible: boolean;
  number?: number;
  arrows?: boolean;
  clickable?: boolean;
  width?: string;
  // maxHeight is called in this way because it represents the maxHeight for users, however inside the code it's the height
  // I called maxHeight because it's handled in a complex way also with Breakpoints and I'm using Math.min like is it's the maxHeight instead of the height
  maxHeight?: string;
  breakpoints?: BreakpointsConfig;
}
