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

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { AccessibleComponent } from '../accessible.component';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Action } from '../../model/action.enum';
import { DescriptionStrategy } from '../../model/description.interface';
import { Image, ImageModalEvent } from '../../model/image.class';
import { InternalLibImage } from '../../model/image-internal.class';
import { Keyboard } from '../../model/keyboard.enum';
import { KeyboardConfig } from '../../model/keyboard-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { NEXT, PREV } from '../../utils/user-input.util';
import { getIndex } from '../../utils/image.util';
import { CurrentImageConfig } from '../../model/current-image-config.interface';
import { ConfigService } from '../../services/config.service';
import { LibConfig } from '../../model/lib-config.interface';

/**
 * Interface to describe the Load Event, used to
 * emit an event when the image is finally loaded and the spinner has gone.
 */
export interface ImageLoadEvent {
  status: boolean;
  index: number;
  id: number;
}

/**
 * Component with the current image with some additional elements like arrows and side previews.
 */
@Component({
  selector: 'ks-current-image',
  styleUrls: ['current-image.scss', '../image-arrows.scss', 'current-image-previews.scss'],
  templateUrl: 'current-image.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentImageComponent extends AccessibleComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  /**
   * Unique id (>=0) of the current instance of this library. This is useful when you are using
   * the service to call modal gallery without open it manually.
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
   * Boolean that it is true if the modal gallery is visible.
   * If yes, also this component should be visible.
   */
  @Input()
  isOpen: boolean = false;

  /**
   * Output to emit an event when images are loaded. The payload contains an `ImageLoadEvent`.
   */
  @Output()
  loadImage: EventEmitter<ImageLoadEvent> = new EventEmitter<ImageLoadEvent>();
  /**
   * Output to emit any changes of the current image. The payload contains an `ImageModalEvent`.
   */
  @Output()
  changeImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  /**
   * Output to emit an event when the modal gallery is closed. The payload contains an `ImageModalEvent`.
   */
  @Output()
  closeGallery: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();

  /**
   * Subject to play modal-gallery.
   */
  private start$ = new Subject<void>();
  /**
   * Subject to stop modal-gallery.
   */
  private stop$ = new Subject<void>();

  /**
   * Enum of type `Action` that represents a normal action.
   * Declared here to be used inside the template.
   */
  normalAction: Action = Action.NORMAL;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  accessibilityConfig: AccessibilityConfig | undefined;
  /**
   * Object of type `SlideConfig` to get `infinite sliding`.
   */
  slideConfig: SlideConfig | undefined;
  /**
   * Object to configure current image in modal-gallery.
   * For instance you can disable navigation on click on current image (enabled by default).
   */
  currentImageConfig: CurrentImageConfig | undefined;
  /**
   * Object of type `KeyboardConfig` to assign custom keys to both ESC, RIGHT and LEFT keyboard's actions.
   */
  keyboardConfig: KeyboardConfig | undefined;
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
   * Boolean that it's true when you are watching the first image (currently visible).
   * False by default
   */
  isFirstImage = false;
  /**
   * Boolean that it's true when you are watching the last image (currently visible).
   * False by default
   */
  isLastImage = false;
  /**
   * Boolean that it's true if an image of the modal gallery is still loading.
   * True by default
   */
  loading = true;

  // use public ChangeDetectorRef to be able to call it from spec files to trigger change detection
  // tslint:disable-next-line:no-any
  constructor(@Inject(PLATFORM_ID) private platformId: any, private ngZone: NgZone,
              public ref: ChangeDetectorRef, private configService: ConfigService) {
    super();
  }

  /**
   * Listener to stop the gallery when the mouse pointer is over the current image.
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    // if carousel feature is disable, don't do anything in any case
    if (!this.slideConfig || !this.slideConfig.playConfig) {
      return;
    }
    if (!this.slideConfig.playConfig.pauseOnHover) {
      return;
    }
    this.stopCarousel();
  }

  /**
   * Listener to play the gallery when the mouse pointer leave the current image.
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    // if carousel feature is disable, don't do anything in any case
    if (!this.slideConfig || !this.slideConfig.playConfig) {
      return;
    }
    if (!this.slideConfig.playConfig.pauseOnHover || !this.slideConfig.playConfig.autoPlay) {
      return;
    }
    this.playCarousel();
  }

  /**
   * Method ´ngOnInit´ to init configuration.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig || !libConfig.buttonsConfig) {
      throw new Error('Internal library error - libConfig and buttonsConfig must be defined');
    }
    this.slideConfig = libConfig.slideConfig;
    this.accessibilityConfig = libConfig.accessibilityConfig;
    this.currentImageConfig = libConfig.currentImageConfig;
    this.keyboardConfig = libConfig.keyboardConfig;
  }

  /**
   * Method ´ngOnChanges´ to update `loading` status and emit events.
   * If the gallery is open, then it will also manage boundary arrows and sliding.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(changes: SimpleChanges): void {
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    const images: SimpleChange = changes.images;
    const currentImage: SimpleChange = changes.currentImage;

    if (currentImage && currentImage.previousValue !== currentImage.currentValue) {
      this.updateIndexes();
    } else if (images && images.previousValue !== images.currentValue) {
      this.updateIndexes();
    }

    const slideConfig: SimpleChange = changes.slideConfig;
    if (slideConfig && slideConfig.previousValue !== slideConfig.currentValue) {
      this.slideConfig = libConfig.slideConfig;
    }
  }

  /**
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   */
  ngAfterContentInit(): void {
    // interval doesn't play well with SSR and protractor,
    // so we should run it in the browser and outside Angular
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.start$
          .pipe(
            map(() => this.slideConfig && this.slideConfig.playConfig && this.slideConfig.playConfig.autoPlay && this.slideConfig.playConfig.interval),
            // tslint:disable-next-line:no-any
            filter((interval: any) => interval > 0),
            switchMap(interval => timer(interval).pipe(takeUntil(this.stop$)))
          )
          .subscribe(() =>
            this.ngZone.run(() => {
              if (!this.isLastImage) {
                this.nextImage(Action.AUTOPLAY);
              }
              this.ref.markForCheck();
            })
          );

        this.start$.next();
      });
    }
  }

  /**
   * Method to handle keypress based on the `keyboardConfig` input. It gets the code of
   * the key that triggered the keypress event to navigate between images or to close the modal gallery.
   * @param code string of the key that triggered the keypress event
   */
  onKeyPress(code: string): void {
    const esc: string = this.keyboardConfig && this.keyboardConfig.esc ? this.keyboardConfig.esc : Keyboard.ESC;
    const right: string = this.keyboardConfig && this.keyboardConfig.right ? this.keyboardConfig.right : Keyboard.RIGHT_ARROW;
    const left: string = this.keyboardConfig && this.keyboardConfig.left ? this.keyboardConfig.left : Keyboard.LEFT_ARROW;

    switch (code) {
      case esc:
        this.closeGallery.emit(new ImageModalEvent(this.id, Action.KEYBOARD, true));
        break;
      case right:
        this.nextImage(Action.KEYBOARD);
        break;
      case left:
        this.prevImage(Action.KEYBOARD);
        break;
    }
  }

  /**
   * Method to get the image description based on input params.
   * If you provide a full description this will be the visible description, otherwise,
   * it will be built using the `Description` object, concatenating its fields.
   * @param Image image to get its description. If not provided it will be the current image
   * @returns String description of the image (or the current image if not provided)
   * @throws an Error if description isn't available
   */
  getDescriptionToDisplay(image: Image = this.currentImage): string {
    if (!this.currentImageConfig || !this.currentImageConfig.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }

    const imageWithoutDescription: boolean = !image.modal || !image.modal.description || image.modal.description === '';

    switch (this.currentImageConfig.description.strategy) {
      case DescriptionStrategy.HIDE_IF_EMPTY:
        return imageWithoutDescription ? '' : image.modal.description + '';
      case DescriptionStrategy.ALWAYS_HIDDEN:
        return '';
      default:
        // ----------- DescriptionStrategy.ALWAYS_VISIBLE -----------------
        return this.buildTextDescription(image, imageWithoutDescription);
    }
  }

  /**
   * Method to get `alt attribute`.
   * `alt` specifies an alternate text for an image, if the image cannot be displayed.
   * @param Image image to get its alt description. If not provided it will be the current image
   * @returns String alt description of the image (or the current image if not provided)
   */
  getAltDescriptionByImage(image: Image = this.currentImage): string {
    if (!image) {
      return '';
    }
    return image.modal && image.modal.description ? image.modal.description : `Image ${getIndex(image, this.images) + 1}`;
  }

  /**
   * Method to get the title attributes based on descriptions.
   * This is useful to prevent accessibility issues, because if DescriptionStrategy is ALWAYS_HIDDEN,
   * it prevents an empty string as title.
   * @param Image image to get its description. If not provided it will be the current image
   * @returns String title of the image based on descriptions
   * @throws an Error if description isn't available
   */
  getTitleToDisplay(image: Image = this.currentImage): string {
    if (!this.currentImageConfig || !this.currentImageConfig.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }
    const imageWithoutDescription: boolean = !image.modal || !image.modal.description || image.modal.description === '';
    const description: string = this.buildTextDescription(image, imageWithoutDescription);
    return description;
  }

  /**
   * Method to get the left side preview image.
   * @returns Image the image to show as size preview on the left
   */
  getLeftPreviewImage(): Image {
    if (!this.slideConfig) {
      throw new Error('Internal library error - slideConfig must be defined');
    }
    const currentIndex: number = getIndex(this.currentImage, this.images);
    if (currentIndex === 0 && this.slideConfig.infinite) {
      // the current image is the first one,
      // so the previous one is the last image
      // because infinite is true
      return this.images[this.images.length - 1];
    }
    this.handleBoundaries(currentIndex);
    return this.images[Math.max(currentIndex - 1, 0)];
  }

  /**
   * Method to get the right side preview image.
   * @returns Image the image to show as size preview on the right
   */
  getRightPreviewImage(): Image {
    if (!this.slideConfig) {
      throw new Error('Internal library error - slideConfig must be defined');
    }
    const currentIndex: number = getIndex(this.currentImage, this.images);
    if (currentIndex === this.images.length - 1 && this.slideConfig.infinite) {
      // the current image is the last one,
      // so the next one is the first image
      // because infinite is true
      return this.images[0];
    }
    this.handleBoundaries(currentIndex);
    return this.images[Math.min(currentIndex + 1, this.images.length - 1)];
  }

  /**
   * Method called by events from both keyboard and mouse on an image.
   * This will invoke the nextImage method.
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action action that triggered the event or `Action.NORMAL` if not provided
   */
  onImageEvent(event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL): void {
    if (!this.currentImageConfig) {
      throw new Error('Internal library error - currentImageConfig must be defined');
    }
    // check if triggered by a mouse click
    // If yes, It should block navigation when navigateOnClick is false
    if (action === Action.CLICK && !this.currentImageConfig.navigateOnClick) {
      // a user has requested to block navigation via configCurrentImage.navigateOnClick property
      return;
    }

    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.nextImage(action);
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a navigation arrow.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action action that triggered the event or `Action.NORMAL` if not provided
   * @param boolean disable to disable navigation
   */
  onNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL, disable: boolean = false): void {
    if (disable) {
      return;
    }
    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.nextImage(action);
    } else if (result === PREV) {
      this.prevImage(action);
    }
  }

  /**
   * Method to go back to the previous image.
   * @param action Enum of type `Action` that represents the source
   *  action that moved back to the previous image. `Action.NORMAL` by default.
   */
  prevImage(action: Action = Action.NORMAL): void {
    // check if prevImage should be blocked
    if (this.isPreventSliding(0)) {
      return;
    }
    const prevImage: InternalLibImage = this.getPrevImage();
    this.loading = !prevImage.previouslyLoaded;
    this.changeImage.emit(new ImageModalEvent(this.id, action, getIndex(prevImage, this.images)));

    this.start$.next();
  }

  /**
   * Method to go back to the previous image.
   * @param action Enum of type `Action` that represents the source
   *  action that moved to the next image. `Action.NORMAL` by default.
   */
  nextImage(action: Action = Action.NORMAL): void {
    // check if nextImage should be blocked
    if (this.isPreventSliding(this.images.length - 1)) {
      return;
    }
    const nextImage: InternalLibImage = this.getNextImage();
    this.loading = !nextImage.previouslyLoaded;
    this.changeImage.emit(new ImageModalEvent(this.id, action, getIndex(nextImage, this.images)));

    this.start$.next();
  }

  /**
   * Method to emit an event as loadImage output to say that the requested image if loaded.
   * This method is invoked by the javascript's 'load' event on an img tag.
   * @param Event event that triggered the load
   */
  onImageLoad(event: Event): void {
    const loadImageData: ImageLoadEvent = {
      status: true,
      index: getIndex(this.currentImage, this.images),
      id: this.currentImage.id
    };

    this.loadImage.emit(loadImageData);

    this.loading = false;
  }

  /**
   * Method used by SwipeDirective to support touch gestures (you can also invert the swipe direction with configCurrentImage.invertSwipe).
   * @param action String that represent the direction of the swipe action. 'swiperight' by default.
   */
  swipe(action = 'swiperight'): void {
    if (!this.currentImageConfig) {
      throw new Error('Internal library error - currentImageConfig must be defined');
    }
    switch (action) {
      case 'swiperight':
        if (this.currentImageConfig.invertSwipe) {
          this.prevImage(Action.SWIPE);
        } else {
          this.nextImage(Action.SWIPE);
        }
        break;
      case 'swipeleft':
        if (this.currentImageConfig.invertSwipe) {
          this.nextImage(Action.SWIPE);
        } else {
          this.prevImage(Action.SWIPE);
        }
        break;
      // case this.SWIPE_ACTION.UP:
      //   break;
      // case this.SWIPE_ACTION.DOWN:
      //   break;
    }
  }

  /**
   * Method used in `modal-gallery.component` to get the index of an image to delete.
   * @param Image image to get the index, or the visible image, if not passed
   * @returns number the index of the image
   */
  getIndexToDelete(image: Image = this.currentImage): number {
    return getIndex(image, this.images);
  }

  /**
   * Method to play modal gallery.
   */
  playCarousel(): void {
    this.start$.next();
  }

  /**
   * Stops modal gallery from cycling through items.
   */
  stopCarousel(): void {
    this.stop$.next();
  }

  /**
   * Method to cleanup resources. In fact, this will stop the modal gallery.
   * This is an angular lifecycle hook that is called when this component is destroyed.
   */
  ngOnDestroy(): void {
    this.stopCarousel();
  }

  /**
   * Private method to update both `isFirstImage` and `isLastImage` based on
   * the index of the current image.
   * @param number currentIndex is the index of the current image
   */
  private handleBoundaries(currentIndex: number): void {
    if (this.images.length === 1) {
      this.isFirstImage = true;
      this.isLastImage = true;
      this.ref.markForCheck();
      return;
    }
    if (!this.slideConfig || this.slideConfig.infinite === true) {
      // infinite sliding enabled
      this.isFirstImage = false;
      this.isLastImage = false;
      this.ref.markForCheck();
    } else {
      // execute this only if infinite sliding is disabled
      switch (currentIndex) {
        case 0:
          this.isFirstImage = true;
          this.isLastImage = false;
          this.ref.markForCheck();
          break;
        case this.images.length - 1:
          this.isFirstImage = false;
          this.isLastImage = true;
          this.ref.markForCheck();
          break;
        default:
          this.isFirstImage = false;
          this.isLastImage = false;
          this.ref.markForCheck();
          break;
      }
    }
  }

  /**
   * Private method to check if next/prev actions should be blocked.
   * It checks if slideConfig.infinite === false and if the image index is equals to the input parameter.
   * If yes, it returns true to say that sliding should be blocked, otherwise not.
   * @param number boundaryIndex that could be either the beginning index (0) or the last index
   *  of images (this.images.length - 1).
   * @returns boolean true if slideConfig.infinite === false and the current index is
   *  either the first or the last one.
   */
  private isPreventSliding(boundaryIndex: number): boolean {
    return !!this.slideConfig && this.slideConfig.infinite === false && getIndex(this.currentImage, this.images) === boundaryIndex;
  }

  /**
   * Private method to get the next index.
   * This is necessary because at the end, when you call next again, you'll go to the first image.
   * That happens because all modal images are shown like in a circle.
   */
  private getNextImage(): InternalLibImage {
    const currentIndex: number = getIndex(this.currentImage, this.images);
    let newIndex = 0;
    if (currentIndex >= 0 && currentIndex < this.images.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0; // start from the first index
    }
    return this.images[newIndex];
  }

  /**
   * Private method to get the previous index.
   * This is necessary because at index 0, when you call prev again, you'll go to the last image.
   * That happens because all modal images are shown like in a circle.
   */
  private getPrevImage(): InternalLibImage {
    const currentIndex: number = getIndex(this.currentImage, this.images);
    let newIndex = 0;
    if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = this.images.length - 1; // start from the last index
    }
    return this.images[newIndex];
  }

  /**
   * Private method to build a text description.
   * This is used also to create titles.
   * @param Image image to get its description. If not provided it will be the current image.
   * @param boolean imageWithoutDescription is a boolean that it's true if the image hasn't a 'modal' description.
   * @returns String description built concatenating image fields with a specific logic.
   */
  private buildTextDescription(image: Image, imageWithoutDescription: boolean): string {
    if (!this.currentImageConfig || !this.currentImageConfig.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }

    // If customFullDescription use it, otherwise proceed to build a description
    if (this.currentImageConfig.description.customFullDescription && this.currentImageConfig.description.customFullDescription !== '') {
      return this.currentImageConfig.description.customFullDescription;
    }

    const currentIndex: number = getIndex(image, this.images);
    // If the current image hasn't a description,
    // prevent to write the ' - ' (or this.description.beforeTextDescription)

    const prevDescription: string = this.currentImageConfig.description.imageText ? this.currentImageConfig.description.imageText : '';
    const midSeparator: string = this.currentImageConfig.description.numberSeparator ? this.currentImageConfig.description.numberSeparator : '';
    const middleDescription: string = currentIndex + 1 + midSeparator + this.images.length;

    if (imageWithoutDescription) {
      return prevDescription + middleDescription;
    }

    const currImgDescription: string = image.modal && image.modal.description ? image.modal.description : '';
    const endDescription: string = this.currentImageConfig.description.beforeTextDescription + currImgDescription;
    return prevDescription + middleDescription + endDescription;
  }

  /**
   * Private method to call handleBoundaries when ngOnChanges is called.
   */
  private updateIndexes(): void {
    try {
      if (this.isOpen) {
        const index: number = getIndex(this.currentImage, this.images);
        this.handleBoundaries(index);
      }
    } catch (err) {
      console.error('Cannot get the current image index in current-image');
      throw err;
    }
  }
}
