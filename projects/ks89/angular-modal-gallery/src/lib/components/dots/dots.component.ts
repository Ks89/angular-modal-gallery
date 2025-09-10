/*
 The MIT License (MIT)

 Copyright (c) 2017-2025 Stefano Cappa (Ks89)

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

import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { NgClass } from '@angular/common';

import { AccessibleComponent } from '../accessible.component';

import { AccessibilityConfig } from '../../model/accessibility.interface';
import { DotsConfig } from '../../model/dots-config.interface';

import { NEXT } from '../../utils/user-input.util';
import { getIndex } from '../../utils/image.util';
import { Image } from '../../model/image.class';

/**
 * Component with clickable dots (small circles) to navigate between images inside the modal gallery.
 */
@Component({
  selector: 'ks-dots',
  styleUrls: ['dots.scss'],
  templateUrl: 'dots.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class DotsComponent extends AccessibleComponent {
  /**
   * Unique id (>=0) of the current instance of this library. This is required when you are using
   * the service to call modal gallery.
   */
  readonly id = input.required<number>();
  /**
   * Object of type `InternalLibImage` that represent the visible image.
   */
  readonly currentImage = input.required<Image>();
  /**
   * Array of `InternalLibImage` that represent the model of this library with all images,
   * thumbs and so on.
   */
  readonly images = input.required<Image[]>();
  /**
   * Object of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide this component.
   */
  readonly dotsConfig = input.required<DotsConfig>();
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  readonly accessibilityConfig = input.required<AccessibilityConfig>();

  /**
   * Output to emit clicks on dots. The payload contains a number that represent
   * the index of the clicked dot.
   */
  readonly clickDot = output<number>();

  /**
   * Method to check if an image is active (i.e. the current image).
   * It checks currentImage and images to prevent errors.
   * @param index number of the image to check if it's active or not
   * @returns boolean true if is active (and input params are valid), false otherwise
   */
  isActive(index: number): boolean {
    const currentImage = this.currentImage();
    const images = this.images();
    if (!currentImage || !images || images.length === 0) {
      return false;
    }
    let imageIndex: number;
    try {
      imageIndex = getIndex(currentImage, images);
    } catch (err) {
      console.error(`Internal error while trying to show the active 'dot'`, err);
      return false;
    }
    return index === imageIndex;
  }

  /**
   * Method called by events from keyboard and mouse.
   * @param index number of the dot
   * @param event KeyboardEvent | MouseEvent payload
   */
  onDotEvent(index: number, event: KeyboardEvent | MouseEvent): void {
    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      this.clickDot.emit(index);
    }
  }
}
