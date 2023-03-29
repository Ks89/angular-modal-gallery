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

import { Component, DebugElement, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../components/accessibility-default';
import { FallbackImageDirective } from '../../directives/fallback-image.directive';
import { SizeDirective } from '../../directives/size.directive';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Action } from '../../model/action.enum';
import { InternalLibImage } from '../../model/image-internal.class';
import { ImageModalEvent, ModalImage, PlainImage } from '../../model/image.class';
import { PreviewConfig } from '../../model/preview-config.interface';
import { Size } from '../../model/size.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { ConfigService } from '../../services/config.service';
import { KS_DEFAULT_SIZE } from '../upper-buttons/upper-buttons-default';
import { PreviewsComponent } from './previews.component';



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

const GALLERY_ID = 1;

let comp: PreviewsComponent;
let fixture: ComponentFixture<PreviewsComponent>;

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.previewsContainerAriaLabel = 'custom previewsContainerAriaLabel';
CUSTOM_ACCESSIBILITY.previewsContainerTitle = 'custom previewsContainerTitle';
CUSTOM_ACCESSIBILITY.previewScrollNextAriaLabel = 'custom previewScrollNextAriaLabel';
CUSTOM_ACCESSIBILITY.previewScrollNextTitle = 'custom previewScrollNextTitle';
CUSTOM_ACCESSIBILITY.previewScrollPrevAriaLabel = 'custom previewScrollPrevAriaLabel';
CUSTOM_ACCESSIBILITY.previewScrollPrevTitle = 'custom previewScrollPrevTitle';

const DEFAULT_PREVIEW_SIZE: Size = {height: '50px', width: 'auto'};
const CUSTOM_SIZE: Size = {height: '40px', width: '40px'};
const CUSTOM_SIZE_AUTO_HEIGHT: Size = {height: 'auto', width: '40px'};
const CUSTOM_SIZE_AUTO_WIDTH: Size = {height: '40px', width: 'auto'};
const CUSTOM_SIZES: Size[] = [CUSTOM_SIZE, CUSTOM_SIZE_AUTO_HEIGHT, CUSTOM_SIZE_AUTO_WIDTH];

const PREVIEWS_CONFIG_VISIBLE: PreviewConfig = {visible: true};
const SLIDE_CONFIG_INFINITE: SlideConfig = {infinite: true};
const PREVIEWS_CONFIG_HIDDEN: PreviewConfig = {visible: false};

const SLIDE_CONFIG: SlideConfig = {infinite: false, sidePreviews: {show: true, size: KS_DEFAULT_SIZE}};


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

const IMAGES_CUSTOM_ACCESSIBILITY: InternalLibImage[] = IMAGES.map((image: InternalLibImage) => {
  const newImage: InternalLibImage = Object.assign({}, image);
  newImage.modal.title = 'custom accessibility title';
  newImage.modal.alt = 'custom accessibility alt';
  newImage.modal.ariaLabel = 'custom accessibility ariaLabel';
  return newImage;
});

const NAVIGATION_NEXT_PREVIEWS: NavigationTestData[] = [
  {
    initial: {start: 0, end: 3, activeIndex: 0},
    expected: {start: 1, end: 4, activeIndex: 0}
  },
  {
    initial: {start: 1, end: 4, activeIndex: 0},
    expected: {start: 2, end: 5, activeIndex: 0}
  }
];

const NAVIGATION_PREV_PREVIEWS: NavigationTestData[] = [
  {
    initial: {start: 2, end: 5, activeIndex: 0},
    expected: {start: 1, end: 4, activeIndex: 0}
  },
  {
    initial: {start: 1, end: 4, activeIndex: 0},
    expected: {start: 0, end: 3, activeIndex: 0}
  }
];

function checkArrows(arrows: DebugElement[], first: boolean, last: boolean,
                     accessibility: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG): void {
  const prevArrowClass = first ? 'inside empty-arrow-preview-image' : 'inside left-arrow-preview-image';
  const nextArrowClass = last ? 'inside empty-arrow-preview-image' : 'inside right-arrow-preview-image';
  expect(arrows.length).toBe(2);
  expect(arrows[0].attributes.class).toBe('nav-left');
  expect(arrows[0].attributes.role).toBe('button');
  expect(arrows[0].attributes['aria-label']).toBe(accessibility.previewScrollPrevAriaLabel);
  expect(arrows[0].properties.tabIndex).toBe(first ? -1 : 0); // because with the first image, prev arrow is hidden
  expect(arrows[0].children[0].attributes['aria-hidden']).toBe('true');
  expect(arrows[0].children[0].properties.title).toBe(accessibility.previewScrollPrevTitle);
  expect(containsClasses(arrows[0].children[0].properties.className, prevArrowClass)).toBeTrue();
  expect(arrows[1].attributes.class).toBe('nav-right');
  expect(arrows[1].attributes.role).toBe('button');
  expect(arrows[1].attributes['aria-label']).toBe(accessibility.previewScrollNextAriaLabel);
  expect(arrows[1].properties.tabIndex).toBe(last ? -1 : 0);
  expect(arrows[1].children[0].attributes['aria-hidden']).toBe('true');
  expect(arrows[1].children[0].properties.title).toBe(accessibility.previewScrollNextTitle);
  expect(containsClasses(arrows[1].children[0].properties.className, nextArrowClass)).toBeTrue();
}

function checkPreview(previewElement: DebugElement, previewImage: InternalLibImage, isActive: boolean, size: Size = DEFAULT_PREVIEW_SIZE): void {
  const currentPlainImg: PlainImage | undefined = previewImage.plain;
  const currentModalImg: ModalImage | undefined = previewImage.modal;
  expect(previewElement.name).toBe('img');
  expect(previewElement.attributes.role).toBe('img');
  expect(previewElement.attributes['aria-label']).toBe(currentModalImg.ariaLabel ? currentModalImg.ariaLabel : '');
  expect(previewElement.attributes.ksSize).toBe('');
  if (size) {
    // I don't know why I cannot retrieve styles from btnDebugElement, so I decided to
    // get elements via Directive.
    const sizes: DebugElement[] = fixture.debugElement.queryAll(By.directive(SizeDirective));
    let width = '';
    let height = '';
    const split: string[] | undefined = sizes[0].attributes.style?.split(';');
    if (!split) {
      throw new Error('This test expects to check styles applied by ksSize directive');
    }
    split.pop(); // remove last element because it contains ''
    split.forEach((item: string) => {
      if (item.trim().startsWith('width:')) {
        width = item.replace('width:', '').trim();
      } else if (item.trim().startsWith('height:')) {
        height = item.replace('height:', '').trim();
      }
    });
    expect(width).toBe(size.width);
    expect(height).toBe(size.height);
  }
  // expect(previewElement.properties.className).toBe('inside preview-image ' + (isActive ? 'active' : ''));
  expect(previewElement.properties.src).toBe(currentPlainImg && currentPlainImg.img ? currentPlainImg.img : currentModalImg.img);
  expect(previewElement.properties.title).toBe(currentModalImg.title ? currentModalImg.title : '');
  expect(previewElement.properties.alt).toBe(currentModalImg.alt ? currentModalImg.alt : '');
  expect(previewElement.properties.tabIndex).toBe(0);
  // expect(previewElement.properties.className).toBe('inside preview-image ' + (isActive ? 'active' : ''));
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

function checkPreviewStateAfterClick(previews: DebugElement[], prevValue: InternalLibImage, currValue: InternalLibImage,
                                     start: number, end: number, activeIndex: number = 0): void {
  fixture.detectChanges();
  // comp.ngOnChanges(<SimpleChanges>{
  //   currentImage: {
  //     previousValue: prevValue,
  //     currentValue: currValue,
  //     firstChange: false,
  //     isFirstChange: () => false
  //   }
  // });
  expect(comp.start).toBe(start);
  expect(comp.end).toBe(end);
  expect(comp.previews).toEqual(IMAGES.slice(start, end));
}

/**
 * A template-providing component to test the template-driven previews customization.
 */
 @Component({
  template: `
    <ng-template #template let-preview="preview" let-defaultTemplate="defaultTemplate">
      <div class="my-own-template">example</div>
    </ng-template>
`,
})
class PreviewsTemplateComponent0 {
  @ViewChild('template') templateRef?: TemplateRef<HTMLElement>;
}

/**
 * A template-providing component to test the template-driven previews customization (using default template).
 */
@Component({
  template: `
    <ng-template #template let-preview="preview" let-defaultTemplate="defaultTemplate">
      <div>
        <ng-container *ngTemplateOutlet="defaultTemplate"></ng-container>
      </div>
    </ng-template>
`,
})
class PreviewsTemplateComponent1 {
  @ViewChild('template') templateRef?: TemplateRef<HTMLElement>;
}

function initTestBed(): void {
  TestBed.configureTestingModule({
    declarations: [
      PreviewsComponent,
      SizeDirective,
      FallbackImageDirective,
      PreviewsTemplateComponent0,
      PreviewsTemplateComponent1,
    ]
  }).overrideComponent(PreviewsComponent, {
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

describe('PreviewsComponent', () => {
  beforeEach(() => {
    initTestBed();
    fixture = TestBed.createComponent(PreviewsComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    it(`should display previews (first one is active) based of input images`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

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

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display previews (one in the middle is active) based of input images`, () => {
      // in this example I choose the third image (index = 2) as the current one
      const initialActiveImage = 2; // you can use every value except for 0 and the last one
      const numOfPreviews = 3;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, false, false);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage - 1, initialActiveImage - 1 + numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 1, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display previews (last one is active) based of input images`, () => {
      // in this example I choose the last image as the current one
      const initialActiveImage = IMAGES.length - 1;
      const numOfPreviews = 3;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, false, true);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage + 1 - numOfPreviews, initialActiveImage + 1);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 2, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display previews with custom accessibility`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        // custom accessibility for container and arrows, but not for previews
        accessibilityConfig: CUSTOM_ACCESSIBILITY,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES_CUSTOM_ACCESSIBILITY[initialActiveImage];
      comp.images = IMAGES_CUSTOM_ACCESSIBILITY;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false, CUSTOM_ACCESSIBILITY);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(CUSTOM_ACCESSIBILITY.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }
    });

    it(`should display a custom number of previews without navigation arrows`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 2;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: {visible: true, number: 2, arrows: false},
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(2);
      checkArrows(arrows, true, true);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }
    });

    CUSTOM_SIZES.forEach((size: Size, index: number) => {
      it(`should display previews with custom sizes. Index i=${index}`, () => {
        const initialActiveImage = 0;
        const numOfPreviews = 3;
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          previewConfig: {visible: true, size},
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          slideConfig: SLIDE_CONFIG
        });
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[initialActiveImage];
        comp.images = IMAGES;
        comp.ngOnInit();
        fixture.detectChanges();

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

        for (let i = 0; i < previewImages.length; i++) {
          checkPreview(previews[i], previewImages[i], i === 0, size);
        }
      });
    });

    it(`should display previews (first one is active) and click on the second one`, () => {
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      const afterClickActivePreview = 0;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      comp.clickPreview.subscribe((res: ImageModalEvent) => {
        const event: ImageModalEvent = new ImageModalEvent(GALLERY_ID, Action.CLICK, afterClickActivePreview);
        expect(res).toEqual(event);
      });

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(numOfPreviews);

      const previewImages: InternalLibImage[] = IMAGES.slice(initialActiveImage, numOfPreviews);

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }

      previews[afterClickActivePreview].nativeElement.click();
    });

    // TODO
    // it(`should display previews (first one is active) and go to the second one with keyboard`, () => {
    //   const initialActivePreview = 0;
    //   const afterClickActivePreview = 0;
    //   const numberOfVisiblePreviews = 3;
    //   comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
    //   comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //   comp.currentImage = IMAGES[initialActivePreview];
    //   comp.images = IMAGES;
    //   comp.slideConfig = SLIDE_CONFIG;
    //   comp.ngOnInit();
    //   fixture.detectChanges();
    //
    //   comp.clickPreview.subscribe((res: InternalLibImage) => {
    //     fail('I should go here');
    //     expect(res).toEqual(IMAGES[afterClickActivePreview]);
    //   });
    //
    //   const element: DebugElement = fixture.debugElement;
    //
    //   const arrows: DebugElement[] = element.queryAll(By.css('a'));
    //   checkArrows(arrows, true, false);
    //
    //   const previews: DebugElement[] = element.queryAll(By.css('img'));
    //   expect(previews.length).toBe(numberOfVisiblePreviews);
    //
    //   previews.forEach((preview: DebugElement, index: number) => {
    //     checkPreviewDefault(preview, initialActivePreview, index);
    //   });
    //
    //   previews[afterClickActivePreview].nativeElement.focus();
    //   previews[afterClickActivePreview].triggerEventHandler('keyup', <KeyboardEvent>{keyCode: 32});
    //   fixture.detectChanges();
    // });

    NAVIGATION_NEXT_PREVIEWS.forEach((val: NavigationTestData, index: number) => {
      it(`should navigate previews clicking on left arrow. Test i=${index}`, waitForAsync(() => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          previewConfig: PREVIEWS_CONFIG_VISIBLE,
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          slideConfig: SLIDE_CONFIG
        });
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[val.initial.activeIndex];
        comp.images = IMAGES;
        comp.ngOnInit();
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;

        const previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(3);

        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        expect(arrows.length).toBe(2);

        spyOn(comp, 'onNavigationEvent').and.callThrough();

        if (index !== 0) {
          arrows[1].nativeElement.click();
          fixture.detectChanges();
        }

        expect(comp.start).toBe(val.initial.start);
        expect(comp.end).toBe(val.initial.end);
        expect(comp.previews).toEqual(IMAGES.slice(val.initial.start, val.initial.end));

        if (index === 0) {
          checkArrows(arrows, true, false);
        } else {
          checkArrows(arrows, false, false);
        }

        arrows[1].nativeElement.click();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(comp.onNavigationEvent).toHaveBeenCalled();
          expect(comp.start).toBe(val.expected.start);
          expect(comp.end).toBe(val.expected.end);
          expect(comp.previews).toEqual(IMAGES.slice(val.expected.start, val.expected.end));
          if (index === 0) {
            checkArrows(arrows, false, false);
          } else {
            checkArrows(arrows, false, true);
          }
        });
      }));
    });

    // TODO
    // NAVIGATION_PREV_PREVIEWS.forEach((val: NavigationTestData, index: number) => {
    //   it(`should navigate back previews clicking on right arrow. Test i=${index}`, waitForAsync(() => {
    //     comp.previewConfig = PREVIEWS_CONFIG_VISIBLE;
    //     comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
    //     comp.currentImage = IMAGES[val.initial.activeIndex];
    //     comp.images = IMAGES;
    //     comp.slideConfig = SLIDE_CONFIG;
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //
    //     const element: DebugElement = fixture.debugElement;
    //
    //     const previews: DebugElement[] = element.queryAll(By.css('img'));
    //     expect(previews.length).toBe(3);
    //
    //     const arrows: DebugElement[] = element.queryAll(By.css('a'));
    //     expect(arrows.length).toBe(2);
    //
    //     spyOn(comp, 'onNavigationEvent').and.callThrough();
    //
    //     if (index !== 0) {
    //       arrows[0].nativeElement.click();
    //       fixture.detectChanges();
    //     }
    //
    //     expect(comp.start).toBe(val.initial.start);
    //     expect(comp.end).toBe(val.initial.end);
    //     expect(comp.previews).toEqual(IMAGES.slice(val.initial.start, val.initial.end));
    //
    //     if (index === 0) {
    //       checkArrows(arrows, false, true);
    //     } else {
    //       checkArrows(arrows, false, false);
    //     }
    //
    //     arrows[0].nativeElement.click();
    //
    //     fixture.whenStable().then(() => {
    //       fixture.detectChanges();
    //       expect(comp.onNavigationEvent).toHaveBeenCalled();
    //       expect(comp.start).toBe(val.expected.start);
    //       expect(comp.end).toBe(val.expected.end);
    //       expect(comp.previews).toEqual(IMAGES.slice(val.expected.start, val.expected.end));
    //       if (index === 0) {
    //         checkArrows(arrows, false, false);
    //       } else {
    //         checkArrows(arrows, true, false);
    //       }
    //     });
    //   }));
    // });

    [SLIDE_CONFIG, SLIDE_CONFIG_INFINITE].forEach((slideConfig: SlideConfig, index: number) => {
      it(`should navigate next/prev clicking on images for all SlideConfigs. Test i=${index}`, waitForAsync(() => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        configService.setConfig(GALLERY_ID, {
          previewConfig: PREVIEWS_CONFIG_VISIBLE,
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          slideConfig
        });
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[0];
        comp.images = IMAGES;
        comp.ngOnInit();
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;

        let previews: DebugElement[] = element.queryAll(By.css('img'));
        expect(previews.length).toBe(3);

        const arrows: DebugElement[] = element.queryAll(By.css('a'));
        expect(arrows.length).toBe(2);

        spyOn(comp, 'onImageEvent').and.callThrough();

        let images: InternalLibImage[];

        // this should change the current preview triggering ngOnChanges to navigate next/prev
        // however this is a unit testing and I cannot use modal-gallery.component,
        // so I have to simulate this behaviour manually
        previews[0].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 0, 3, 0);
        images = IMAGES.slice(0, 3);
        for (let i = 0; i < images.length; i++) {
          checkPreview(previews[i], images[i], i === 0, DEFAULT_PREVIEW_SIZE);
        }

        fixture.detectChanges();

        previews = element.queryAll(By.css('img'));

        // previews[1].nativeElement.click();
        comp.ngOnChanges({
          currentImage: {
            previousValue: IMAGES[0],
            currentValue: IMAGES[1],
            firstChange: false,
            isFirstChange: () => false
          }
        } as SimpleChanges);
        checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[1], 0, 3, 1);
        // images = IMAGES.slice(0, 3);
        // for (let i = 0; i < images.length; i++) {
        //   checkPreview(previews[i], images[i], i === 1, DEFAULT_PREVIEW_SIZE);
        // }
        // images = IMAGESò.slice(1, 4);
        // for (let i = 0; i < images.length; i++) {
        //   checkPreview(previews[i], images[i], i === 2, DEFAULT_PREVIEW_SIZE);
        // }
        previews = element.queryAll(By.css('img'));
        fixture.detectChanges();
        // previews[2].nativeElement.click();
        comp.ngOnChanges({
          currentImage: {
            previousValue: IMAGES[1],
            currentValue: IMAGES[2],
            firstChange: false,
            isFirstChange: () => false
          }
        } as SimpleChanges);
        checkPreviewStateAfterClick(previews, IMAGES[1], IMAGES[2], 1, 4, 2);

        previews = element.queryAll(By.css('img'));
        fixture.detectChanges();
        // previews[2].nativeElement.click();
        comp.ngOnChanges({
          currentImage: {
            previousValue: IMAGES[3],
            currentValue: IMAGES[4],
            firstChange: false,
            isFirstChange: () => false
          }
        } as SimpleChanges);
        checkPreviewStateAfterClick(previews, IMAGES[3], IMAGES[4], 2, 5, 4);

        previews = element.queryAll(By.css('img'));
        fixture.detectChanges();
        previews[2].nativeElement.click();
        checkPreviewStateAfterClick(previews, IMAGES[4], IMAGES[4], 2, 5, 5);
      }));
    });

    it(`should use a custom template to render the previews`, () => {
      const templateComponentFixture = TestBed.createComponent<PreviewsTemplateComponent0>(PreviewsTemplateComponent0);
      const templateComponent = templateComponentFixture.debugElement.componentInstance as PreviewsTemplateComponent0;
      templateComponentFixture.detectChanges();
      const templateRef = templateComponent.templateRef;
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.customTemplate = templateRef;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      checkArrows(arrows, true, false);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);
      const previews: DebugElement[] = element.queryAll(By.css('.my-own-template'));
      expect(previews.length).toBe(numOfPreviews);
    });

    it(`should use a custom template to render the previews (using default template)`, () => {
      const templateComponentFixture = TestBed.createComponent<PreviewsTemplateComponent1>(PreviewsTemplateComponent1);
      const templateComponent = templateComponentFixture.debugElement.componentInstance as PreviewsTemplateComponent1;
      templateComponentFixture.detectChanges();
      const templateRef = templateComponent.templateRef;
      const initialActiveImage = 0;
      const numOfPreviews = 3;
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[initialActiveImage];
      comp.images = IMAGES;
      comp.customTemplate = templateRef;
      comp.ngOnInit();
      fixture.detectChanges();

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

      for (let i = 0; i < previewImages.length; i++) {
        checkPreview(previews[i], previewImages[i], i === 0, DEFAULT_PREVIEW_SIZE);
      }
    });

    [4, 5].forEach((previewNumber: number) => {
      it(`should display a constant number of previews (${previewNumber}), independent of current image index`, waitForAsync(() => {
        const configService = fixture.debugElement.injector.get(ConfigService);
        const previewConfig = Object.assign({}, PREVIEWS_CONFIG_VISIBLE, { number: previewNumber }) as PreviewConfig;
        configService.setConfig(GALLERY_ID, {
          previewConfig,
          accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
          slideConfig: SLIDE_CONFIG
        });
        comp.id = GALLERY_ID;
        comp.currentImage = IMAGES[0];
        comp.images = IMAGES;
        comp.ngOnInit();
        expect(comp.previews.length).toBe(previewNumber);

        // click on the second picture
        comp.currentImage = IMAGES[1]; // set component input
        comp.ngOnChanges({ // trigger changes manually (not done automatically in tests)
          currentImage: {
            previousValue: IMAGES[0],
            currentValue: IMAGES[1],
            firstChange: false,
            isFirstChange: () => false
          }
        } as SimpleChanges);
        // at the time of writing this test, a change is detected within 'images', yet with the same value
        comp.ngOnChanges({
          images: {
            previousValue: IMAGES,
            currentValue: IMAGES,
            firstChange: false,
            isFirstChange: () => false
          }
        } as SimpleChanges);
        expect(comp.previews.length).toBe(previewNumber);

        // click on the third picture
        comp.currentImage = IMAGES[2]; // set component input
        comp.ngOnChanges({ // trigger changes manually (not done automatically in tests)
          currentImage: {
            previousValue: IMAGES[1],
            currentValue: IMAGES[2],
            firstChange: false,
            isFirstChange: () => false
          }
        } as SimpleChanges);
        // at the time of writing this test, a change is detected within 'images', yet with the same value
        comp.ngOnChanges({
          images: {
            previousValue: IMAGES,
            currentValue: IMAGES,
            firstChange: false,
            isFirstChange: () => false
          }
        } as SimpleChanges);
        expect(comp.previews.length).toBe(previewNumber);
      }));
    });

    it('should allow to navigate previews from first to last and back', () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[0];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();
      const element: DebugElement = fixture.debugElement;
      let previews: DebugElement[] = element.queryAll(By.css('img'));

      const leftArrow = element.query(By.css('a.nav-left')).nativeElement as HTMLAnchorElement;
      const rightArrow = element.query(By.css('a.nav-right')).nativeElement as HTMLAnchorElement;
      checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 0, 3, 0);

      // click right until the last preview is reached
      rightArrow.click();
      checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 1, 4, 0);
      rightArrow.click();
      checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 2, 5, 0);
      // click left until the first preview is reached
      leftArrow.click();
      checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 1, 4, 0);
      leftArrow.click();
      checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 0, 3, 0);
      // click right again and check previews have changed accordingly
      rightArrow.click();
      checkPreviewStateAfterClick(previews, IMAGES[0], IMAGES[0], 1, 4, 0);

    });

    it('should always display previews navigation arrows, in infinite sliding mode (nbPreviews < nbImages)', () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_VISIBLE,
        accessibilityConfig: KS_DEFAULT_ACCESSIBILITY_CONFIG,
        slideConfig: SLIDE_CONFIG_INFINITE
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[0];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();
      const element: DebugElement = fixture.debugElement;
      const leftArrow = element.query(By.css('a.nav-left')).nativeElement as HTMLAnchorElement;
      const rightArrow = element.query(By.css('a.nav-right')).nativeElement as HTMLAnchorElement;
      let leftArrowDiv = element.query(By.css('a.nav-left > div')).nativeElement as HTMLAnchorElement;
      let rightArrowDiv = element.query(By.css('a.nav-right > div')).nativeElement as HTMLAnchorElement;
      // check that arrows are initially visible
      expect(leftArrowDiv.classList).toContain('left-arrow-preview-image');
      expect(rightArrowDiv.classList).toContain('right-arrow-preview-image');
      // click right until the last preview is reached, each time check that arrows are visible
      rightArrow.click();
      fixture.detectChanges();
      leftArrowDiv = element.query(By.css('a.nav-left > div')).nativeElement as HTMLAnchorElement;
      rightArrowDiv = element.query(By.css('a.nav-right > div')).nativeElement as HTMLAnchorElement;
      expect(leftArrowDiv.classList).toContain('left-arrow-preview-image');
      expect(rightArrowDiv.classList).toContain('right-arrow-preview-image');
      rightArrow.click();
      fixture.detectChanges();
      leftArrowDiv = element.query(By.css('a.nav-left > div')).nativeElement as HTMLAnchorElement;
      rightArrowDiv = element.query(By.css('a.nav-right > div')).nativeElement as HTMLAnchorElement;
      expect(leftArrowDiv.classList).toContain('left-arrow-preview-image');
      expect(rightArrowDiv.classList).toContain('right-arrow-preview-image');
    });

  });

  describe('---NO---', () => {
    it(`shouldn't display previews because visibility is false`, () => {
      const configService = fixture.debugElement.injector.get(ConfigService);
      configService.setConfig(GALLERY_ID, {
        previewConfig: PREVIEWS_CONFIG_HIDDEN
      });
      comp.id = GALLERY_ID;
      comp.currentImage = IMAGES[0];
      comp.images = IMAGES;
      comp.ngOnInit();
      fixture.detectChanges();

      const element: DebugElement = fixture.debugElement;

      const arrows: DebugElement[] = element.queryAll(By.css('a'));
      expect(arrows.length).toBe(0);

      const previewsContainer: DebugElement = element.query(By.css('nav.previews-container'));
      expect(previewsContainer.name).toBe('nav');
      // null because input accessibility is not provided in this test
      expect(previewsContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerAriaLabel);
      expect(previewsContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.previewsContainerTitle);

      const previews: DebugElement[] = element.queryAll(By.css('img'));
      expect(previews.length).toBe(0);
    });
  });
});
