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

import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, TemplateRef } from '@angular/core';

import { AccessibleComponent } from '../accessible.component';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Image, ImageEvent, ImageModalEvent } from '../../model/image.class';
import { InternalLibImage } from '../../model/image-internal.class';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';

import { NEXT, PREV } from '../../utils/user-input.util';
import { getIndex } from '../../utils/image.util';
import { Action } from '../../model/action.enum';
import { ConfigService, DEFAULT_PREVIEW_SIZE } from '../../services/config.service';
import { Size } from '../../model/size.interface';
import { LibConfig } from '../../model/lib-config.interface';

/**
 * Component with image previews
 */
@Component({
  selector: 'ks-previews',
  styleUrls: ['previews.scss', '../previews-arrows.scss'],
  templateUrl: 'previews.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewsComponent extends AccessibleComponent implements OnInit, OnChanges {
  /**
   * Unique id (>=0) of the current instance of this library. This is required when you are using
   * the service to call modal gallery.
   */
  @Input()
  id: number | undefined;
  /**
   * Object of type `InternalLibImage` that represent the visible image.
   */
  @Input()
  currentImage: InternalLibImage | undefined;
  /**
   * Array of `InternalLibImage` that represent the model of this library with all images,
   * thumbs and so on.
   */
  @Input()
  images: InternalLibImage[] | undefined;

  /**
   * Optional template reference for the rendering of previews.
   * Template may access following context variables:
   * - preview: the `Image` object
   * - defaultTemplate: the template used by default to render the preview (in case the need is to wrap it)
   */
  @Input()
  customTemplate?: TemplateRef<HTMLElement>;

  /**
   * Output to emit the clicked preview. The payload contains the `ImageEvent` associated to the clicked preview.
   */
  @Output()
  clickPreview: EventEmitter<ImageEvent> = new EventEmitter<ImageEvent>();

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
   * Object of type `PreviewConfig` to init PreviewsComponent's features.
   * For instance, it contains a param to show/hide this component, sizes.
   */
  previewConfig: PreviewConfig | undefined;
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
   * Start index (included) of the input images used to display previews.
   */
    // @ts-ignore
  start: number;
  /**
   * End index (excluded) of the input images used to display previews.
   */
    // @ts-ignore
  end: number;

  defaultPreviewSize: Size = DEFAULT_PREVIEW_SIZE;

  constructor(private configService: ConfigService) {
    super();
  }

  /**
   * Method ´ngOnInit´ to build `configPreview` applying a default value and also to
   * init the `previews` array.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    this.accessibilityConfig = libConfig.accessibilityConfig;
    this.slideConfig = libConfig.slideConfig;
    this.previewConfig = libConfig.previewConfig;
    if (!this.currentImage || !this.images) {
      throw new Error('Internal library error - currentImage and images must be defined');
    }
    this.initPreviews(this.currentImage, this.images);
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
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(changes: SimpleChanges): void {

    let currentImage = changes.currentImage?.currentValue ?? this.currentImage;
    let images = changes.images?.currentValue ?? this.images;

    if(this.previewConfig && currentImage && images) {
      this.initPreviews( currentImage, images);
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a preview.
   * This will trigger the `clickpreview` output with the input preview as its payload.
   * @param InternalLibImage preview that triggered this method
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action action that triggered the source event or `Action.NORMAL` if not specified
   */
  onImageEvent(preview: InternalLibImage, event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL): void {
    // It's suggested to stop propagation of the event, so the
    // Cdk background will not catch a click and close the modal (like it does on Windows Chrome/FF).
    event?.stopPropagation();
    if (!this.id || !this.images) {
      throw new Error('Internal library error - id and images must be defined');
    }
    if (!this.previewConfig || !this.previewConfig.clickable) {
      return;
    }
    const result: number = super.handleImageEvent(event);
    if (result === NEXT || result === PREV) {
      this.clickPreview.emit(new ImageModalEvent(this.id, action, getIndex(preview, this.images)));
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a navigation arrow.
   * It also emits an event to specify which arrow.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action action that triggered the source event or `Action.NORMAL` if not specified
   */
  onNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent, action: Action = Action.NORMAL): void {
    const result: number = super.handleNavigationEvent(direction, event);
    if (result === NEXT) {
      this.next();
    } else if (result === PREV) {
      this.previous();
    }
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
   * Indicates if the previews 'left arrow' should be displayed or not.
   * @returns
   */
  displayLeftPreviewsArrow(): boolean {
    // Don't show arrows if requested previews number equals or is greated than total number of imgaes
    if(this.previewConfig?.number !== undefined && this.images && this.previewConfig?.number >= this.images?.length) {
      return false;
    }
    return (this.previewConfig?.arrows && this.start > 0) || !!this.slideConfig?.infinite;
  }

  /**
   * Indicates if the previews 'right arrow' should be displayed or not.
   * @returns
   */
  displayRightPreviewsArrow(): boolean {
    // Don't show arrows if requested previews number equals or is greated than total number of imgaes
    if(this.previewConfig?.number !== undefined && this.images && this.previewConfig?.number >= this.images?.length) {
      return false;
    }
    return (this.previewConfig?.arrows && this.images && this.end < this.images.length) || !!this.slideConfig?.infinite;
  }

  /**
   * Private method to init previews based on the currentImage and the full array of images.
   * The current image in mandatory to show always the current preview (as highlighted).
   * @param InternalLibImage currentImage to decide how to show previews, because I always want to see the current image as highlighted
   * @param InternalLibImage[] images is the array of all images.
   */
  private initPreviews(currentImage: InternalLibImage, images: InternalLibImage[]): void {
    this.setIndexesPreviews(currentImage, images);
    this.previews = images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  /**
   * Private method to update both `start` and `end` based on the currentImage.
   */
  private setIndexesPreviews(currentImage: InternalLibImage, images: InternalLibImage[]): void {
    if (!this.previewConfig || !images || !currentImage) {
      throw new Error('Internal library error - previewConfig, currentImage and images must be defined');
    }
    const previewsNumber = this.previewConfig.number as number;
    let start = getIndex(currentImage, images) - Math.floor(previewsNumber / 2);
    // start is, at a minimum, the first index
    if(start < 0) start = 0;
    // end index
    let end = start + previewsNumber;
    // end is, at a maximum, the last index
    if(end > images.length) {
      start -= end - images.length;
      if(start < 0) start = 0; // start is, at a minimum, the first index
      end = images.length;
    }
    this.start = start;
    this.end = end;
  }

  /**
   * Private method to update the visible previews navigating to the right (next).
   */
  private next(): void {
    if (!this.images || !this.previewConfig) {
      throw new Error('Internal library error - images must be defined');
    }
    if(this.end >= this.images.length) {
      // check if nextImage should be blocked
      const preventSliding = !!this.slideConfig && this.slideConfig.infinite === false;
      if(preventSliding) {
        return;
      }
      this.start = 0;
    } else {
      this.start++;
    }
    this.end = this.start + Math.min((this.previewConfig.number as number), this.images.length);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

  /**
   * Private method to update the visible previews navigating to the left (previous).
   */
  private previous(): void {
    if (!this.images || !this.previewConfig) {
      throw new Error('Internal library error - images must be defined');
    }
    if(this.start <= 0) {
      // check if prevImage should be blocked
      const preventSliding = !!this.slideConfig && this.slideConfig.infinite === false;
      if(preventSliding) {
        return;
      }
      this.end = this.images.length;
    } else {
      this.end--;
    }
    this.start = this.end - Math.min((this.previewConfig.number as number), this.images.length);

    this.previews = this.images.filter((img: InternalLibImage, i: number) => i >= this.start && i < this.end);
  }

}
