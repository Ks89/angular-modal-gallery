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

import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';

import { ModalGalleryService } from './modal-gallery.service';
import { ConfigService } from '../../services/config.service';
import { Image, ImageModalEvent } from '../../model/image.class';
import { ModalGalleryRef } from './modal-gallery-ref';
import { Action } from '../../model/action.enum';
import { KeyboardService } from '../../services/keyboard.service';
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

describe('ModalGalleryService', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: ModalGalleryService,
            useClass: ModalGalleryService
          },
          {
            provide: ConfigService,
            useClass: ConfigService
          },
          {
            provide: Overlay,
            useClass: Overlay
          },
          {
            provide: KeyboardService,
            useValue: jasmine.createSpyObj('KeyboardService', ['reset'])
          }
        ]
      });
    })
  );

  it('should instantiate service when inject service',
    inject([ModalGalleryService], (service: ModalGalleryService) => {
      expect(service instanceof ModalGalleryService).toEqual(true);
    })
  );

  describe('#open()', () => {
    describe('---YES---', () => {
      it(`should call open and return a ModalGalleryRef instance`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ref: ModalGalleryRef | undefined = service.open({
            id: 1,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();
        })
      );
    });
  });

  describe('#updateModalImages()', () => {
    it(`should call updateModalImages`,
      inject([ModalGalleryService], (service: ModalGalleryService) => {
        service.updateImages$.subscribe((images: Image[]) => {
          expect(images).toEqual(IMAGES);
        });
        service.updateModalImages(IMAGES);
      })
    );
  });

  describe('#emitClose()', () => {
    describe('---YES---', () => {
      it(`should call close with clickOutside=false`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();
          // the close
          service.close(ID, false);
        })
      );

      it(`should call close with clickOutside=true`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();
          // the close
          service.close(ID, true);
        })
      );
    });

    describe('---NO---', () => {
      it(`should call close without calling open before with clickOutside=false`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          // the close
          service.close(ID, false);
        })
      );

      // aggiungere caso clickOutside e libConfig.enableCloseOutside

      it(`should call close without calling open before with clickOutside=true`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          // the close
          service.close(ID, true);
        })
      );
    });
  });

  describe('#emitClose()', () => {
    describe('---YES---', () => {
      it(`should call emitClose`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);

          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();

          (ref as ModalGalleryRef).close$.subscribe((event: ImageModalEvent) => {
            expect(EVENT).toEqual(event);
          });

          service.emitClose(EVENT);
        })
      );
    });

    describe('---NO---', () => {
      it(`shouldn't call emitClose because gallery is closed`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);
          // don't trigger event
          service.emitClose(EVENT);
        })
      );
    });
  });

  describe('#emitShow()', () => {
    describe('---YES---', () => {
      it(`should call emitShow`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);

          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();

          (ref as ModalGalleryRef).show$.subscribe((event: ImageModalEvent) => {
            expect(EVENT).toEqual(event);
          });

          service.emitShow(EVENT);
        })
      );
    });

    describe('---NO---', () => {
      it(`shouldn't call emitShow because gallery is closed`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);
          // don't trigger event
          service.emitShow(EVENT);
        })
      );
    });
  });

  describe('#emitFirstImage()', () => {
    describe('---YES---', () => {
      it(`should call emitFirstImage`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);

          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();

          (ref as ModalGalleryRef).firstImage$.subscribe((event: ImageModalEvent) => {
            expect(EVENT).toEqual(event);
          });

          service.emitFirstImage(EVENT);
        })
      );
    });

    describe('---NO---', () => {
      it(`shouldn't call emitFirstImage because gallery is closed`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);
          // don't trigger event
          service.emitFirstImage(EVENT);
        })
      );
    });
  });

  describe('#emitLastImage()', () => {
    describe('---YES---', () => {
      it(`should call emitLastImage`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);

          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();

          (ref as ModalGalleryRef).lastImage$.subscribe((event: ImageModalEvent) => {
            expect(EVENT).toEqual(event);
          });

          service.emitLastImage(EVENT);
        })
      );
    });

    describe('---NO---', () => {
      it(`shouldn't call emitLastImage because gallery is closed`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);
          // don't trigger event
          service.emitLastImage(EVENT);
        })
      );
    });
  });

  describe('#emitHasData()', () => {
    describe('---YES---', () => {
      it(`should call emitHasData`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);

          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();

          (ref as ModalGalleryRef).hasData$.subscribe((event: ImageModalEvent) => {
            expect(EVENT).toEqual(event);
          });

          service.emitHasData(EVENT);
        })
      );
    });

    describe('---NO---', () => {
      it(`shouldn't call emitHasData because gallery is closed`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ImageModalEvent = new ImageModalEvent(ID, Action.NORMAL, true);
          // don't trigger event
          service.emitHasData(EVENT);
        })
      );
    });
  });

  describe('#emitButtonBeforeHook()', () => {
    describe('---YES---', () => {
      it(`should call emitButtonBeforeHook`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ButtonEvent = {
            button: {
              type: ButtonType.CLOSE
            } as ButtonConfig,
            image: IMAGES[ID] as InternalLibImage,
            action: Action.NORMAL,
            galleryId: ID
          };

          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();

          (ref as ModalGalleryRef).buttonBeforeHook$.subscribe((event: ButtonEvent) => {
            expect(EVENT).toEqual(event);
          });

          service.emitButtonBeforeHook(EVENT);
        })
      );
    });

    describe('---NO---', () => {
      it(`shouldn't call emitButtonBeforeHook because gallery is closed`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ButtonEvent = {
            button: {
              type: ButtonType.CLOSE
            } as ButtonConfig,
            image: IMAGES[ID] as InternalLibImage,
            action: Action.NORMAL,
            galleryId: ID
          };
          // don't trigger event
          service.emitButtonBeforeHook(EVENT);
        })
      );
    });
  });

  describe('#emitButtonAfterHook()', () => {
    describe('---YES---', () => {
      it(`should call emitButtonAfterHook`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ButtonEvent = {
            button: {
              type: ButtonType.CLOSE
            } as ButtonConfig,
            image: IMAGES[ID] as InternalLibImage,
            action: Action.NORMAL,
            galleryId: ID
          };

          const ref: ModalGalleryRef | undefined = service.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();

          (ref as ModalGalleryRef).buttonAfterHook$.subscribe((event: ButtonEvent) => {
            expect(EVENT).toEqual(event);
          });

          service.emitButtonAfterHook(EVENT);
        })
      );
    });

    describe('---NO---', () => {
      it(`shouldn't call emitButtonAfterHook because gallery is closed`,
        inject([ModalGalleryService], (service: ModalGalleryService) => {
          const ID: number = 1;
          const EVENT: ButtonEvent = {
            button: {
              type: ButtonType.CLOSE
            } as ButtonConfig,
            image: IMAGES[ID] as InternalLibImage,
            action: Action.NORMAL,
            galleryId: ID
          };
          // don't trigger event
          service.emitButtonAfterHook(EVENT);
        })
      );
    });
  });
});
