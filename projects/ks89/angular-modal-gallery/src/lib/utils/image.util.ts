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

import { Image } from '../model/image.class';

/**
 * Utility function to get the index of the input `image` from `arrayOfImages`
 * @param Image image to get the index. The image 'id' must be a number >= 0
 * @param Image[] arrayOfImages to search the image within it
 * @returns number the index of the image. -1 if not found.
 * @throws an Error if either image or arrayOfImages are not valid,
 *  or if the input image doesn't contain an 'id', or the 'id' is < 0
 */
export function getIndex(image: Image, arrayOfImages: Image[]): number {
  if (!image) {
    throw new Error('image must be a valid Image object');
  }

  if (!arrayOfImages) {
    throw new Error('arrayOfImages must be a valid Image[]');
  }

  if (!image.id && image.id !== 0) {
    // id = 0 is admitted
    throw new Error(`A numeric Image 'id' is mandatory`);
  }

  if (image.id < 0) {
    throw new Error(`Image 'id' must be >= 0`);
  }

  return arrayOfImages.findIndex((val: Image) => val.id === image.id);
}
