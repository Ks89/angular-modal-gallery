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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Image } from '../../model/image.class';
import { Size } from '../../model/size.interface';
import { GridLayout, LineLayout, PlainGalleryConfig, PlainGalleryStrategy } from '../../model/plain-gallery-config.interface';

import { getIndex } from '../../utils/image.util';
import { ConfigService } from '../../services/config.service';
import { NEXT } from '../../utils/user-input.util';
import { AccessibleComponent } from '../accessible.component';
import { PlainLibConfig, LibConfig } from '../../model/lib-config.interface';

/**
 * Component with the gallery of thumbs.
 * In receives an array of Images, a boolean to show/hide
 * the gallery (feature used by imagePointer) and a config
 * object to customize the behaviour of this component.
 * Also, it emits click events as outputs.
 */
@Component({
  selector: 'ks-plain-gallery',
  styleUrls: ['plain-gallery.scss'],
  templateUrl: 'plain-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlainGalleryComponent extends AccessibleComponent implements OnInit, OnChanges {
  /**
   * Unique id (>=0) of the current instance of this library. This is required when you are using
   * the service to call modal gallery.
   */
  @Input()
  id: number | undefined;

  /**
   * Array of `Image` that represent the model of this library with all images, thumbs and so on.
   */
  @Input()
  images: Image[] = [];
  /**
   * PlainLibConfig object to configure plain-gallery.
   */
  @Input()
  config: PlainLibConfig | undefined;

  /**
   * Output to emit an event when an image is clicked.
   */
  @Output()
  clickImage: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Object of type `PlainGalleryConfig` to configure the plain gallery.
   */
  plainGalleryConfig: PlainGalleryConfig | undefined;

  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  accessibilityConfig: AccessibilityConfig | undefined;

  /**
   * Bi-dimensional array of `Image` object to store images to display as plain gallery.
   * [] by default.
   */
  imageGrid: Image[][] = [];
  /**
   * Size object used in the template to resize images.
   */
  size: Size | undefined;
  /**
   * Boolean passed as input to `ks-wrap` directive to configure flex-wrap css property.
   * However it's not enough, because you need to limit the width using `widthStyle` public variable.
   * For more info check https://developer.mozilla.org/it/docs/Web/CSS/flex-wrap
   */
  wrapStyle = false;
  /**
   * String passed as input to `ks-wrap` directive to set width to be able to force overflow.
   * In this way, `wrapStyle` (flex-wrap css property) will be used as requested.
   */
  widthStyle = '';
  /**
   * String passed as input to `ks-direction` directive to set the flex-direction css property.
   * For more info check https://developer.mozilla.org/it/docs/Web/CSS/flex-direction
   */
  directionStyle: string | undefined;
  /**
   * String passed as input to `ks-direction` directive to set the justify-content css property.
   * For more info check https://developer.mozilla.org/it/docs/Web/CSS/justify-content
   */
  justifyStyle: string | undefined;

  constructor(private configService: ConfigService) {
    super();
  }

  /**
   * Method ´ngOnInit´ to init both `configPlainGallery` calling `initPlainGalleryConfig()`
   * and `imageGrid invoking `initImageGrid()`.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    this.configService.setConfig(this.id, this.config);

    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }
    this.accessibilityConfig = libConfig.accessibilityConfig;
    this.plainGalleryConfig = libConfig.plainGalleryConfig;
    this.initImageGrid();
  }

  /**
   * Method ´ngOnChanges´ to update both `imageGrid` and`plainGalleryConfig`.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }

    const imagesChange: SimpleChange = changes.images;
    const configChange: SimpleChange = changes.plainGalleryConfig;

    // I'm using !change.firstChange because the first time will be called both onInit and onChange and I don't
    // want to execute initialization two times.
    if (
      configChange &&
      !configChange.firstChange &&
      (configChange.previousValue !== configChange.currentValue || (!configChange.previousValue && !configChange.currentValue))
    ) {
      this.plainGalleryConfig = libConfig.plainGalleryConfig;
      // this.configPlainGallery = this.initPlainGalleryConfig();
    }
    if (imagesChange && !imagesChange.firstChange && imagesChange.previousValue !== imagesChange.currentValue) {
      this.initImageGrid();
    }
  }

  /**
   * Method called when you click on an image of the plain (or inline) gallery.
   * This will emit the show event with the image as payload.
   * @param Image img is the Image to show
   */
  showModalGalleryByImage(img: Image): void {
    const index: number = this.images.findIndex((val: Image) => val && img && val.id === img.id);
    this.showModalGallery(index);
  }

  /**
   * Method called when you navigate between images.
   * This will emit the show event with the image as payload.
   * @param KeyboardEvent event that triggered the navigation
   * @param Image img is the Image to show
   */
  onNavigationEvent(event: KeyboardEvent, img: Image): void {
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.showModalGalleryByImage(img);
    }
  }

  /**
   * Method to get `alt attribute`.
   * `alt` specifies an alternate text for an image, if the image cannot be displayed.
   * @param Image image to get its alt description.
   * @returns string alt description of the image
   */
  getAltPlainDescriptionByImage(image: Image): string {
    if (!image) {
      return '';
    }
    return image.plain && image.plain.description ? image.plain.description : `Image ${getIndex(image, this.images) + 1}`;
  }

  /**
   * Method to get the title for an image.
   * @param Image image to get its title
   * @returns string the title of the input image
   */
  getTitleDisplay(image: Image): string {
    let description = '';

    if (image.plain && image.plain.description) {
      description = image.plain.description;
    } else if (image.modal && image.modal.description) {
      description = image.modal.description;
    }

    const currentIndex: number = getIndex(image, this.images);
    const prevDescription: string = 'Image ' + (currentIndex + 1) + '/' + this.images.length;
    let currImgDescription: string = description ? description : '';

    if (currImgDescription !== '') {
      currImgDescription = ' - ' + currImgDescription;
    }
    return prevDescription + currImgDescription;
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
   * Method called when you click on an image of the plain (or inline) gallery.
   * This will emit the show event with the index number as payload.
   * @param number index of the clicked image
   */
  private showModalGallery(index: number): void {
    this.clickImage.emit(index);
  }

  /**
   * Private method to init both `imageGrid` and other style variables,
   * based on the layout type.
   */
  private initImageGrid(): void {
    if (!this.plainGalleryConfig) {
      throw new Error('Internal library error - plainGalleryConfig must be defined');
    }

    // reset the array to prevent issues in case of GridLayout
    this.imageGrid = [];

    if (this.plainGalleryConfig.layout instanceof LineLayout) {
      const layout: LineLayout = this.plainGalleryConfig.layout;
      const row: Image[] = this.images.filter((val: Image, i: number) => i < layout.breakConfig.length || layout.breakConfig.length === -1);
      this.imageGrid = [row];

      this.size = this.plainGalleryConfig.layout.size;

      switch (this.plainGalleryConfig.strategy) {
        case PlainGalleryStrategy.ROW:
          this.directionStyle = 'row';
          break;
        case PlainGalleryStrategy.COLUMN:
          this.directionStyle = 'column';
          this.wrapStyle = layout.breakConfig.wrap;
          break;
      }
      this.justifyStyle = layout.justify;
    }

    if (this.plainGalleryConfig.layout instanceof GridLayout) {
      const layout: GridLayout = this.plainGalleryConfig.layout;
      const count: number = Math.ceil(this.images.length / layout.breakConfig.length);
      let start = 0;
      let end: number = layout.breakConfig.length - 1;

      for (let j = 0; j < count; j++) {
        const row: Image[] = this.images.filter((val: Image, i: number) => i >= start && i <= end);
        this.imageGrid.push(row);
        start = end + 1;
        end = start + layout.breakConfig.length - 1;
      }

      this.size = this.plainGalleryConfig.layout.size;

      const pixels: number = +layout.size.width.replace('px', '');

      this.widthStyle = pixels * layout.breakConfig.length + pixels / 2 + 'px';
      this.wrapStyle = layout.breakConfig.wrap;

      this.directionStyle = 'row';
    }
  }
}
