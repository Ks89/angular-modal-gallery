/*
 * Copyright (C) 2017-2021 Stefano Cappa
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

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { DebugElement, SimpleChanges } from '@angular/core';
import { By, SafeResourceUrl } from '@angular/platform-browser';
import { CarouselPreviewsComponent } from './carousel-previews.component';
import { SizeDirective } from '../../../directives/size.directive';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../accessibility-default';
import { InternalLibImage } from '../../../model/image-internal.class';
import { AccessibilityConfig } from '../../../model/accessibility.interface';
import { Image, ImageEvent, ModalImage, PlainImage } from '../../../model/image.class';
import { CarouselConfig } from '../../../model/carousel-config.interface';
import { BreakpointsConfig, CarouselPreviewConfig } from '../../../model/carousel-preview-config.interface';
import { Action } from '../../../model/action.enum';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MediumMockedBreakpointObserver } from '../../../utils/breakpoint-observer-mock.spec';
import { ConfigService } from '../../../services/config.service';
import { FallbackImageDirective } from '../../../directives/fallback-image.directive';

let comp: CarouselPreviewsComponent;
let fixture: ComponentFixture<CarouselPreviewsComponent>;

interface NavigationTestData {
  initial: {
    start: number,
    end: number,
    activeIndex: number
  };
  expected: {
    start: number,
    end: number,
    activeIndex: number
  };
}

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.previewsContainerAriaLabel = 'custom previewsContainerAriaLabel';
CUSTOM_ACCESSIBILITY.previewsContainerTitle = 'custom previewsContainerTitle';
CUSTOM_ACCESSIBILITY.previewScrollNextAriaLabel = 'custom previewScrollNextAriaLabel';
CUSTOM_ACCESSIBILITY.previewScrollNextTitle = 'custom previewScrollNextTitle';
CUSTOM_ACCESSIBILITY.previewScrollPrevAriaLabel = 'custom previewScrollPrevAriaLabel';
CUSTOM_ACCESSIBILITY.previewScrollPrevTitle = 'custom previewScrollPrevTitle';

const DEFAULT_WIDTH = '25%';
const DEFAULT_HEIGHT = '150px';
const CUSTOM_PREVIEW_HEIGHTS: string[] = ['200px', '150px', '300px'];

const GALLERY_ID = 1;

const IMAGES: InternalLibImage[] = [
  new InternalLibImage(
    0,
    {
      img: '/assets/images/gallery/milan-pegasus-gallery-statue.jpg',
      description: 'Description 1'
    },
    {
      img: '/assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg',
      title: 'First image title',
      alt: 'First image alt',
      ariaLabel: 'First image aria-label'
    }
  ),
  new InternalLibImage(1, {img: '/assets/images/gallery/pexels-photo-47223.jpeg'}, {img: '/assets/images/gallery/thumbs/t-pexels-photo-47223.jpg'}),
  new InternalLibImage(
    2,
    {
      img: '/assets/images/gallery/pexels-photo-52062.jpeg',
      description: 'Description 3',
      title: 'Third image title',
      alt: 'Third image alt',
      ariaLabel: 'Third image aria-label'
    },
    {
      img: '/assets/images/gallery/thumbs/t-pexels-photo-52062.jpg',
      description: 'Description 3'
    }
  ),
  new InternalLibImage(
    3,
    {
      img: '/assets/images/gallery/pexels-photo-66943.jpeg',
      description: 'Description 4',
      title: 'Fourth image title (modal obj)',
      alt: 'Fourth image alt (modal obj)',
      ariaLabel: 'Fourth image aria-label (modal obj)'
    },
    {
      img: '/assets/images/gallery/thumbs/t-pexels-photo-66943.jpg',
      title: 'Fourth image title (plain obj)',
      alt: 'Fourth image alt (plain obj)',
      ariaLabel: 'Fourth image aria-label (plain obj)'
    }
  ),
  new InternalLibImage(4, {img: '/assets/images/gallery/pexels-photo-93750.jpeg'}, {img: '/assets/images/gallery/thumbs/t-pexels-photo-93750.jpg'}),
  new InternalLibImage(
    5,
    {
      img: '/assets/images/gallery/pexels-photo-94420.jpeg',
      description: 'Description 6'
    },
    {img: '/assets/images/gallery/thumbs/t-pexels-photo-94420.jpg'}
  ),
  new InternalLibImage(6, {img: '/assets/images/gallery/pexels-photo-96947.jpeg'}, {img: '/assets/images/gallery/thumbs/t-pexels-photo-96947.jpg'})
];

const NAVIGATION_NEXT_PREVIEWS: NavigationTestData[] = [
  {
    initial: {start: 0, end: 4, activeIndex: 0},
    expected: {start: 1, end: 5, activeIndex: 2}
  },
  {
    initial: {start: 0, end: 4, activeIndex: 0},
    expected: {start: 0, end: 4, activeIndex: 0}
  },
  {
    initial: {start: 0, end: 4, activeIndex: 0},
    expected: {start: 0, end: 4, activeIndex: 1}
  },
  {
    initial: {start: 0, end: 4, activeIndex: 0},
    expected: {start: 1, end: 5, activeIndex: 3}
  }
];

const NAVIGATION_PREV_PREVIEWS: NavigationTestData[] = [
  {
    initial: {start: 3, end: 7, activeIndex: 6},
    expected: {start: 2, end: 6, activeIndex: 4}
  },
  {
    initial: {start: 3, end: 7, activeIndex: 6},
    expected: {start: 3, end: 7, activeIndex: 6}
  },
  {
    initial: {start: 3, end: 7, activeIndex: 6},
    expected: {start: 3, end: 7, activeIndex: 5}
  },
  {
    initial: {start: 3, end: 7, activeIndex: 6},
    expected: {start: 2, end: 6, activeIndex: 3}
  }
];

function checkArrows(arrows: DebugElement[], first: boolean, last: boolean,
                     accessibility: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG): void {
  const prevArrowClass = first ? 'empty-arrow-preview-image' : 'left-arrow-preview-image';
  const nextArrowClass = last ? 'empty-arrow-preview-image' : 'right-arrow-preview-image';
  expect(arrows.length).toBe(2);
  expect(arrows[0].attributes.class).toBe('nav-left');
  expect(arrows[0].attributes.role).toBe('button');
  expect(arrows[0].attributes['aria-label']).toBe(accessibility.carouselPreviewScrollPrevAriaLabel);
  expect(arrows[0].properties.tabIndex).toBe(first ? -1 : 0); // because with the first image, prev arrow is hidden
  expect(arrows[0].children[0].attributes['aria-hidden']).toBe('true');
  expect(arrows[0].children[0].properties.title).toBe(accessibility.carouselPreviewScrollPrevTitle);
  expect(containsClasses(arrows[0].children[0].properties.className, prevArrowClass + ' inside')).toBeTrue();
  expect(arrows[1].attributes.class).toBe('nav-right');
  expect(arrows[1].attributes.role).toBe('button');
  expect(arrows[1].attributes['aria-label']).toBe(accessibility.carouselPreviewScrollNextAriaLabel);
  expect(arrows[1].properties.tabIndex).toBe(last ? -1 : 0);
  expect(arrows[1].children[0].attributes['aria-hidden']).toBe('true');
  expect(arrows[1].children[0].properties.title).toBe(accessibility.carouselPreviewScrollNextTitle);
  expect(containsClasses(arrows[1].children[0].properties.className, nextArrowClass + ' inside')).toBeTrue();
}

function containsClasses(actualClasses: string, expectedClasses: string): boolean {
  const actual: string[] = actualClasses.split(' ');
  const expected: string[] = expectedClasses.split(' ');
  let count = 0;
  if (actual.length !== expected.length) {
    return false;
  }
  expected.forEach((item: string) => {
    if (actual.includes(item)) {
      count++;
    }
  });
  return count === expected.length;
}

function getAriaLabel(preview: Image): string {
  if (!preview.plain) {
    return preview.modal.ariaLabel || '';
  }
  return preview.plain.ariaLabel || preview.modal.ariaLabel || '';
}

function getTitle(preview: Image): string {
  if (!preview.plain) {
    return preview.modal.title || '';
  }
  return preview.plain.title || preview.modal.title || '';
}

function getAlt(preview: Image): string {
  if (!preview.plain) {
    return preview.modal.alt || '';
  }
  return preview.plain.alt || preview.modal.alt || '';
}

function checkPreview(previewElement: DebugElement, previewImage: InternalLibImage, isActive: boolean, width: string = DEFAULT_WIDTH, height: string = DEFAULT_HEIGHT): void {
  const currentPlainImg: PlainImage | undefined = previewImage.plain;
  const currentModalImg: ModalImage = previewImage.modal;
  expect(previewElement.name).toBe('img');
  expect(previewElement.attributes.role).toBe('img');
  expect(previewElement.attributes['aria-label']).toBe(getAriaLabel(previewImage));
  expect(previewElement.styles.width).toBe(width);
  // FIXME why is not working?
  // expect(previewElement.styles.height).toBe(height);
  expect(containsClasses(previewElement.properties.className, 'inside preview-image' + (isActive ? ' active' : ''))).toBeTrue();
  expect(previewElement.properties.src).toBe(currentPlainImg && currentPlainImg.img ? currentPlainImg.img : currentModalImg.img);
  expect(previewElement.properties.title).toBe(getTitle(previewImage));
  expect(previewElement.properties.alt).toBe(getAlt(previewImage));
  expect(previewElement.properties.tabIndex).toBe(0);
}

function initTestBed(): void {
  TestBed.configureTestingModule({
    declarations: [CarouselPreviewsComponent, SizeDirective, FallbackImageDirective]
  }).overrideComponent(CarouselPreviewsComponent, {
    set: {
      providers: [
        {
          // by default inject a mocked BreakpointObserver service with Medium size by default
          provide: BreakpointObserver,
          useClass: MediumMockedBreakpointObserver
        },
        {
          provide: ConfigService,
          useClass: ConfigService
        }
      ]
    }
  });
}

const CAROUSEL_CONFIG_DEFAULT: CarouselConfig = {
  maxWidth: '100%',
  maxHeight: '400px',
  showArrows: true,
  objectFit: 'cover',
  keyboardEnable: true,
  modalGalleryEnable: false
} as CarouselConfig;

const DEFAULT_BREAKPOINTS: BreakpointsConfig = {xSmall: 100, small: 100, medium: 150, large: 200, xLarge: 200};
const DEFAULT_PREVIEW_CONFIG: CarouselPreviewConfig = {
  visible: true,
  number: 4,
  arrows: true,
  clickable: true,
  width: 100 / 4 + '%',
  maxHeight: '200px',
  breakpoints: DEFAULT_BREAKPOINTS
};

describe('CarouselPreviewsComponent', () => {
  beforeEach(() => {
    initTestBed();
    fixture = TestBed.createComponent(CarouselPreviewsComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display previews (first one is active) based of input images`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        carouselPreviewsConfig: DEFAULT_PREVIEW_CONFIG,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        carouselConfig: CAROUSEL_CONFIG_DEFAULT
      });
      const initialActiveImage = 0;
      const numOfPreviews: number = DEFAULT_PREVIEW_CONFIG.number as number;
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      fixture.detectChanges();

      expect(comp.start).toBe(initialActiveImage);
      expect(comp.end).toBe(numOfPreviews);
      expect(comp.previews).toEqual(IMAGES.slice(initialActiveImage, numOfPreviews));

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);
      previews.forEach((preview: DebugElement, i: number) => {
        checkPreview(preview, previewImages[i], i === initialActiveImage, DEFAULT_WIDTH, DEFAULT_HEIGHT);
      });
    });

    NAVIGATION_NEXT_PREVIEWS.forEach((val: NavigationTestData, index: number) => {
      it(`should display previews and navigate next clicking on images. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          carouselPreviewsConfig: DEFAULT_PREVIEW_CONFIG,
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          carouselConfig: CAROUSEL_CONFIG_DEFAULT
        });
        const initialActiveImage = val.initial.activeIndex; // initial active preview
        const newActiveImage = val.expected.activeIndex; // preview to click => so the next active preview after the click action
        const numOfPreviews: number = DEFAULT_PREVIEW_CONFIG.number as number;
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[initialActiveImage];
        comp.images = IMAGES;
        fixture.detectChanges();

        expect(comp.start).toBe(val.initial.start);
        expect(comp.end).toBe(val.initial.end);
        expect(comp.previews).toEqual(IMAGES.slice(val.initial.start, val.initial.end));

        spyOn(comp, 'onImageEvent').and.callThrough();

        const element: DebugElement = fixture.debugElement;

        let previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(numOfPreviews);

        let arrows: DebugElement[] = element.queryAll(By.css('a'));
        checkArrows(arrows, comp.start === 0, comp.end === IMAGES.length);

        let previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
        expect(previewsContainer.name).toBe('nav');
        expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
        expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

        let previewImages: InternalLibImage[] = IMAGES.slice(val.initial.start, val.initial.end);
        previews.forEach((preview: DebugElement, i: number) => {
          checkPreview(preview, previewImages[i], i === val.initial.activeIndex - val.initial.start, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        });

        comp.clickPreview.subscribe((e: ImageEvent) => {
          // check click event payload
          expect(e.action).toBe(Action.CLICK);
          expect(e.result).toBe(val.expected.activeIndex);

          // it's required to change the currentImage,
          // because this operation is done by its parent GalleryComponent
          comp.currentImage = IMAGES[newActiveImage];

          comp.ngOnChanges({
            currentImage: {
              previousValue: IMAGES[initialActiveImage],
              currentValue: IMAGES[newActiveImage],
              firstChange: true,
              isFirstChange: () => true
            },
            images: {
              previousValue: IMAGES,
              currentValue: IMAGES,
              firstChange: false,
              isFirstChange: () => false
            }
          } as SimpleChanges);

          fixture.detectChanges();
          expect(comp.onImageEvent).toHaveBeenCalled();

          previewImages = IMAGES.slice(val.expected.start, val.expected.end);

          expect(comp.start).toBe(val.expected.start);
          expect(comp.end).toBe(val.expected.end);
          expect(comp.previews).toEqual(previewImages);

          arrows = element.queryAll(By.css('a'));
          checkArrows(arrows, comp.start === 0, comp.end === IMAGES.length);

          previewsContainer = element.query(By.css('nav.previews-container'));
          expect(previewsContainer.name).toBe('nav');
          expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
          expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

          previews = element.queryAll(By.css('img'));
          expect(previews.length).toBe(numOfPreviews);

          previews.forEach((preview: DebugElement, i: number) => {
            checkPreview(preview, previewImages[i], i === val.expected.activeIndex - val.expected.start, DEFAULT_WIDTH, DEFAULT_HEIGHT);
          });
        });

        previews[newActiveImage].nativeElement.click();
      });
    });

    NAVIGATION_PREV_PREVIEWS.forEach((val: NavigationTestData, index: number) => {
      it(`should display previews and navigate prev clicking on images. Test i=${index}`, fakeAsync(() => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          carouselPreviewsConfig: DEFAULT_PREVIEW_CONFIG,
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          carouselConfig: CAROUSEL_CONFIG_DEFAULT
        });
        const initialActiveImage = val.initial.activeIndex; // initial active preview
        const newActiveImage = val.expected.activeIndex; // preview to click => so the next active preview after the click action
        const numOfPreviews: number = DEFAULT_PREVIEW_CONFIG.number as number;
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[initialActiveImage];
        comp.images = IMAGES;
        fixture.detectChanges();
        const element: DebugElement = fixture.debugElement;
        let arrows: DebugElement[] = element.queryAll(By.css('a'));
        // first I have to go to the end of previews to be able to navigate back to the beginning as specified by the NAVIGATION_PREV_PREVIEWS item
        arrows[1].nativeElement.click();
        tick(10);
        flush();
        fixture.detectChanges();
        arrows[1].nativeElement.click();
        tick(10);
        flush();
        fixture.detectChanges();
        arrows[1].nativeElement.click();
        tick(10);
        flush();
        fixture.detectChanges();
        // check if I'm really at the end
        expect(comp.start).toBe(val.initial.start);
        expect(comp.end).toBe(val.initial.end);
        expect(comp.previews).toEqual(IMAGES.slice(val.initial.start, val.initial.end));
        let previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(numOfPreviews);
        arrows = element.queryAll(By.css('a'));
        checkArrows(arrows, comp.start === 0, comp.end === IMAGES.length);
        let previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
        expect(previewsContainer.name).toBe('nav');
        expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
        expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);
        let previewImages: InternalLibImage[] = IMAGES.slice(val.initial.start, val.initial.end);
        previews.forEach((preview: DebugElement, i: number) => {
          checkPreview(preview, previewImages[i], i === val.initial.activeIndex - val.initial.start, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        });

        spyOn(comp, 'onImageEvent').and.callThrough();

        comp.clickPreview.subscribe((e: ImageEvent) => {
          // check click event payload
          expect(e.action).toBe(Action.CLICK);
          expect(e.result).toBe(val.expected.activeIndex);

          // it's required to change the currentImage,
          // because this operation is done by its parent GalleryComponent
          comp.currentImage = IMAGES[newActiveImage];

          comp.ngOnChanges({
            currentImage: {
              previousValue: IMAGES[initialActiveImage],
              currentValue: IMAGES[newActiveImage],
              firstChange: true,
              isFirstChange: () => true
            },
            images: {
              previousValue: IMAGES,
              currentValue: IMAGES,
              firstChange: false,
              isFirstChange: () => false
            }
          } as SimpleChanges);

          fixture.detectChanges();
          expect(comp.onImageEvent).toHaveBeenCalled();

          previewImages = IMAGES.slice(val.expected.start, val.expected.end);

          expect(comp.start).toBe(val.expected.start);
          expect(comp.end).toBe(val.expected.end);
          expect(comp.previews).toEqual(previewImages);

          arrows = element.queryAll(By.css('a'));
          checkArrows(arrows, comp.start === 0, comp.end === IMAGES.length);

          previewsContainer = element.query(By.css('nav.previews-container'));
          expect(previewsContainer.name).toBe('nav');
          expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
          expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

          previews = element.queryAll(By.css('img'));
          expect(previews.length).toBe(numOfPreviews);

          previews.forEach((preview: DebugElement, i: number) => {
            checkPreview(preview, previewImages[i], i === val.expected.activeIndex - val.expected.start, DEFAULT_WIDTH, DEFAULT_HEIGHT);
          });
        });

        previews[newActiveImage - val.initial.start].nativeElement.click();
      }));
    });

    it(`should display previews and navigate clicking on arrow 'next'`, fakeAsync(() => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        carouselPreviewsConfig: DEFAULT_PREVIEW_CONFIG,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        carouselConfig: CAROUSEL_CONFIG_DEFAULT
      });
      const initialActiveImage = 0; // initial active preview
      const numOfPreviews: number = DEFAULT_PREVIEW_CONFIG.number as number;
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      fixture.detectChanges();

      expect(comp.start).toBe(initialActiveImage);
      expect(comp.end).toBe(numOfPreviews);
      expect(comp.previews).toEqual(IMAGES.slice(initialActiveImage, numOfPreviews));

      spyOn(comp, 'onNavigationEvent').and.callThrough();
      const element: DebugElement = fixture.debugElement;

      // check initial state
      let previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);
      let arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, comp.start === 0, comp.end === IMAGES.length);
      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);
      let previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);
      previews.forEach((preview: DebugElement, i: number) => checkPreview(preview, previewImages[i], i === 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));

      // click on right arrow to navigate next
      [{start: 1, end: 5}, {start: 2, end: 6}, {start: 3, end: 7}].forEach((val: { start: number, end: number }) => {
        arrows[1].nativeElement.click();
        tick(10);
        flush();
        fixture.detectChanges();
        comp.currentImage = IMAGES[initialActiveImage]; // current image must be the initial image, because I'm navigating previews without changing the current image
        previewImages = IMAGES.slice(val.start, val.end);
        expect(comp.start).toBe(val.start);
        expect(comp.end).toBe(val.end);
        expect(comp.previews).toEqual(IMAGES.slice(val.start, val.end));
        arrows = element.queryAll(By.css('a'));
        checkArrows(arrows, comp.start === 0, comp.end === IMAGES.length);
        previews = element.queryAll(By.css('img'));
        expect(previews.length).toBe(numOfPreviews);
        previews.forEach((preview: DebugElement, i: number) => checkPreview(preview, previewImages[i], false, DEFAULT_WIDTH, DEFAULT_HEIGHT));
      });
    }));

    it(`should display previews with custom accessibility`, () => {
      const IMAGES_CUSTOM_ACCESSIBILITY: InternalLibImage[] = [...IMAGES].map((image: InternalLibImage) => {
        const newImage: InternalLibImage = Object.assign({}, image);
        newImage.modal.title = 'custom accessibility title';
        newImage.modal.alt = 'custom accessibility alt';
        newImage.modal.ariaLabel = 'custom accessibility ariaLabel';
        if (newImage.plain) {
          newImage.plain.title = 'custom accessibility title';
          newImage.plain.alt = 'custom accessibility alt';
          newImage.plain.ariaLabel = 'custom accessibility ariaLabel';
        }
        return newImage;
      });
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        carouselPreviewsConfig: DEFAULT_PREVIEW_CONFIG,
        accessibilityConfig: CUSTOM_ACCESSIBILITY,
        carouselConfig: CAROUSEL_CONFIG_DEFAULT
      });
      const numOfPreviews = 4;
      const initialActiveImage = 0;
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES_CUSTOM_ACCESSIBILITY[initialActiveImage];
      comp.images = IMAGES_CUSTOM_ACCESSIBILITY;
      fixture.detectChanges();

      const previewImages: InternalLibImage[] = IMAGES_CUSTOM_ACCESSIBILITY.slice(initialActiveImage, numOfPreviews);

      expect(comp.start).toBe(initialActiveImage);
      expect(comp.end).toBe(DEFAULT_PREVIEW_CONFIG.number as number);
      expect(comp.previews).toEqual(previewImages);

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(2);
      checkArrows(arrows, true, false, CUSTOM_ACCESSIBILITY);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.carouselPreviewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(CUSTOM_ACCESSIBILITY.carouselPreviewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);
      // DEFAULT_HEIGHT because forces by breakpoints when browser is small (like in test)
      previews.forEach((preview: DebugElement, i: number) => checkPreview(preview, previewImages[i], i === 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));
    });

    it(`should display a custom number of previews without hidden navigation arrows`, () => {
      const numOfPreviews = 5;
      const CUSTOM_WIDTH = 100 / numOfPreviews + '%';
      const customPreviewConfigFive: CarouselPreviewConfig = {
        visible: true,
        number: numOfPreviews,
        arrows: false,
        clickable: true,
        width: CUSTOM_WIDTH,
        maxHeight: '200px', // however, if browser is small (like in test), this will be smaller
        breakpoints: DEFAULT_BREAKPOINTS
      };
      const initialActiveImage = 0;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        carouselPreviewsConfig: customPreviewConfigFive,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        carouselConfig: CAROUSEL_CONFIG_DEFAULT
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      fixture.detectChanges();

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      expect(comp.start).toBe(initialActiveImage);
      expect(comp.end).toBe(customPreviewConfigFive.number as number);
      expect(comp.previews).toEqual(previewImages);

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(2);
      // use true, true because both arrows are hidden
      checkArrows(arrows, true, true);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.carouselPreviewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.carouselPreviewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);
      // DEFAULT_HEIGHT because forces by breakpoints when browser is small (like in test)
      previews.forEach((preview: DebugElement, i: number) => checkPreview(preview, previewImages[i], i === 0, CUSTOM_WIDTH, DEFAULT_HEIGHT));
    });

    CUSTOM_PREVIEW_HEIGHTS.forEach((height: string, index: number) => {
      it(`should display previews with custom sizes. Index i=${index}`, () => {
        const initialActiveImage = 0;
        // create a custom preview config based on the default one, but with different maxHeight
        const CUSTOM_PREVIEW_CONFIG: CarouselPreviewConfig = Object.assign({}, DEFAULT_PREVIEW_CONFIG, {maxHeight: height});
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          carouselPreviewsConfig: CUSTOM_PREVIEW_CONFIG,
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          carouselConfig: CAROUSEL_CONFIG_DEFAULT
        });
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[initialActiveImage];
        comp.images = IMAGES;
        fixture.detectChanges();

        const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, CUSTOM_PREVIEW_CONFIG.number);

        expect(comp.start).toBe(initialActiveImage);
        expect(comp.end).toBe(CUSTOM_PREVIEW_CONFIG.number as number);
        expect(comp.previews).toEqual(previewImages);

        const element: DebugElement = fixture.debugElement;

        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        expect(arrows.length).toBe(2);
        checkArrows(arrows, true, false);

        const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
        expect(previewsContainer.name).toBe('nav');
        expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
        expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

        const previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(CUSTOM_PREVIEW_CONFIG.number as number);
        // DEFAULT_HEIGHT because forces by breakpoints when browser is small (like in test)
        previews.forEach((preview: DebugElement, i: number) => checkPreview(preview, previewImages[i], i === 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));
      });
    });

    // TODO not working. But it isn't an issue of this test, instead it's something related to the library, because
    // TODO I should implement keyboard navigation on the previews-container and not on single previews
    // it(`should display previews (first one is active) and go to the second one with keyboard's right arrow`, fakeAsync(() => {
    //   const initialActiveImage = 0;
    //   comp.previewConfig = DEFAULT_PREVIEW_CONFIG;
    //   comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //   comp.currentImage = IMAGES[initialActiveImage];
    //   comp.carouselConfig = CAROUSEL_CONFIG_DEFAULT;
    //   comp.images = IMAGES;
    //   fixture.detectChanges();
    //
    //   spyOn(comp, 'onImageEvent').and.callThrough();
    //
    //   const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, DEFAULT_PREVIEW_CONFIG.number);
    //
    //   expect(comp.start).toBe(initialActiveImage);
    //   expect(comp.end).toBe(DEFAULT_PREVIEW_CONFIG.number);
    //   expect(comp.previews).toEqual(previewImages);
    //
    //   const element: DebugElement = fixture.debugElement;
    //
    //   const arrows: DebugElement[] = element.queryAll(By.css('a'));
    //   expect(arrows.length).toBe(2);
    //   checkArrows(arrows, true, false);
    //
    //   const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
    //   expect(previewsContainer.name).toBe('nav');
    //   expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
    //   expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);
    //
    //   const previews: DebugElement[] = element.queryAll(By.css('img'));
    //   expect(previews.length).toBe(DEFAULT_PREVIEW_CONFIG.number);
    //   // DEFAULT_HEIGHT because forces by breakpoints when browser is small (like in test)
    //   previews.forEach((preview: DebugElement, i: number) => checkPreview(preview, previewImages[i], i === 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));
    //
    //   previews[initialActiveImage + 1].nativeElement.focus();
    //   previews[initialActiveImage + 1].triggerEventHandler('keyup', <KeyboardEvent>{keyCode: RIGHT_ARROW_KEYCODE});
    //   tick(100);
    //   flush();
    //   fixture.detectChanges();
    //   expect(comp.start).toBe(initialActiveImage + 1);
    //   expect(comp.end).toBe(DEFAULT_PREVIEW_CONFIG.number + 1);
    //   expect(comp.previews).toEqual(previewImages);
    // }));

    [-2, -1, 0].forEach((numberOfPreviews: number, index: number) => {
      it(`should display previews with number <= 0, so it will be forced to the default value. Test i=${index}`, () => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          carouselPreviewsConfig: DEFAULT_PREVIEW_CONFIG,
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          carouselConfig: CAROUSEL_CONFIG_DEFAULT
        });
        const initialActiveImage = 0;
        const numOfPreviews = 4;
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[initialActiveImage];
        comp.images = IMAGES;
        fixture.detectChanges();

        expect(comp.start).toBe(initialActiveImage);
        expect(comp.end).toBe(numOfPreviews);
        expect(comp.previews).toEqual(IMAGES.slice(initialActiveImage, numOfPreviews));

        const element: DebugElement = fixture.debugElement;
        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        checkArrows(arrows, true, false);
        const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
        expect(previewsContainer.name).toBe('nav');
        expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
        expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);
        const previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(numOfPreviews);
      });
    });
  });

  describe('---NO---', () => {
    it(`shouldn't display previews because visibility is false`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        carouselPreviewsConfig: {visible: false} as CarouselPreviewConfig, // hide previews
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        carouselConfig: CAROUSEL_CONFIG_DEFAULT
      });
      const initialActiveImage = 0;
      const numOfPreviews: number = DEFAULT_PREVIEW_CONFIG.number as number;
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      fixture.detectChanges();

      expect(comp.start).toBe(initialActiveImage);
      expect(comp.end).toBe(numOfPreviews);
      expect(comp.previews).toEqual(IMAGES.slice(initialActiveImage, numOfPreviews));

      const element: DebugElement = fixture.debugElement;
      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer).toBeNull();
      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(0);
    });
  });
});
