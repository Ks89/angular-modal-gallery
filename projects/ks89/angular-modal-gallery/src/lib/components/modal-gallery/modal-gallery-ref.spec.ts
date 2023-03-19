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

import { inject, waitForAsync } from '@angular/core/testing';
import { OverlayRef } from '@angular/cdk/overlay';

import { ModalGalleryRef } from './modal-gallery-ref';
import { Image, ImageModalEvent } from '../../model/image.class';
import { Action } from '../../model/action.enum';
import { ButtonConfig, ButtonEvent, ButtonType } from '../../model/buttons-config.interface';
import { InternalLibImage } from '../../model/image-internal.class';

const IMAGES: Image[] = [
  new Image(0, {
    // modal
    img: '../assets/images/gallery/img1.jpg',
    extUrl: 'http://www.google.com'
  }),
  new Image(1, {
    // modal
    img: '../assets/images/gallery/img2.png',
    description: 'Description 2'
  }),
  new Image(
    2,
    {
      // modal
      img: '../assets/images/gallery/img3.jpg',
      description: 'Description 3',
      extUrl: 'http://www.google.com'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img3.png',
      title: 'custom title 2',
      alt: 'custom alt 2',
      ariaLabel: 'arial label 2'
    }
  ),
  new Image(3, {
    // modal
    img: '../assets/images/gallery/img4.jpg',
    description: 'Description 4',
    extUrl: 'http://www.google.com'
  }),
  new Image(
    4,
    {
      // modal
      img: '../assets/images/gallery/img5.jpg'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img5.jpg'
    }
  )
];

const ID: number = 1;

const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);

const BTNEVENT: ButtonEvent = {
  button: {
    type: ButtonType.CLOSE
  } as ButtonConfig,
  image: IMAGES[ID] as InternalLibImage,
  action: Action.NORMAL,
  galleryId: ID
};

class OverlayRefMock {
  dispose() {
  }
}

let ref: ModalGalleryRef = new ModalGalleryRef(new OverlayRefMock() as OverlayRef);

describe('ModalGalleryRef', () => {
  describe('#closeModal()', () => {
    it(`should call closeModal`, () => {
      ref.closeModal();
    });
  });

  describe('#emitClose()', () => {
    it(`should call emitClose`, () => {
      ref.close$.subscribe((event: ImageModalEvent) => {
        expect(EVENT).toEqual(event);
      });
      ref.emitClose(EVENT);
    });
  });

  describe('#emitShow()', () => {
    it(`should call emitShow`, () => {
      ref.show$.subscribe((event: ImageModalEvent) => {
        expect(EVENT).toEqual(event);
      });
      ref.emitShow(EVENT);
    });
  });

  describe('#emitFirstImage()', () => {
    it(`should call emitFirstImage`, () => {
      ref.firstImage$.subscribe((event: ImageModalEvent) => {
        expect(EVENT).toEqual(event);
      });
      ref.emitFirstImage(EVENT);
    });
  });

  describe('#emitLastImage()', () => {
    it(`should call emitLastImage`, () => {
      ref.lastImage$.subscribe((event: ImageModalEvent) => {
        expect(EVENT).toEqual(event);
      });
      ref.emitLastImage(EVENT);
    });
  });

  describe('#emitHasData()', () => {
    it(`should call emitHasData`, () => {
      ref.hasData$.subscribe((event: ImageModalEvent) => {
        expect(EVENT).toEqual(event);
      });
      ref.emitHasData(EVENT);
    });
  });

  describe('#emitButtonBeforeHook()', () => {
    it(`should call emitButtonBeforeHook`, () => {
      ref.buttonBeforeHook$.subscribe((event: ButtonEvent) => {
        expect(BTNEVENT).toEqual(event);
      });
      ref.emitButtonBeforeHook(BTNEVENT);
    });
  });

  describe('#emitButtonAfterHook()', () => {
    it(`should call emitButtonAfterHook`, () => {
      ref.buttonAfterHook$.subscribe((event: ButtonEvent) => {
        expect(BTNEVENT).toEqual(event);
      });
      ref.emitButtonAfterHook(BTNEVENT);
    });
  });
});
