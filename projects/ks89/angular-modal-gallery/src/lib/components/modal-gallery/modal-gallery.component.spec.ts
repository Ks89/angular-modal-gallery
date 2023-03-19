/*
 The MIT License (MIT)

 Copyright (C) 2017-2022 Stefano Cappa (Ks89)

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

import 'mousetrap';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { DebugElement } from '@angular/core';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { ModalGalleryComponent } from './modal-gallery.component';
import { Size } from '../../model/size.interface';
import { SizeDirective } from '../../directives/size.directive';
import { WrapDirective } from '../../directives/wrap.directive';
import { DirectionDirective } from '../../directives/direction.directive';
import { ATagBgImageDirective } from '../../directives/a-tag-bg-image.directive';
import { ConfigService } from '../../services/config.service';
import { ModalGalleryService } from './modal-gallery.service';
import { IdValidatorService } from '../../services/id-validator.service';
import { KeyboardService } from '../../services/keyboard.service';
import { ModalGalleryConfig } from '../../model/modal-gallery-config.interface';
import { DIALOG_DATA } from './modal-gallery.tokens';
import { OverlayModule } from '@angular/cdk/overlay';
import { LibConfig } from '../../model/lib-config.interface';
import { UpperButtonsComponent } from '../upper-buttons/upper-buttons.component';
import { CurrentImageComponent, ImageLoadEvent } from '../current-image/current-image.component';
import { DotsComponent } from '../dots/dots.component';
import { PreviewsComponent } from '../previews/previews.component';
import { FallbackImageDirective } from '../../directives/fallback-image.directive';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LoadingSpinnerComponent } from '../current-image/loading-spinner/loading-spinner.component';
import { DescriptionDirective } from '../../directives/description.directive';
import { KeyboardNavigationDirective } from '../../directives/keyboard-navigation.directive';
import { By, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonConfig, ButtonEvent, ButtonType } from '../../model/buttons-config.interface';
import { Action } from '../../model/action.enum';
import { ImageModalEvent } from '../../model/image.class';
import { CurrentImageConfig } from '../../model/current-image-config.interface';

let comp: ModalGalleryComponent;
let fixture: ComponentFixture<ModalGalleryComponent>;

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.plainGalleryContentAriaLabel = 'custom plainGalleryContentAriaLabel';
CUSTOM_ACCESSIBILITY.plainGalleryContentTitle = 'custom plainGalleryContentTitle';

const DEFAULT_PLAIN_SIZE: Size = { width: 'auto', height: '50px' };
const CUSTOM_SIZE: Size = { height: '40px', width: '40px' };
const CUSTOM_SIZE_AUTO_HEIGHT: Size = { height: 'auto', width: '40px' };
const CUSTOM_SIZE_AUTO_WIDTH: Size = { height: '40px', width: 'auto' };
const CUSTOM_SIZES: Size[] = [CUSTOM_SIZE, CUSTOM_SIZE_AUTO_HEIGHT, CUSTOM_SIZE_AUTO_WIDTH];

const GALLERY_ID = 0;

const IMAGES: InternalLibImage[] = [
  new InternalLibImage(0, {
    // modal
    img: '../assets/images/gallery/img1.jpg',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(1, {
    // modal
    img: '../assets/images/gallery/img2.png',
    description: 'Description 2'
  }),
  new InternalLibImage(
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
  new InternalLibImage(3, {
    // modal
    img: '../assets/images/gallery/img4.jpg',
    description: 'Description 4',
    extUrl: 'http://www.google.com'
  }),
  new InternalLibImage(
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

const IMAGES_CUSTOM_DOWNLOAD_FILENAME: InternalLibImage[] = [
  new InternalLibImage(0, {
    // modal
    img: '../assets/images/gallery/img1.jpg',
    extUrl: 'http://www.google.com',
    downloadFileName: 'a.png'
  }),
  new InternalLibImage(1, {
    // modal
    img: '../assets/images/gallery/img2.png',
    description: 'Description 2',
    downloadFileName: 'b.png'
  })
];

// example of a png converted into base64 using https://www.base64-image.de/ or other similar websites
const base64String =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABN0lEQV' +
  'R4nO3SQQ2AQBDAwAVlaMEhCkAV' +
  'b2RcQmcU9NEZAAAAAOD/tvN675k5VoewxLOvLmAtA8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0C' +
  'cAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4g' +
  'wQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGQAAAAAA4Pc+8asEoPPGq' +
  'xUAAAAASUVORK5CYII';

const base64RedString =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX/AAD/////WVn/+vr/qan/Nzf/ERH/2tr/s7P/KSn/' +
  '7+//vr7/0ND/W1v/6+v/m5v/4+P/U1P/HR3/o6P/rq7/g4P/k5P/t7f/dXX/SEj/zMz/ZWX/h4f/bm7/amr/np7/yMhDG/2oAAAC8ElEQVR4nO3dC3KqQBCF4WkHERHFRyKIL/' +
  'a/ymDuVYMMFipTbbfnW8H5S4lQVGUMaWe4B3iHQvlQKB8K5UOhfCiUD4XyoVA+FJ7Myijd5dvBO9nmuzQqZ68X2mI9NO9suC7s84VxNuAO6GSQxU8VJvuQe3pn4T55uLDYcK9+' +
  '0KZ4qDB574vPbej+HF2Fcc499km563p0FAbcQ18QdCi0B+6VLzk0fjtuC0dj7o0vGo/uF064B/agvFcYca/rRdReeOTe1pNjW6HkP6J1gbtQwzV4NnEVJtyrepU0C2M599ldhH' +
  'GjcMq9qWfT28KUe1Hv0nrhnHuPB/Na4YJ7jgeLv4UZ9xovsmuhXXKP8WJpL4Ur7i2erC6Fun4Kr8Jz4Rf3Em++/hdKf+htN/5XqOuGtC75LfzmnuHR96nQ6v2SVl9TWxVq/pKevq' +
  'aG1twjvFpXhTLeLz1rQMZyb/DMmhH3BM9GRudjxVVmtN51n62M1DdpXeVG2rveR22MxLe9jxgazfdsJ2Oj9en3THsfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAgHba/+98+AFnI+g/30L/GSX6z5nRf1aQ/vOe9J/Zpf/cNf1n533A+Yf6z7DUfw6p/rNkVX9Nkw850/kDzuXWf7Y6ab37Xl0K7ZJ7ixdLeykknQ8YGV0LacG9xo' +
  'MF/S2cc8/xYF4rpJR7T+9SqhfSlHtRz6Z0Wxjr+lEM40ahstvThJqFNOFe1aMJuQop4N7Vm4DchXTkXtaTI7UVUsS9rRcRtRequBZLuldII+mPw+MR3S8ke+De+JKDvQ1qFMr+kx' +
  'o0cxyFFEt945bHjhpXYXV/I/HN8DBxtrgLiQpp74Y3RUtJW2H1Oe7l3IuHe/fnd7+wuh4zGe+lBpnr+utSWLHF+r0vyeG6aPw+PFT4a1ZG6S7fDt7JNt+lUTnrsL5LoWwolA+F8q' +
  'FQPhTKh0L5UCgfCuVDoXw/lnQz7dm7GjoAAAAASUVORK5CYII=';
const base64GreenString =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAgMAAADQNkYNAAAADFBMVEUAAAAy/ysy/ysy/ysyTcibAAAAA3RSTlMA2r/af0d' +
  'WAAAAQUlEQVRo3u3YMREAMAzEsJAMyZJsMXy3XORdBFySJK3qxFXH1Y1DEARBEARBEARBEARBEARBkNmk436mvSRJ0o4eOKL2P81eyn8AAAAASUVORK5CYII=';

class KeyboardServiceMock {
  init(config: LibConfig): Promise<void> {
    return new Promise(resolve => resolve());
  }

  // tslint:disable-next-line:no-any
  add(onBind: (e: KeyboardEvent, combo: string) => any, config: LibConfig): void {
  }

  reset(config: LibConfig): void {
  }
}

function initTestBed(): void {
  TestBed.configureTestingModule({
    imports: [OverlayModule],
    declarations: [ModalGalleryComponent,
      UpperButtonsComponent, CurrentImageComponent, DotsComponent, PreviewsComponent, LoadingSpinnerComponent,
      FallbackImageDirective, ClickOutsideDirective, DescriptionDirective, KeyboardNavigationDirective,
      SizeDirective, WrapDirective, DirectionDirective, ATagBgImageDirective]
  }).overrideComponent(ModalGalleryComponent, {
    set: {
      providers: [
        {
          provide: ConfigService,
          useClass: ConfigService
        },
        {
          provide: ModalGalleryService,
          useClass: ModalGalleryService
        },
        {
          provide: KeyboardService,
          useClass: KeyboardServiceMock
        },
        {
          provide: IdValidatorService,
          useClass: IdValidatorService
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            id: GALLERY_ID,
            images: IMAGES,
            currentImage: IMAGES[0],
            libConfig: {
              accessibilityConfig: CUSTOM_ACCESSIBILITY
            } as LibConfig
          } as ModalGalleryConfig
        }
      ]
    }
  });
}

function checkElements (fixture: ComponentFixture<ModalGalleryComponent>) {
  const element: DebugElement = fixture.debugElement;
  const modalGalleryWrapper: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
  expect(modalGalleryWrapper).not.toBeNull();

  const fixMinHeight: DebugElement = modalGalleryWrapper.children[0];
  const modalGalleryContainer: DebugElement = fixMinHeight.children[0];
  const list: DebugElement[] = modalGalleryContainer.children;
  expect(list.length).toEqual(3);

  const buttonsContainer: DebugElement = modalGalleryContainer.query(By.css('header.buttons-container'));
  const mainImageContainer: DebugElement = modalGalleryContainer.query(By.css('main.main-image-container'));
  const dotsContainer: DebugElement = modalGalleryContainer.query(By.css('nav.dots-container'));
  const previewsContainer: DebugElement = modalGalleryContainer.query(By.css('nav.previews-container'));
  expect(buttonsContainer).not.toBeNull();
  expect(mainImageContainer).not.toBeNull();
  expect(dotsContainer).not.toBeNull();
  expect(previewsContainer).not.toBeNull();
}

describe('ModalGalleryComponent', () => {
  beforeEach(() => {
    initTestBed();
    fixture = TestBed.createComponent(ModalGalleryComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display modal gallery - first image`, (done) => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      const hasDataSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitHasData');
      const showSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitShow');
      const firstImageSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitFirstImage');

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      setTimeout(() => {
        expect(hasDataSpy).toHaveBeenCalled();
        expect(showSpy).toHaveBeenCalled();
        expect(firstImageSpy).toHaveBeenCalled();
        done();
      }, 500);
    });

    it(`should display modal gallery - last image`, (done) => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      const hasDataSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitHasData');
      const showSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitShow');
      const lastImageSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitLastImage');

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[IMAGES.length - 1];
      fixture.detectChanges();

      checkElements(fixture);

      setTimeout(() => {
        expect(hasDataSpy).toHaveBeenCalled();
        expect(showSpy).toHaveBeenCalled();
        expect(lastImageSpy).toHaveBeenCalled();
        done();
      }, 500);
    });

    it(`should display modal gallery and call onCustomEmit`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');
      const afterHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonAfterHook');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.CUSTOM
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onCustomEmit(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
      expect(afterHookSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onFullScreen`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, {accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG});
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.FULLSCREEN
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onFullScreen(EVENT);
    });

    it(`should display modal gallery and call onDelete`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');
      const afterHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonAfterHook');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DELETE
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDelete(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
      expect(afterHookSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onDelete with only 1 image`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = [IMAGES[0]]; // only 1 image
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');
      const afterHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonAfterHook');
      const emitCloseSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitClose');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DELETE
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDelete(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
      expect(afterHookSpy).toHaveBeenCalled();
      expect(emitCloseSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onNavigate`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, {accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG});
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      // replace updateLocationHref() method in component with an empty function
      // to bypass window.location.href that causes test failures
      spyOn(comp, 'updateLocationHref').and.callFake(() => {});

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.EXTURL
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onNavigate(EVENT);
    });

    it(`should display modal gallery and call onDownload with downloadable = true`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: {
          downloadable: true
        } as CurrentImageConfig
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');
      const afterHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonAfterHook');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DOWNLOAD
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDownload(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
      expect(afterHookSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onDownload with downloadable = true and SafeResourceUrl img url as base64`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);
      const sanitizer = fixture.debugElement.injector.get(DomSanitizer);

      const base64Image: SafeResourceUrl = sanitizer.bypassSecurityTrustResourceUrl(base64String);
      const base64RedImage: SafeResourceUrl = sanitizer.bypassSecurityTrustResourceUrl(base64RedString);
      const base64GreenImage: SafeResourceUrl = sanitizer.bypassSecurityTrustResourceUrl(base64GreenString);

      const imagesBase64: InternalLibImage[] = [
        new InternalLibImage(0, {
          img: base64Image,
          extUrl: 'http://www.google.com'
        }),
        new InternalLibImage(1, {
          img: base64GreenImage,
          description: 'Description 2'
        }),
        new InternalLibImage(
          2,
          {
            img: base64RedImage,
            description: 'Description 3',
            extUrl: 'http://www.google.com'
          },
          {
            img: base64RedImage,
            title: 'custom title 2',
            alt: 'custom alt 2',
            ariaLabel: 'arial label 2'
          }
        )
      ];

      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: {
          downloadable: true
        } as CurrentImageConfig
      });
      comp.id = GALLERY_ID;
      comp.images = imagesBase64;
      comp.currentImage = imagesBase64[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');
      const afterHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonAfterHook');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DOWNLOAD
        } as ButtonConfig,
        image: imagesBase64[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDownload(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
      expect(afterHookSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onDownload with downloadable = true and custom downloadFileName`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: {
          downloadable: true
        } as CurrentImageConfig
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES_CUSTOM_DOWNLOAD_FILENAME;
      comp.currentImage = IMAGES_CUSTOM_DOWNLOAD_FILENAME[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');
      const afterHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonAfterHook');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DOWNLOAD
        } as ButtonConfig,
        image: IMAGES_CUSTOM_DOWNLOAD_FILENAME[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDownload(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
      expect(afterHookSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onCloseGalleryButton`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.CLOSE
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onCloseGalleryButton(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onCloseGallery`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');

      const EVENT: ImageModalEvent = {
        action: Action.NORMAL,
        galleryId: GALLERY_ID,
        result: true
      };
      comp.onCloseGallery(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
    });

    [0, 1, IMAGES.length - 1].forEach(index => {
      it(`should display modal gallery and call onChangeCurrentImage with Image at index = ${index}`, () => {
        const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
        const configService = fixture.debugElement.injector.get(ConfigService);

        configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
        comp.id = GALLERY_ID;
        comp.images = IMAGES;
        comp.currentImage = IMAGES[0];
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;
        const modalGallery: DebugElement = element.query(By.css('div#modal-gallery-wrapper'));
        expect(modalGallery).not.toBeNull();

        const emitShowSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitShow');

        const EVENT: ImageModalEvent = {
          action: Action.NORMAL,
          galleryId: GALLERY_ID,
          result: index
        };
        comp.onChangeCurrentImage(EVENT);

        expect(emitShowSpy).toHaveBeenCalled();
      });
    });

    it(`should display modal gallery and call onClickOutside`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      const emitCloseSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitClose');
      const closeSpy: Spy<any> = spyOn<any>(modalGalleryService, 'close');

      checkElements(fixture);

      comp.onClickOutside(true);

      expect(emitCloseSpy).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
    });

    it(`should display modal gallery and call onImageLoad`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const EVENT: ImageLoadEvent = {
        status: true,
        index: 0,
        id: GALLERY_ID
      };

      comp.onImageLoad(EVENT);
    });

    it(`should display modal gallery and call onClickDot`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      comp.onClickDot(1);
    });

    it(`should display modal gallery and call onClickPreview`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const EVENT: ImageModalEvent = {
        action: Action.NORMAL,
        galleryId: GALLERY_ID,
        result: 1
      };

      comp.onClickPreview(EVENT);
    });

    it(`should display modal gallery and updateImages via modalGalleryService`, () => {
      const modalGalleryService: ModalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService: ConfigService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      // change IMAGES array pushing a new Image (equals to the first one)
      modalGalleryService.updateModalImages([...IMAGES, IMAGES[0]]);
    });
  });

  describe('---NO---', () => {

    [-1, IMAGES.length + 1].forEach(index => {
      it(`should display modal gallery and call onChangeCurrentImage without changing image, because index ${index} is out of bound.`, () => {
        const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
        const configService = fixture.debugElement.injector.get(ConfigService);

        configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
        comp.id = GALLERY_ID;
        comp.images = IMAGES;
        comp.currentImage = IMAGES[0];
        fixture.detectChanges();

        checkElements(fixture);

        const emitShowSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitShow');

        const EVENT: ImageModalEvent = {
          action: Action.NORMAL,
          galleryId: GALLERY_ID,
          result: index
        };
        comp.onChangeCurrentImage(EVENT);

        expect(emitShowSpy).not.toHaveBeenCalled();
      });
    });

    it(`should display modal gallery and call onClickOutside, but enableCloseOutside is false`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, { accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      comp.enableCloseOutside = false;
      fixture.detectChanges();

      const emitCloseSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitClose');
      const closeSpy: Spy<any> = spyOn<any>(modalGalleryService, 'close');

      checkElements(fixture);

      comp.onClickOutside(true);

      expect(emitCloseSpy).not.toHaveBeenCalled();
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it(`should display modal gallery and call onDownload with downloadable = false`, () => {
      const modalGalleryService = fixture.debugElement.injector.get(ModalGalleryService);
      const configService = fixture.debugElement.injector.get(ConfigService);

      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        currentImageConfig: {
          downloadable: false
        } as CurrentImageConfig
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.currentImage = IMAGES[0];
      fixture.detectChanges();

      checkElements(fixture);

      const beforeHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonBeforeHook');
      const afterHookSpy: Spy<any> = spyOn<any>(modalGalleryService, 'emitButtonAfterHook');

      const EVENT: ButtonEvent = {
        button: {
          type: ButtonType.DOWNLOAD
        } as ButtonConfig,
        image: IMAGES[0] as InternalLibImage,
        action: Action.NORMAL,
        galleryId: GALLERY_ID
      };
      comp.onDownload(EVENT);

      expect(beforeHookSpy).toHaveBeenCalled();
      expect(afterHookSpy).toHaveBeenCalled();
    });
  });
});
