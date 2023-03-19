/*
 * Copyright (C) 2017-2023 Stefano Cappa
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

// --------------------------------------------------
// --------------------------------------------------
// TODO add custom layout unit testing
// --------------------------------------------------
// --------------------------------------------------

import 'mousetrap';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { InternalLibImage } from '../../model/image-internal.class';
import { PlainGalleryComponent } from './plain-gallery.component';
import { Size } from '../../model/size.interface';
import { SizeDirective } from '../../directives/size.directive';
import { WrapDirective } from '../../directives/wrap.directive';
import { DirectionDirective } from '../../directives/direction.directive';
import { ATagBgImageDirective } from '../../directives/a-tag-bg-image.directive';
import { GridLayout, LineLayout, PlainGalleryStrategy } from '../../model/plain-gallery-config.interface';
import { ConfigService } from '../../services/config.service';
import { FallbackImageDirective } from '../../directives/fallback-image.directive';

let comp: PlainGalleryComponent;
let fixture: ComponentFixture<PlainGalleryComponent>;

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.plainGalleryContentAriaLabel = 'custom plainGalleryContentAriaLabel';
CUSTOM_ACCESSIBILITY.plainGalleryContentTitle = 'custom plainGalleryContentTitle';

const DEFAULT_PLAIN_SIZE: Size = {width: 'auto', height: '50px'};
const CUSTOM_SIZE: Size = {height: '40px', width: '40px'};
const CUSTOM_SIZE_AUTO_HEIGHT: Size = {height: 'auto', width: '40px'};
const CUSTOM_SIZE_AUTO_WIDTH: Size = {height: '40px', width: 'auto'};
const CUSTOM_SIZES: Size[] = [CUSTOM_SIZE, CUSTOM_SIZE_AUTO_HEIGHT, CUSTOM_SIZE_AUTO_WIDTH];

const GALLERY_ID = 1;

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

function initTestBed(): void {
  TestBed.configureTestingModule({
    declarations: [PlainGalleryComponent, SizeDirective, WrapDirective, DirectionDirective, ATagBgImageDirective, FallbackImageDirective]
  }).overrideComponent(PlainGalleryComponent, {
    set: {
      providers: [
        {
          provide: ConfigService,
          useClass: ConfigService
        }
      ]
    }
  });
}

describe('PlainGalleryComponent', () => {
  beforeEach(() => {
    initTestBed();
    fixture = TestBed.createComponent(PlainGalleryComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display plain gallery with img tags and click on a thumb`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG});
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery.name).toBe('div');
      expect(plainGallery.attributes.ksDirection).toBe('');
      expect(plainGallery.attributes.ksWrap).toBe('');
      expect(plainGallery.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentTitle);
      expect(plainGallery.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentAriaLabel);
      expect(plainGallery.styles['flex-direction']).toBe('row');
      expect(plainGallery.styles['justify-content']).toBe('flex-start');

      const plainImages: DebugElement[] = plainGallery.children;
      expect(plainImages.length).toBe(IMAGES.length);
      expect(plainImages[0].name).toBe('img');
      expect(plainImages[0].attributes.role).toBe('img');
      expect(plainImages[0].properties.src).toBe(IMAGES[0].modal.img);
      expect(plainImages[0].attributes.class).toBe('image');
      expect(plainImages[0].attributes['aria-label']).toBeUndefined();
      expect(plainImages[0].properties.title).toBe('Image 1/5');
      expect(plainImages[0].properties.alt).toBe('Image 1');
      expect(plainImages[0].properties.tabIndex).toBe(0);
      expect(plainImages[0].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[0].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);

      expect(plainImages[1].name).toBe('img');
      expect(plainImages[1].attributes.role).toBe('img');
      expect(plainImages[1].properties.src).toBe(IMAGES[1].modal.img);
      expect(plainImages[1].attributes.class).toBe('image');
      expect(plainImages[1].attributes['aria-label']).toBeUndefined();
      expect(plainImages[1].properties.title).toBe('Image 2/5 - Description 2');
      expect(plainImages[1].properties.alt).toBe('Image 2');
      expect(plainImages[1].properties.tabIndex).toBe(0);
      expect(plainImages[1].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[1].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);

      expect(plainImages[2].name).toBe('img');
      expect(plainImages[2].attributes.role).toBe('img');
      expect(plainImages[2].properties.src).toBe(IMAGES[2].plain?.img);
      expect(plainImages[2].attributes.class).toBe('image');
      expect(plainImages[2].attributes['aria-label']).toBe('arial label 2');
      expect(plainImages[2].properties.title).toBe(IMAGES[2].plain?.title);
      expect(plainImages[2].properties.alt).toBe(IMAGES[2].plain?.alt);
      expect(plainImages[2].properties.tabIndex).toBe(0);
      expect(plainImages[2].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[2].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);

      expect(plainImages[3].name).toBe('img');
      expect(plainImages[3].attributes.role).toBe('img');
      expect(plainImages[3].properties.src).toBe(IMAGES[3].modal.img);
      expect(plainImages[3].attributes.class).toBe('image');
      expect(plainImages[3].attributes['aria-label']).toBeUndefined();
      expect(plainImages[3].properties.title).toBe('Image 4/5 - Description 4');
      expect(plainImages[3].properties.alt).toBe('Image 4');
      expect(plainImages[3].properties.tabIndex).toBe(0);
      expect(plainImages[3].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[3].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);

      expect(plainImages[4].name).toBe('img');
      expect(plainImages[4].attributes.role).toBe('img');
      expect(plainImages[4].properties.src).toBe(IMAGES[4].plain?.img);
      expect(plainImages[4].attributes.class).toBe('image');
      expect(plainImages[4].attributes['aria-label']).toBeUndefined();
      expect(plainImages[4].properties.title).toBe('Image 5/5');
      expect(plainImages[4].properties.alt).toBe('Image 5');
      expect(plainImages[4].properties.tabIndex).toBe(0);
      expect(plainImages[4].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[4].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);

      comp.clickImage.subscribe((res: number) => {
        expect(res).toBe(0);
      });

      plainImages[0].nativeElement.click();
    });

    it(`should display plain gallery with img tags and custom accessibility config`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {accessibilityConfig: CUSTOM_ACCESSIBILITY});
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery.name).toBe('div');
      expect(plainGallery.properties.title).toBe(CUSTOM_ACCESSIBILITY.plainGalleryContentTitle);
      expect(plainGallery.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.plainGalleryContentAriaLabel);
      expect(plainGallery.styles['flex-direction']).toBe('row');
      expect(plainGallery.styles['justify-content']).toBe('flex-start');
    });

    CUSTOM_SIZES.forEach((size: Size, index: number) => {
      it(`should display plain gallery with img tags and custom sizes. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          plainGalleryConfig: {
            strategy: PlainGalleryStrategy.ROW,
            layout: new LineLayout(
              {width: size.width, height: size.height},
              {length: IMAGES.length, wrap: false},
              'flex-start'
            )
          }
        });
        comp.id = GALLERY_ID;
        comp.images = IMAGES;
        comp.ngOnInit();
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;

        const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
        const plainImages: DebugElement[] = plainGallery.children;
        expect(plainImages.length).toBe(IMAGES.length);
        expect(plainImages[0].styles.width).toBe(size.width);
        expect(plainImages[0].styles.height).toBe(size.height);
        expect(plainImages[1].styles.width).toBe(size.width);
        expect(plainImages[1].styles.height).toBe(size.height);
        expect(plainImages[2].styles.width).toBe(size.width);
        expect(plainImages[2].styles.height).toBe(size.height);
        expect(plainImages[3].styles.width).toBe(size.width);
        expect(plainImages[3].styles.height).toBe(size.height);
        expect(plainImages[4].styles.width).toBe(size.width);
        expect(plainImages[4].styles.height).toBe(size.height);
      });
    });

    it(`should display plain gallery row layout with only 2 img tags`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        plainGalleryConfig: {
          strategy: PlainGalleryStrategy.ROW,
          layout: new LineLayout(
            {width: DEFAULT_PLAIN_SIZE.width, height: DEFAULT_PLAIN_SIZE.height},
            {length: 2, wrap: false},
            'flex-start'
          )
        }
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      const plainImages: DebugElement[] = plainGallery.children;
      expect(plainImages.length).toBe(2);
    });

    it(`should display plain gallery row layout with img tags and justify space-around`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        plainGalleryConfig: {
          strategy: PlainGalleryStrategy.ROW,
          layout: new LineLayout(
            {width: DEFAULT_PLAIN_SIZE.width, height: DEFAULT_PLAIN_SIZE.height},
            {length: IMAGES.length, wrap: false},
            'space-around'
          )
        }
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery.styles['flex-direction']).toBe('row');
      expect(plainGallery.styles['justify-content']).toBe('space-around');
    });

    it(`should display plain gallery column layout with only 2 img tags`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        plainGalleryConfig: {
          strategy: PlainGalleryStrategy.COLUMN,
          layout: new LineLayout(
            {width: DEFAULT_PLAIN_SIZE.width, height: DEFAULT_PLAIN_SIZE.height},
            {length: 2, wrap: false},
            'flex-start'
          )
        }
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery.name).toBe('div');
      expect(plainGallery.attributes.ksDirection).toBe('');
      expect(plainGallery.attributes.ksWrap).toBe('');
      expect(plainGallery.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentTitle);
      expect(plainGallery.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentAriaLabel);
      expect(plainGallery.styles['flex-direction']).toBe('column');
      expect(plainGallery.styles['justify-content']).toBe('flex-start');

      const plainImages: DebugElement[] = plainGallery.children;
      expect(plainImages.length).toBe(2);
      expect(plainImages[0].name).toBe('img');
      expect(plainImages[0].attributes.role).toBe('img');
      expect(plainImages[0].properties.src).toBe(IMAGES[0].modal.img);
      expect(plainImages[0].attributes.class).toBe('image');
      expect(plainImages[0].attributes['aria-label']).toBeUndefined();
      expect(plainImages[0].properties.title).toBe('Image 1/5');
      expect(plainImages[0].properties.alt).toBe('Image 1');
      expect(plainImages[0].properties.tabIndex).toBe(0);
      expect(plainImages[0].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[0].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);

      expect(plainImages[1].name).toBe('img');
      expect(plainImages[1].attributes.role).toBe('img');
      expect(plainImages[1].properties.src).toBe(IMAGES[1].modal.img);
      expect(plainImages[1].attributes.class).toBe('image');
      expect(plainImages[1].attributes['aria-label']).toBeUndefined();
      expect(plainImages[1].properties.title).toBe('Image 2/5 - Description 2');
      expect(plainImages[1].properties.alt).toBe('Image 2');
      expect(plainImages[1].properties.tabIndex).toBe(0);
      expect(plainImages[1].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[1].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);

    });

    it(`should display plain gallery grid layout`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        plainGalleryConfig: {
          strategy: PlainGalleryStrategy.GRID,
          layout: new GridLayout({width: '80px', height: '80px'}, {length: 2, wrap: true})
        }
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery.name).toBe('div');
      expect(plainGallery.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentTitle);
      expect(plainGallery.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentAriaLabel);
      expect(plainGallery.styles['flex-wrap']).toBe('wrap');

      const plainImages: DebugElement[] = plainGallery.children;
      expect(plainImages.length).toBe(IMAGES.length);
    });

    it(`should display plain gallery with anchor tags based of input images`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        plainGalleryConfig: {
          strategy: PlainGalleryStrategy.ROW,
          layout: new LineLayout(
            {width: DEFAULT_PLAIN_SIZE.width, height: DEFAULT_PLAIN_SIZE.height},
            {length: IMAGES.length, wrap: true},
            'flex-start'
          ),
          advanced: {aTags: true, additionalBackground: '50% 50% / cover'}
        }
      });
      comp.id = GALLERY_ID;
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
      expect(plainGallery.name).toBe('div');
      expect(plainGallery.attributes.ksDirection).toBe('');
      expect(plainGallery.attributes.ksWrap).toBe('');
      expect(plainGallery.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentTitle);
      expect(plainGallery.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.plainGalleryContentAriaLabel);
      // expect(plainGallery.styles['flex-direction']).toBe('row');
      expect(plainGallery.styles['justify-content']).toBe('flex-start');

      const plainImages: DebugElement[] = plainGallery.children;
      expect(plainImages.length).toBe(IMAGES.length);
      expect(plainImages[0].name).toBe('a');
      // expect(plainImages[0].attributes['href']).toBe('#');
      expect(plainImages[0].attributes.class).toBe('a-tag-image');
      // expect(plainImages[0].attributes['aria-label']).toBe(IMAGES[0].modal.ariaLabel);
      expect(plainImages[0].properties.title).toBe('Image 1/5');
      expect(plainImages[0].properties.tabIndex).toBe(0);
      expect(plainImages[0].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[0].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);
      expect(plainImages[0].styles.background).toBe(`url("${IMAGES[0].modal.img}") 50% 50% / cover`);

      expect(plainImages[1].name).toBe('a');
      // expect(plainImages[1].attributes['href']).toBe('#');
      expect(plainImages[1].attributes.class).toBe('a-tag-image');
      // expect(plainImages[1].attributes['aria-label']).toBe(IMAGES[0].modal.ariaLabel);
      expect(plainImages[1].properties.title).toBe('Image 2/5 - Description 2');
      expect(plainImages[1].properties.tabIndex).toBe(0);
      expect(plainImages[1].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[1].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);
      expect(plainImages[1].styles.background).toBe(`url("${IMAGES[1].modal.img}") 50% 50% / cover`);

      expect(plainImages[2].name).toBe('a');
      // expect(plainImages[2].attributes['href']).toBe('#');
      expect(plainImages[2].attributes.class).toBe('a-tag-image');
      // expect(plainImages[2].attributes['aria-label']).toBe(IMAGES[0].modal.ariaLabel);
      expect(plainImages[2].properties.title).toBe(IMAGES[2].plain?.title);
      expect(plainImages[2].properties.tabIndex).toBe(0);
      expect(plainImages[2].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[2].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);
      expect(plainImages[2].styles.background).toBe(`url("${IMAGES[2].plain?.img}") 50% 50% / cover`);

      expect(plainImages[3].name).toBe('a');
      // expect(plainImages[3].attributes['href']).toBe('#');
      expect(plainImages[3].attributes.class).toBe('a-tag-image');
      // expect(plainImages[3].attributes['aria-label']).toBe(IMAGES[0].modal.ariaLabel);
      expect(plainImages[3].properties.title).toBe('Image 4/5 - Description 4');
      expect(plainImages[3].properties.tabIndex).toBe(0);
      expect(plainImages[3].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[3].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);
      expect(plainImages[3].styles.background).toBe(`url("${IMAGES[3].modal.img}") 50% 50% / cover`);

      expect(plainImages[4].name).toBe('a');
      // expect(plainImages[4].attributes['href']).toBe('#');
      expect(plainImages[4].attributes.class).toBe('a-tag-image');
      // expect(plainImages[4].attributes['aria-label']).toBe(IMAGES[0].modal.ariaLabel);
      expect(plainImages[4].properties.title).toBe('Image 5/5');
      expect(plainImages[4].properties.tabIndex).toBe(0);
      expect(plainImages[4].styles.width).toBe(DEFAULT_PLAIN_SIZE.width);
      expect(plainImages[4].styles.height).toBe(DEFAULT_PLAIN_SIZE.height);
      expect(plainImages[4].styles.background).toBe(`url("${IMAGES[4].plain?.img}") 50% 50% / cover`);

      comp.clickImage.subscribe((res: number) => {
        expect(res).toBe(1);
      });

      plainImages[1].nativeElement.click();
    });

    CUSTOM_SIZES.forEach((size: Size, index: number) => {
      it(`should display plain gallery with anchor tags and custom sizes. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          plainGalleryConfig: {
            strategy: PlainGalleryStrategy.ROW,
            layout: new LineLayout(
              {width: size.width, height: size.height},
              {length: IMAGES.length, wrap: false},
              'flex-start'
            ),
            advanced: {aTags: true, additionalBackground: '50% 50% / cover'}
          }
        });
        comp.id = GALLERY_ID;
        comp.images = IMAGES;
        comp.ngOnInit();
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;

        const plainGallery: DebugElement = element.query(By.css('div.plain-container'));
        const plainImages: DebugElement[] = plainGallery.children;
        expect(plainImages.length).toBe(IMAGES.length);
        expect(plainImages[0].styles.width).toBe(size.width);
        expect(plainImages[0].styles.height).toBe(size.height);
        expect(plainImages[1].styles.width).toBe(size.width);
        expect(plainImages[1].styles.height).toBe(size.height);
        expect(plainImages[2].styles.width).toBe(size.width);
        expect(plainImages[2].styles.height).toBe(size.height);
        expect(plainImages[3].styles.width).toBe(size.width);
        expect(plainImages[3].styles.height).toBe(size.height);
        expect(plainImages[4].styles.width).toBe(size.width);
        expect(plainImages[4].styles.height).toBe(size.height);
      });
    });
  });
});
