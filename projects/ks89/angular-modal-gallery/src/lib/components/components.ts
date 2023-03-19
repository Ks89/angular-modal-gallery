/*
 The MIT License (MIT)

 Copyright (c) 2017-2023 Stefano Cappa (Ks89)

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

import { CarouselComponent } from './carousel/carousel.component';
import { CarouselPreviewsComponent } from './carousel/carousel-previews/carousel-previews.component';
import { UpperButtonsComponent } from './upper-buttons/upper-buttons.component';
import { DotsComponent } from './dots/dots.component';
import { PreviewsComponent } from './previews/previews.component';
import { CurrentImageComponent } from './current-image/current-image.component';
import { LoadingSpinnerComponent } from './current-image/loading-spinner/loading-spinner.component';
import { AccessibleComponent } from './accessible.component';
import { PlainGalleryComponent } from './plain-gallery/plain-gallery.component';
export { CarouselComponent } from './carousel/carousel.component';
import { ModalGalleryComponent } from './modal-gallery/modal-gallery.component';

/**
 * Array of all components.
 */
export const COMPONENTS = [
  PlainGalleryComponent,
  CarouselComponent,
  CarouselPreviewsComponent,
  UpperButtonsComponent,
  DotsComponent,
  PreviewsComponent,
  CurrentImageComponent,
  LoadingSpinnerComponent,
  AccessibleComponent,

  ModalGalleryComponent
];
