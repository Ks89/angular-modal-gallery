/*
 The MIT License (MIT)

 Copyright (C) 2017-2021 Stefano Cappa (Ks89)

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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { Subscription } from 'rxjs';

import { AccessibleComponent } from '../../accessible.component';

import { AccessibilityConfig } from '../../../model/accessibility.interface';
import { Image, ImageEvent } from '../../../model/image.class';
import { InternalLibImage } from '../../../model/image-internal.class';
import { CarouselPreviewConfig } from '../../../model/carousel-preview-config.interface';
import { CarouselConfig } from '../../../model/carousel-config.interface';

import { NEXT, PREV } from '../../../utils/user-input.util';
import { getIndex } from '../../../utils/image.util';
import { Action } from '../../../model/action.enum';
import { ConfigService } from '../../../services/config.service';
import { LibConfig } from '../../../model/lib-config.interface';

/**
 * Default max height of previews.
 */
const DEFAULT_MAX_HEIGHT = '200px';

/**
 * Component with image previews for carousel
 */
@Component({
  selector: 'ks-carousel-previews',
  styleUrls: ['carousel-previews.scss', '../../previews-arrows.scss'],
  templateUrl: 'carousel-previews.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselPreviewsComponent extends AccessibleComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Variable to change the max-width of the host component
   */
  @HostBinding('style.max-width')
  hostMaxWidth = '100%';

  /**
   * Variable to set aria-label of the host component
   */
  @HostBinding('attr.aria-label')
  ariaLabel = `Carousel previews`;

  /**
   * TODO write doc
   */
  @Input()
  id!: number;
  /**
   * Object of type `InternalLibImage` that represent the visible image.
   */
  @Input()
  currentImage!: InternalLibImage;
  /**
   * Array of `InternalLibImage` that represent the model of this library with all images,
   * thumbs and so on.
   */
  @Input()
  images!: InternalLibImage[];

  /**
   * Output to emit the clicked preview. The payload contains the `InternalLibImage` associated to the clicked preview.
   */
  @Output()
  clickPreview: EventEmitter<ImageEvent> = new EventEmitter<ImageEvent>();

  /**
   * Object of type `CarouselConfig` to init CarouselComponent's features.
   * For instance, it contains parameters to change the style, how it navigates and so on.
   */
  carouselConfig: CarouselConfig | undefined;
  /**
   * Object of type `CarouselPreviewConfig` to init PreviewsComponent's features.
   * For instance, it contains a param to show/hide this component, sizes.
   */
  previewConfig: CarouselPreviewConfig | undefined;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  accessibilityConfig: AccessibilityConfig | undefined;
  /**
   * Enum of type `Action` that represents a mouse click on a button.
   * Declared here to be used inside the template.
   */
  clickAction: Action = Action.CLICK;
  /**
   * Enum of type `Action` that represents a keyboard action.
   * Declared here to be used inside the template.
   */
  keyboardAction: Action = Action.KEYBOARD;
  /**
   * Array of `InternalLibImage` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  previews: InternalLibImage[] = [];
  /**
   * Variable with the preview's maxHeight
   */
  previewMaxHeight: string = DEFAULT_MAX_HEIGHT;
  /**
   * Start index (inclusive) of the input images used to display previews.
   */
  // @ts-ignore
  start: number;
  /**
   * End index (non inclusive) of the input images used to display previews.
   */
  // @ts-ignore
  end: number;

  private readonly breakpointSubscription: Subscription;

  constructor(
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    // sanitizer is used only to sanitize style before add it to background property when legacyIE11Mode is enabled
    private sanitizer: DomSanitizer,
    private configService: ConfigService
  ) {
    super();

    // listen for width changes and update preview heights accordingly
    this.breakpointSubscription = breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result: BreakpointState) => {
        if (!this.previewConfig || !this.previewConfig.breakpoints) {
          return;
        }
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.updateHeight(this.previewConfig.breakpoints.xSmall);
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.updateHeight(this.previewConfig.breakpoints.small);
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.updateHeight(this.previewConfig.breakpoints.medium);
        } else if (result.breakpoints[Breakpoints.Large]) {
          this.updateHeight(this.previewConfig.breakpoints.large);
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.updateHeight(this.previewConfig.breakpoints.xLarge);
        }
      });
  }

  /**
   * Method to update the height of previews, passing the desired height as input.
   * @param configBreakpointHeight is a number that represent the desired height to set.
   */
  private updateHeight(configBreakpointHeight: number): void {
    if (this.previewConfig && this.previewConfig.maxHeight) {
      const heightNum: number = +this.previewConfig.maxHeight.replace('/px/g', '').replace('/%/g', '');
      this.previewMaxHeight = Math.min(configBreakpointHeight, heightNum) + 'px';
    } else {
      const heightNum: number = +DEFAULT_MAX_HEIGHT.replace('/px/g', '').replace('/%/g', '');
      this.previewMaxHeight = Math.min(configBreakpointHeight, heightNum) + 'px';
    }
    this.ref.markForCheck();
  }

  /**
   * Method ´ngOnInit´ to build `configPreview` applying a default value and also to
   * init the `previews` array.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    this.carouselConfig = libConfig.carouselConfig;
    this.previewConfig = libConfig.carouselPreviewsConfig;
    this.accessibilityConfig = libConfig.accessibilityConfig;

    if (!this.previewConfig || !this.previewConfig.maxHeight || !this.previewConfig.breakpoints) {
      throw new Error('Internal library error - previewConfig must be defined');
    }
    // change the max-width of this component if there is a specified width !== 100% in carouselConfig
    if (this.carouselConfig && this.carouselConfig.maxWidth !== '100%') {
      this.hostMaxWidth = this.carouselConfig.maxWidth;
    }

    this.previewMaxHeight = this.previewConfig.maxHeight;
    // init previews based on currentImage and the full array of images
    this.initPreviews(this.currentImage, this.images);

    // apply custom height based on responsive breakpoints
    // This is required, because the breakpointSubscription is not triggered at creation,
    // but only when the width changes
    const isXsmallScreen = this.breakpointObserver.isMatched(Breakpoints.XSmall);
    const isSmallScreen = this.breakpointObserver.isMatched(Breakpoints.Small);
    const isMediumScreen = this.breakpointObserver.isMatched(Breakpoints.Medium);
    const isLargeScreen = this.breakpointObserver.isMatched(Breakpoints.Large);
    const isxLargeScreen = this.breakpointObserver.isMatched(Breakpoints.XLarge);
    if (isXsmallScreen) {
      this.updateHeight(this.previewConfig.breakpoints.xSmall);
    } else if (isSmallScreen) {
      this.updateHeight(this.previewConfig.breakpoints.small);
    } else if (isMediumScreen) {
      this.updateHeight(this.previewConfig.breakpoints.medium);
    } else if (isLargeScreen) {
      this.updateHeight(this.previewConfig.breakpoints.large);
    } else if (isxLargeScreen) {
      this.updateHeight(this.previewConfig.breakpoints.xLarge);
    }
  }

  /**
   * Method to check if an image is active (i.e. a preview image).
   * @param InternalLibImage preview is an image to check if it's active or not
   * @returns boolean true if is active, false otherwise
   */
  isActive(preview: InternalLibImage): boolean {
    if (!preview || !this.currentImage) {
      return false;
    }
    return preview.id === this.currentImage.id;
  }

  /**
   * Method ´ngOnChanges´ to update `previews` array.
   * Also, both `start` and `end` local variables will be updated accordingly.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(changes: SimpleChanges): void {
    const simpleChange: SimpleChange = changes.currentImage;
    if (!simpleChange) {
      return;
    }

    const prev: InternalLibImage = simpleChange.previousValue;
    const current: InternalLibImage = simpleChange.currentValue;

    if (current && changes.images && changes.images.previousValue && changes.images.currentValue) {
      // I'm in this if statement, if input images are changed (for instance, because I removed one of them with the 'delete button',
      // or because users changed the images array while modal gallery is still open).
      // In this case, I have to re-init previews, because the input array of images is changed.
      this.initPreviews(current, changes.images.currentValue);
    }

    if (prev && current && prev.id !== current.id) {
      // to manage infinite sliding I have to reset both `start` and `end` at the beginning
      // to show again previews from the first image.
      // This happens when you navigate over the last image to return to the first one
      let prevIndex: number;
      let currentIndex: number;
      try {
        prevIndex = getIndex(prev, this.images);
        currentIndex = getIndex(current, this.images);
      } catch (err) {
        console.error('Cannot get previous and current image indexes in previews');
        throw err;
      }

      // apply a formula to get a values to be used to decide if go next, return back or stay without doing anything
      const calc = Math.floor((this.end - this.start) / 2) + this.start;

      if (prevIndex === this.images.length - 1 && currentIndex === 0) {
        // first image
        this.setBeginningIndexesPreviews();
        this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
        return;
      }
      // the same for the opposite case, when you navigate back from the fist image to go to the last one.
      if (prevIndex === 0 && currentIndex === this.images.length - 1) {
        // last image
        this.setEndIndexesPreviews();
        this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
        return;
      }

      if (this.previewConfig && (this.previewConfig.number as number) % 2 === 0) {
        if (calc > currentIndex) {
          this.previous();
        } else {
          this.next();
        }
      } else {
        if (calc > currentIndex) {
          this.previous();
        }
        if (calc < currentIndex) {
          this.next();
        }
      }
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a preview.
   * This will trigger the `clickpreview` output with the input preview as its payload.
   * @param InternalLibImage preview that triggered this method
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action that triggered this event (Action.NORMAL by default)
   */
  onImageEvent(preview: InternalLibImage, event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL): void {
    if (!this.previewConfig || !this.previewConfig.clickable) {
      return;
    }
    const clickedImageIndex: number = this.images.indexOf(preview);
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.clickPreview.emit({ action, result: clickedImageIndex } as ImageEvent);
    } else if (result === PREV) {
      this.clickPreview.emit({ action, result: clickedImageIndex } as ImageEvent);
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a navigation arrow.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param KeyboardEvent | MouseEvent event payload
   */
  onNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent): void {
    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.next();
    } else if (result === PREV) {
      this.previous();
    }
  }

  /**
   * Method to get aria-label text for a preview image.
   * @param Image is the preview
   */
  getAriaLabel(preview: Image): string {
    if (!preview.plain) {
      return preview.modal.ariaLabel || '';
    }
    return preview.plain.ariaLabel || preview.modal.ariaLabel || '';
  }

  /**
   * Method to get title text for a preview image.
   * @param Image is the preview
   */
  getTitle(preview: Image): string {
    if (!preview.plain) {
      return preview.modal.title || '';
    }
    return preview.plain.title || preview.modal.title || '';
  }

  /**
   * Method to get alt text for a preview image.
   * @param Image is the preview
   */
  getAlt(preview: Image): string {
    if (!preview.plain) {
      return preview.modal.alt || '';
    }
    return preview.plain.alt || preview.modal.alt || '';
  }

  /**
   * Method used in the template to track ids in ngFor.
   * @param number index of the array
   * @param Image item of the array
   * @returns number the id of the item
   */
  trackById(index: number, item: Image): number {
    return item.id;
  }

  /**
   * Method used in template to sanitize an url when you need legacyIE11Mode.
   * In this way you can set an url as background of a div.
   * @param unsafeStyle is a string or a SafeResourceUrl that represents the url to sanitize.
   * @param unsafeStyleFallback is a string or a SafeResourceUrl that represents the fallback url to sanitize.
   * @returns a SafeStyle object that can be used in template without problems.
   */
  sanitizeUrlBgStyle(unsafeStyle: string | SafeResourceUrl, unsafeStyleFallback: string | SafeResourceUrl): SafeStyle {
    // Method used only to sanitize background-image style before add it to background property when legacyIE11Mode is enabled
    let bg: string = 'url(' + unsafeStyle + ')';
    if (!!unsafeStyleFallback) {
      // if a fallback image is defined, append it. In this way, it will be used by the browser as fallback.
      bg += ', ' + 'url(' + unsafeStyleFallback + ')';
    }
    return this.sanitizer.bypassSecurityTrustStyle(bg);
  }

  /**
   * Method to cleanup resources. In fact, it cleans breakpointSubscription.
   * This is an angular lifecycle hook that is called when this component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  /**
   * Private method to init previews based on the currentImage and the full array of images.
   * The current image in mandatory to show always the current preview (as highlighted).
   * @param InternalLibImage currentImage to decide how to show previews, because I always want to see the current image as highlighted
   * @param InternalLibImage[] images is the array of all images.
   */
  private initPreviews(currentImage: InternalLibImage, images: InternalLibImage[]): void {
    let index: number;
    try {
      index = getIndex(currentImage, images);
    } catch (err) {
      throw err;
    }
    switch (index) {
      case 0:
        // first image
        this.setBeginningIndexesPreviews();
        break;
      case images.length - 1:
        // last image
        this.setEndIndexesPreviews();
        break;
      // default:
      //   // other images
      //   // TODO unused because it starts always at image 0
      //   this.setIndexesPreviews();
      //   break;
    }
    this.previews = images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  /**
   * Private method to init both `start` and `end` to the beginning.
   */
  private setBeginningIndexesPreviews(): void {
    if (!this.previewConfig || this.previewConfig.number === undefined) {
      throw new Error('Internal library error - previewConfig and number must be defined');
    }

    this.start = 0;
    this.end = Math.min(this.previewConfig.number as number, this.images.length);
  }

  /**
   * Private method to init both `start` and `end` to the end.
   */
  private setEndIndexesPreviews(): void {
    if (!this.previewConfig || this.previewConfig.number === undefined) {
      throw new Error('Internal library error - previewConfig and number must be defined');
    }

    this.start = this.images.length - 1 - ((this.previewConfig.number as number) - 1);
    this.end = this.images.length;
  }

  /**
   * Private method to update the visible previews navigating to the right (next).
   */
  private next(): void {
    // check if nextImage should be blocked
    if (this.isPreventSliding(this.images.length - 1)) {
      return;
    }

    if (this.end === this.images.length) {
      return;
    }

    this.start++;
    this.end = Math.min(this.end + 1, this.images.length);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  /**
   * Private method to update the visible previews navigating to the left (previous).
   */
  private previous(): void {
    // check if prevImage should be blocked
    if (this.isPreventSliding(0)) {
      return;
    }

    if (this.start === 0) {
      return;
    }

    this.start = Math.max(this.start - 1, 0);
    this.end = Math.min(this.end - 1, this.images.length);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  /**
   * Private method to block/permit sliding between previews.
   * @param number boundaryIndex is the first or the last index of `images` input array
   * @returns boolean if true block sliding, otherwise not
   */
  private isPreventSliding(boundaryIndex: number): boolean {
    return getIndex(this.currentImage, this.images) === boundaryIndex;
  }
}
