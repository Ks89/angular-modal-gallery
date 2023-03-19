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
import { getIndex } from './image.util';

const imagesMock: Image[] = [
  new Image(0, {
    img: '../assets/images/gallery/img1.jpg'
  }),
  new Image(2, {
    img: '../assets/images/gallery/img2.jpg'
  }),
  new Image(1, {
    img: '../assets/images/gallery/img3.jpg'
  }),
  new Image(3, {
    img: '../assets/images/gallery/img4.jpg'
  })
];

const imagesMockEqualIds: Image[] = [
  new Image(1, {
    img: '../assets/images/gallery/img1.jpg'
  }),
  new Image(1, {
    img: '../assets/images/gallery/img2.jpg'
  }),
  new Image(1, {
    img: '../assets/images/gallery/img3.jpg'
  }),
  new Image(1, {
    img: '../assets/images/gallery/img4.jpg'
  })
];

const imgToSearchFirst: Image = new Image(0, {img: 'source'});
const imgToSearchLast: Image = new Image(3, {img: 'source'});
const imgToSearch: Image = new Image(1, {img: 'source'});
const imgToSearchHigh: Image = new Image(2000, {img: 'source'});

const imgToSearchNegative: Image = new Image(-2, {img: 'source'});

const NOT_FOUND = -1;

describe('image.util', () => {

  describe('#getIndex()', () => {

    it('should find the image obtaining its index', () => {
      const firstIndex: number = getIndex(imgToSearchFirst, imagesMock);
      const lastIndex: number = getIndex(imgToSearchLast, imagesMock);
      const index: number = getIndex(imgToSearch, imagesMock);
      expect(firstIndex).toBe(0);
      expect(lastIndex).toBe(imagesMock.length - 1);
      expect(index).toBe(2);
    });

    it('should find the first image obtaining its index from an array with all the same ids', () => {
      const index: number = getIndex(imgToSearch, imagesMockEqualIds);
      expect(index).toBe(0);
    });

    it(`shouldn't find the image, so the result index will be -1`, () => {
      const indexHigh: number = getIndex(imgToSearchHigh, imagesMock);
      expect(indexHigh).toBe(NOT_FOUND);
    });

    it(`should throw an error, because the input image is not valid`, () => {
      // @ts-ignore
      expect(() => getIndex(null, imagesMock)).toThrowError(`image must be a valid Image object`);
    });

    it(`should throw an error, because the input array of images is not valid`, () => {
      // @ts-ignore
      expect(() => getIndex(imgToSearch, null)).toThrowError(`arrayOfImages must be a valid Image[]`);
    });

    it(`should throw an error, because the input image hasn't an id`, () => {
      expect(() => getIndex({modal: {img: ''}} as Image, imagesMock)).toThrowError(`A numeric Image 'id' is mandatory`);
    });

    it(`should throw an error, because the Image id must be >= 0`, () => {
      expect(() => getIndex(imgToSearchNegative, imagesMock)).toThrowError(`Image 'id' must be >= 0`);
    });

  });
});
