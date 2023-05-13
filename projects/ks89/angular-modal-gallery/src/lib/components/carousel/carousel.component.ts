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

// The idea to create a carousel with two Subjects came from ng-bootstrap
// So a big thank you to the ng-bootstrap team for the interesting implementation that I used here with some customizations.

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
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
import { Image, ImageEvent } from '../../model/image.class';
import { Action } from '../../model/action.enum';
import { getIndex } from '../../utils/image.util';
import { NEXT, PREV } from '../../utils/user-input.util';
import { DescriptionStrategy } from '../../model/description.interface';
import { DotsConfig } from '../../model/dots-config.interface';
import { CarouselConfig } from '../../model/carousel-config.interface';
import { CarouselImageConfig } from '../../model/carousel-image-config.interface';
import { ConfigService } from '../../services/config.service';
import { ModalGalleryService } from '../modal-gallery/modal-gallery.service';
import { CarouselLibConfig, LibConfig } from '../../model/lib-config.interface';
import { InternalLibImage } from '../../model/image-internal.class';

/**
 * Component with configurable inline/plain carousel.
 */
@Component({
  selector: 'ks-carousel',
  styleUrls: ['carousel.scss', '../image-arrows.scss'],
  templateUrl: 'carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigService]
})
export class CarouselComponent extends AccessibleComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {
  /**
   * Attribute to set ariaLabel of the host component
   */
  @HostBinding('attr.aria-label')
  ariaLabel = `Carousel`;
  /**
   * Unique id (>=0) of the current instance of the carousel. This is useful when you are using
   * the carousel's feature to open modal gallery.
   */
  @Input()
  id: number | undefined;
  /**
   * Array of `InternalLibImage` that represent the model of this library with all images,
   * thumbs and so on.
   */
  @Input()
  images: Image[] = [];
  /**
   * CarouselLibConfig object to configure carousel.
   */
  @Input()
  config: CarouselLibConfig | undefined;

  /**
   * Output to emit an event when an image is clicked.
   */
  @Output()
  clickImage: EventEmitter<number> = new EventEmitter<number>();
  /**
   * Output to emit an event when current image is changed.
   */
  @Output()
  changeImage: EventEmitter<ImageEvent> = new EventEmitter<ImageEvent>();
  /**
   * Output to emit an event when the current image is the first one.
   */
  @Output()
  firstImage: EventEmitter<ImageEvent> = new EventEmitter<ImageEvent>();
  /**
   * Output to emit an event when the current image is the last one.
   */
  @Output()
  lastImage: EventEmitter<ImageEvent> = new EventEmitter<ImageEvent>();

  /**
   * Object of type `CarouselConfig` to init CarouselComponent's features.
   * For instance, it contains parameters to change the style, how it navigates and so on.
   */
  carouselConfig: CarouselConfig | undefined;

  /**
   * Object of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide this component.
   */
  carouselDotsConfig: DotsConfig | undefined;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  accessibilityConfig: AccessibilityConfig | undefined;
  /**
   * Object of type `CarouselImageConfig` to configure the current image of the carousel.
   */
  carouselImageConfig: CarouselImageConfig | undefined;
  /**
   * Enable/disable infinite sliding.
   */
  carouselSlideInfinite: boolean | undefined;

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
   * `Image` that is visible right now.
   */
  currentImage: InternalLibImage | undefined;
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
   * Subject to play the carousel.
   */
  private start$ = new Subject<void>();
  /**
   * Subject to stop the carousel.
   */
  private stop$ = new Subject<void>();

  /**
   * Listener to stop the gallery when the mouse pointer is over the current image.
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    if (!libConfig.carouselPlayConfig || !libConfig.carouselPlayConfig.pauseOnHover) {
      return;
    }
    this.stopCarousel();
  }

  /**
   * Listener to play the gallery when the mouse pointer leave the current image.
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    if (!libConfig.carouselPlayConfig || !libConfig.carouselPlayConfig.pauseOnHover || !libConfig.carouselPlayConfig.autoPlay) {
      return;
    }
    this.playCarousel();
  }

  /**
   * Listener to navigate carousel images with keyboard (left).
   */
  @HostListener('keydown.arrowLeft')
  onKeyDownLeft(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    if (!libConfig.carouselConfig || !libConfig.carouselConfig.keyboardEnable) {
      return;
    }
    this.prevImage();
  }

  /**
   * Listener to navigate carousel images with keyboard (right).
   */
  @HostListener('keydown.arrowRight')
  onKeyDownLRight(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    if (!libConfig.carouselConfig || !libConfig.carouselConfig.keyboardEnable) {
      return;
    }
    this.nextImage();
  }

  constructor(
    // tslint:disable-next-line:no-any
    @Inject(PLATFORM_ID) private platformId: any,
    private ngZone: NgZone,
    private modalGalleryService: ModalGalleryService,
    private configService: ConfigService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    if (!this.images || this.images.length === 0) {
      throw new Error('Internal library error - images array must be defined and with at least an element');
    }
    this.configService.setConfig(this.id, this.config);

    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }

    this.currentImage = this.images[0] as InternalLibImage;
    this.carouselDotsConfig = libConfig.carouselDotsConfig;
    this.accessibilityConfig = libConfig.accessibilityConfig;
    this.carouselSlideInfinite = libConfig.carouselSlideInfinite;
    this.carouselConfig = libConfig.carouselConfig;
    this.carouselImageConfig = libConfig.carouselImageConfig;

    this.manageSlideConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }

    // this.configService.setConfig(this.id, this.config);
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }

    const configChange: SimpleChange = changes.config;

    // handle changes of dotsConfig.visible
    if (configChange &&
      !configChange.firstChange &&
      (configChange.previousValue.carouselDotsConfig?.visible !== configChange.currentValue.carouselDotsConfig?.visible || (!configChange.previousValue.carouselDotsConfig && !configChange.currentValue.carouselDotsConfig))
    ) {
      this.configService.setConfig(this.id, {
        carouselDotsConfig: configChange.currentValue?.carouselDotsConfig
      });
      this.carouselDotsConfig = configChange.currentValue?.carouselDotsConfig;
      this.ref.markForCheck();
    }
    // handle changes of carouselConfig.showArrows
    if (configChange &&
      !configChange.firstChange &&
      (configChange.previousValue.carouselConfig?.showArrows !== configChange.currentValue.carouselConfig?.showArrows || (!configChange.previousValue.carouselConfig && !configChange.currentValue.carouselConfig))
    ) {
      this.configService.setConfig(this.id, {
        carouselConfig: configChange.currentValue?.carouselConfig
      });
      this.carouselConfig = configChange.currentValue?.carouselConfig;
      this.ref.markForCheck();
    }
    // handle changes of playConfig starting/stopping the carousel accordingly
    if (configChange &&
      !configChange.firstChange &&
      (configChange.previousValue.carouselPlayConfig?.autoPlay !== configChange.currentValue.carouselPlayConfig?.autoPlay || (!configChange.previousValue.carouselPlayConfig && !configChange.currentValue.carouselPlayConfig))
    ) {
      this.configService.setConfig(this.id, {
        carouselPlayConfig: configChange.currentValue?.carouselPlayConfig
      });
      // this.configPlay = playConfigChange.currentValue;
      // if autoplay is enabled, and this is not the
      // first change (to prevent multiple starts at the beginning)
      if (configChange.currentValue.carouselPlayConfig?.autoPlay && !configChange.firstChange) {
        this.start$.next();
      } else {
        this.stopCarousel();
      }
      this.ref.markForCheck();
    }
  }

  ngAfterContentInit(): void {
    // interval doesn't play well with SSR and protractor,
    // so we should run it in the browser and outside Angular
    if (isPlatformBrowser(this.platformId)) {
      if (this.id === null || this.id === undefined) {
        throw new Error('Internal library error - id must be defined');
      }
      const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
      if (!libConfig || !libConfig.carouselPlayConfig) {
        throw new Error('Internal library error - libConfig and carouselPlayConfig must be defined');
      }
      this.ngZone.runOutsideAngular(() => {
        this.start$
          .pipe(
            map(() => libConfig?.carouselPlayConfig?.interval),
            // tslint:disable-next-line:no-any
            filter((interval: any) => interval > 0),
            switchMap(interval => timer(interval).pipe(takeUntil(this.stop$)))
          )
          .subscribe(() =>
            this.ngZone.run(() => {
              if (libConfig.carouselPlayConfig?.autoPlay) {
                this.nextImage();
              }
              this.ref.markForCheck();
            })
          );

        this.start$.next();
      });
    }
  }

  /**
   * Method called when a dot is clicked and used to update the current image.
   * @param number index of the clicked dot
   */
  onClickDot(index: number): void {
    this.changeCurrentImage(this.images[index] as InternalLibImage, Action.NORMAL);
  }

  /**
   * Method called by events from both keyboard and mouse on a navigation arrow.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action action that triggered the event or `Action.NORMAL` if not provided
   */
  onNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL): void {
    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.nextImage(action);
    } else if (result === PREV) {
      this.prevImage(action);
    }
  }

  /**
   * Method triggered when you click on the current image.
   * Also, if modalGalleryEnable is true, you can open the modal-gallery.
   */
  onClickCurrentImage(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig || !libConfig.carouselConfig || !this.currentImage) {
      throw new Error('Internal library error - libConfig, carouselConfig and currentImage must be defined');
    }
    if (!libConfig.carouselConfig.modalGalleryEnable) {
      return;
    }
    const index = getIndex(this.currentImage, this.images);
    this.clickImage.emit(index);
  }

  /**
   * Method to get the image description based on input params.
   * If you provide a full description this will be the visible description, otherwise,
   * it will be built using the `Description` object, concatenating its fields.
   * @param Image image to get its description. If not provided it will be the current image
   * @returns String description of the image (or the current image if not provided)
   * @throws an Error if description isn't available
   */
  getDescriptionToDisplay(image: Image | undefined = this.currentImage): string {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    const configCurrentImageCarousel: CarouselImageConfig | undefined = libConfig.carouselImageConfig;
    if (!configCurrentImageCarousel || !configCurrentImageCarousel.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }
    if (!image) {
      throw new Error('Internal library error - image must be defined');
    }
    const imageWithoutDescription: boolean = !image || !image.modal || !image.modal.description || image.modal.description === '';

    switch (configCurrentImageCarousel.description.strategy) {
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
   * Method used by SwipeDirective to support touch gestures (you can also invert the swipe direction with configCurrentImage.invertSwipe).
   * @param action String that represent the direction of the swipe action. 'swiperight' by default.
   */
  swipe(action = 'swiperight'): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig || !libConfig.carouselImageConfig) {
      throw new Error('Internal library error - libConfig and carouselImageConfig must be defined');
    }
    const configCurrentImageCarousel: CarouselImageConfig = libConfig.carouselImageConfig;
    switch (action) {
      case 'swiperight':
        if (configCurrentImageCarousel.invertSwipe) {
          this.prevImage(Action.SWIPE);
        } else {
          this.nextImage(Action.SWIPE);
        }
        break;
      case 'swipeleft':
        if (configCurrentImageCarousel.invertSwipe) {
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
   * Method to go back to the previous image.
   * @param action Enum of type `Action` that represents the source
   *  action that moved back to the previous image. `Action.NORMAL` by default.
   */
  prevImage(action: Action = Action.NORMAL): void {
    // check if prevImage should be blocked
    if (this.isPreventSliding(0)) {
      return;
    }
    this.changeCurrentImage(this.getPrevImage(), action);

    this.manageSlideConfig();

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
    this.changeCurrentImage(this.getNextImage(), action);

    this.manageSlideConfig();

    this.start$.next();
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
   * Method called when an image preview is clicked and used to update the current image.
   * @param event an ImageEvent object with the relative action and the index of the clicked preview.
   */
  onClickPreview(event: ImageEvent): void {
    const imageFound: InternalLibImage = this.images[event.result as number] as InternalLibImage;
    if (!!imageFound) {
      this.manageSlideConfig();
      this.changeCurrentImage(imageFound, event.action);
    }
  }

  /**
   * Method to play carousel.
   */
  playCarousel(): void {
    this.start$.next();
  }

  /**
   * Stops the carousel from cycling through items.
   */
  stopCarousel(): void {
    this.stop$.next();
  }

  // TODO remove this because duplicated
  /**
   * Method to get `alt attribute`.
   * `alt` specifies an alternate text for an image, if the image cannot be displayed.
   * @param Image image to get its alt description. If not provided it will be the current image
   * @returns String alt description of the image (or the current image if not provided)
   */
  getAltDescriptionByImage(image: Image | undefined = this.currentImage): string {
    if (!image) {
      return '';
    }
    return image.modal && image.modal.description ? image.modal.description : `Image ${getIndex(image, this.images) + 1}`;
  }

  // TODO remove this because duplicated
  /**
   * Method to get the title attributes based on descriptions.
   * This is useful to prevent accessibility issues, because if DescriptionStrategy is ALWAYS_HIDDEN,
   * it prevents an empty string as title.
   * @param Image image to get its description. If not provided it will be the current image
   * @returns String title of the image based on descriptions
   * @throws an Error if description isn't available
   */
  getTitleToDisplay(image: Image | undefined = this.currentImage): string {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig || !libConfig.carouselImageConfig) {
      throw new Error('Internal library error - libConfig and carouselImageConfig must be defined');
    }
    const configCurrentImageCarousel: CarouselImageConfig = libConfig.carouselImageConfig;
    if (!configCurrentImageCarousel || !configCurrentImageCarousel.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }
    const imageWithoutDescription: boolean = !image || !image.modal || !image.modal.description || image.modal.description === '';
    const description: string = this.buildTextDescription(image, imageWithoutDescription);
    return description;
  }

  /**
   * Method to reset carousel (force image with index 0 to be the current image and re-init also previews)
   */
  // temporary removed because never tested
  // reset() {
  //   if (this.configPlay && this.configPlay.autoPlay) {
  //     this.stopCarousel();
  //   }
  //   this.currentImage = this.images[0];
  //   this.handleBoundaries(0);
  //   if (this.configPlay && this.configPlay.autoPlay) {
  //     this.playCarousel();
  //   }
  //   this.ref.markForCheck();
  // }

  /**
   * Method to cleanup resources. In fact, this will stop the carousel.
   * This is an angular lifecycle hook that is called when this component is destroyed.
   */
  ngOnDestroy(): void {
    this.stopCarousel();
  }

  /**
   * Method to change the current image, receiving the new image as input the relative action.
   * @param image an Image object that represents the new image to set as current.
   * @param action Enum of type `Action` that represents the source action that triggered the change.
   */
  private changeCurrentImage(image: InternalLibImage, action: Action): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    this.currentImage = image;
    const index: number = getIndex(image, this.images);

    // emit first/last event based on newIndex value
    this.emitBoundaryEvent(action, index);

    // emit current visible image index
    this.changeImage.emit(new ImageEvent(this.id, action, index + 1));
  }

  /**
   * Private method to get the next index.
   * This is necessary because at the end, when you call next again, you'll go to the first image.
   * That happens because all modal images are shown like in a circle.
   */
  private getNextImage(): InternalLibImage {
    if (!this.currentImage) {
      throw new Error('Internal library error - currentImage must be defined');
    }
    const currentIndex: number = getIndex(this.currentImage, this.images);
    let newIndex = 0;
    if (currentIndex >= 0 && currentIndex < this.images.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0; // start from the first index
    }
    return this.images[newIndex] as InternalLibImage;
  }

  /**
   * Private method to get the previous index.
   * This is necessary because at index 0, when you call prev again, you'll go to the last image.
   * That happens because all modal images are shown like in a circle.
   */
  private getPrevImage(): InternalLibImage {
    if (!this.currentImage) {
      throw new Error('Internal library error - currentImage must be defined');
    }
    const currentIndex: number = getIndex(this.currentImage, this.images);
    let newIndex = 0;
    if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = this.images.length - 1; // start from the last index
    }
    return this.images[newIndex] as InternalLibImage;
  }

  /**
   * Private method to build a text description.
   * This is used also to create titles.
   * @param Image image to get its description. If not provided it will be the current image.
   * @param boolean imageWithoutDescription is a boolean that it's true if the image hasn't a 'modal' description.
   * @returns String description built concatenating image fields with a specific logic.
   */
  private buildTextDescription(image: Image | undefined, imageWithoutDescription: boolean): string {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig || !libConfig.carouselImageConfig) {
      throw new Error('Internal library error - libConfig and carouselImageConfig must be defined');
    }
    const configCurrentImageCarousel: CarouselImageConfig | undefined = libConfig.carouselImageConfig;
    if (!configCurrentImageCarousel || !configCurrentImageCarousel.description) {
      throw new Error('Description input must be a valid object implementing the Description interface');
    }
    if (!image) {
      throw new Error('Internal library error - image must be defined');
    }

    // If customFullDescription use it, otherwise proceed to build a description
    if (configCurrentImageCarousel.description.customFullDescription && configCurrentImageCarousel.description.customFullDescription !== '') {
      return configCurrentImageCarousel.description.customFullDescription;
    }

    const currentIndex: number = getIndex(image, this.images);
    // If the current image hasn't a description,
    // prevent to write the ' - ' (or this.description.beforeTextDescription)

    const prevDescription: string = configCurrentImageCarousel.description.imageText ? configCurrentImageCarousel.description.imageText : '';
    const midSeparator: string = configCurrentImageCarousel.description.numberSeparator ? configCurrentImageCarousel.description.numberSeparator : '';
    const middleDescription: string = currentIndex + 1 + midSeparator + this.images.length;

    if (imageWithoutDescription) {
      return prevDescription + middleDescription;
    }

    const currImgDescription: string = image.modal && image.modal.description ? image.modal.description : '';
    const endDescription: string = configCurrentImageCarousel.description.beforeTextDescription + currImgDescription;
    return prevDescription + middleDescription + endDescription;
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
      return;
    }
    switch (currentIndex) {
      case 0:
        // execute this only if infinite sliding is disabled
        this.isFirstImage = true;
        this.isLastImage = false;
        break;
      case this.images.length - 1:
        // execute this only if infinite sliding is disabled
        this.isFirstImage = false;
        this.isLastImage = true;
        break;
      default:
        this.isFirstImage = false;
        this.isLastImage = false;
        break;
    }
  }

  /**
   * Private method to manage boundary arrows and sliding.
   * This is based on the slideConfig input to enable/disable 'infinite sliding'.
   * @param number index of the visible image
   */
  private manageSlideConfig(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    if (!this.currentImage) {
      throw new Error('Internal library error - currentImage must be defined');
    }
    let index: number;
    try {
      index = getIndex(this.currentImage, this.images);
    } catch (err) {
      console.error('Cannot get the current image index in current-image');
      throw err;
    }

    if (libConfig.carouselSlideInfinite === true) {
      // enable infinite sliding
      this.isFirstImage = false;
      this.isLastImage = false;
    } else {
      this.handleBoundaries(index);
    }
  }

  /**
   * Private method to emit events when either the last or the first image are visible.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the first one or the last one.
   * @param indexToCheck is the index number of the image (the first or the last one).
   */
  private emitBoundaryEvent(action: Action, indexToCheck: number): void {
    if (this.id === null || this.id === undefined) {
      return;
    }
    // to emit first/last event
    switch (indexToCheck) {
      case 0:
        this.firstImage.emit(new ImageEvent(this.id, action, true));
        break;
      case this.images.length - 1:
        this.lastImage.emit(new ImageEvent(this.id, action, true));
        break;
    }
  }

  /**
   * Private method to check if next/prev actions should be blocked.
   * It checks if carouselSlideInfinite === false and if the image index is equals to the input parameter.
   * If yes, it returns true to say that sliding should be blocked, otherwise not.
   * @param number boundaryIndex that could be either the beginning index (0) or the last index
   *  of images (this.images.length - 1).
   * @returns boolean true if carouselSlideInfinite === false and the current index is
   *  either the first or the last one.
   */
  private isPreventSliding(boundaryIndex: number): boolean {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    if (!this.currentImage) {
      throw new Error('Internal library error - currentImage must be defined');
    }
    return !libConfig.carouselSlideInfinite && getIndex(this.currentImage, this.images) === boundaryIndex;
  }
}
