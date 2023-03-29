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

import { SlideConfig } from './slide-config.interface';
import { AccessibilityConfig } from './accessibility.interface';
import { PreviewConfig } from './preview-config.interface';
import { ButtonsConfig } from './buttons-config.interface';
import { DotsConfig } from './dots-config.interface';
import { PlainGalleryConfig } from './plain-gallery-config.interface';
import { CurrentImageConfig } from './current-image-config.interface';
import { KeyboardConfig } from './keyboard-config.interface';
import { CarouselConfig } from './carousel-config.interface';
import { CarouselImageConfig } from './carousel-image-config.interface';
import { CarouselPreviewConfig } from './carousel-preview-config.interface';
import { PlayConfig } from './play-config.interface';

export interface AccessibleLibConfig {
  accessibilityConfig?: AccessibilityConfig;
}

export interface CommonLibConfig {
  previewConfig?: PreviewConfig;
  dotsConfig?: DotsConfig;
  slideConfig?: SlideConfig;
}

export interface CarouselLibConfig extends CommonLibConfig, AccessibleLibConfig {
  carouselConfig?: CarouselConfig;
  carouselImageConfig?: CarouselImageConfig;
  carouselPreviewsConfig?: CarouselPreviewConfig;
  carouselPlayConfig?: PlayConfig;
  carouselDotsConfig?: DotsConfig;
  carouselSlideInfinite?: boolean;
}

export interface ModalLibConfig extends CommonLibConfig, AccessibleLibConfig {
  enableCloseOutside?: boolean;
  keyboardConfig?: KeyboardConfig;
  currentImageConfig?: CurrentImageConfig;
  buttonsConfig?: ButtonsConfig;
}

export interface PlainLibConfig extends AccessibleLibConfig {
  plainGalleryConfig?: PlainGalleryConfig;
}

export interface LibConfig extends ModalLibConfig, PlainLibConfig, CarouselLibConfig {}
