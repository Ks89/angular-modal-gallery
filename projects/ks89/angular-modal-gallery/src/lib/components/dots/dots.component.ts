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

import { AccessibleComponent } from '../accessible.component';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { Image } from '../../model/image.class';
import { InternalLibImage } from '../../model/image-internal.class';
import { DotsConfig } from '../../model/dots-config.interface';

import { NEXT } from '../../utils/user-input.util';
import { getIndex } from '../../utils/image.util';
import { ConfigService } from '../../services/config.service';
import { LibConfig } from '../../model/lib-config.interface';

/**
 * Component with clickable dots (small circles) to navigate between images inside the modal gallery.
 */
@Component({
  selector: 'ks-dots',
  styleUrls: ['dots.scss'],
  templateUrl: 'dots.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotsComponent extends AccessibleComponent implements OnInit, OnChanges {
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
   * Object of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide this component.
   */
  @Input()
  dotsConfig: DotsConfig | undefined;

  /**
   * Output to emit clicks on dots. The payload contains a number that represent
   * the index of the clicked dot.
   */
  @Output()
  clickDot: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Object of type `DotsConfig` used in template.
   */
  configDots: DotsConfig | undefined;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  accessibilityConfig: AccessibilityConfig | undefined;

  constructor(private configService: ConfigService) {
    super();
  }

  /**
   * Method ´ngOnInit´ to build `configDots` applying a default value.
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
    this.configDots = Object.assign({}, this.dotsConfig);
  }

  /**
   * Method ´ngOnChanges´ to change `configDots` if the input dotsConfig is changed.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const dotsConfigChanges: SimpleChange = changes.dotsConfig;
    if (dotsConfigChanges && dotsConfigChanges.currentValue !== dotsConfigChanges.previousValue) {
      this.configDots = dotsConfigChanges.currentValue;
    }
  }

  /**
   * Method to check if an image is active (i.e. the current image).
   * It checks currentImage and images to prevent errors.
   * @param number index of the image to check if it's active or not
   * @returns boolean true if is active (and input params are valid), false otherwise
   */
  isActive(index: number): boolean {
    if (!this.currentImage || !this.images || this.images.length === 0) {
      return false;
    }
    let imageIndex: number;
    try {
      imageIndex = getIndex(this.currentImage, this.images);
    } catch (err) {
      console.error(`Internal error while trying to show the active 'dot'`, err);
      return false;
    }
    return index === imageIndex;
  }

  /**
   * Method called by events from keyboard and mouse.
   * @param number index of the dot
   * @param KeyboardEvent | MouseEvent event payload
   */
  onDotEvent(index: number, event: KeyboardEvent | MouseEvent): void {
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.clickDot.emit(index);
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
}
