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

import { ClickOutsideDirective } from './click-outside.directive';
import { SizeDirective } from './size.directive';
import { KeyboardNavigationDirective } from './keyboard-navigation.directive';
import { WrapDirective } from './wrap.directive';
import { DirectionDirective } from './direction.directive';
import { ATagBgImageDirective } from './a-tag-bg-image.directive';
import { DescriptionDirective } from './description.directive';
import { MarginDirective } from './margin.directive';
import { MaxSizeDirective } from './max-size.directive';
import { FallbackImageDirective } from './fallback-image.directive';
import { SwipeDirective } from './swipe.directive';

/**
 * Array of all directives.
 */
export const DIRECTIVES = [
  ClickOutsideDirective,
  SizeDirective,
  KeyboardNavigationDirective,
  WrapDirective,
  DirectionDirective,
  ATagBgImageDirective,
  DescriptionDirective,
  MarginDirective,
  MaxSizeDirective,
  FallbackImageDirective,
  SwipeDirective
];
