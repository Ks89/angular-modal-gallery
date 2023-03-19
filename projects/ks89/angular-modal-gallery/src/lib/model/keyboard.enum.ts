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
 * Enum `Keyboard` with keys and their relative codes.
 */
import { DOWN_ARROW_CODE, ESC_CODE, LEFT_ARROW_CODE, RIGHT_ARROW_CODE, UP_ARROW_CODE } from '../utils/user-input.util';

type Keyboard = Readonly<{
  ESC: typeof ESC_CODE,
  LEFT_ARROW: typeof LEFT_ARROW_CODE,
  RIGHT_ARROW: typeof RIGHT_ARROW_CODE,
  UP_ARROW: typeof UP_ARROW_CODE,
  DOWN_ARROW: typeof DOWN_ARROW_CODE
}>;

export const Keyboard: Keyboard = {
  ESC: ESC_CODE,
  LEFT_ARROW: LEFT_ARROW_CODE,
  RIGHT_ARROW: RIGHT_ARROW_CODE,
  UP_ARROW: UP_ARROW_CODE,
  DOWN_ARROW: DOWN_ARROW_CODE
};
