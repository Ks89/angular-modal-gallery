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

import { Action } from './action.enum';
import { Size } from './size.interface';
import { SafeResourceUrl } from '@angular/platform-browser';

/**
 * Class `Image` that represents an image with both `modal` and `plain` configurations.
 * Both image `id` and `modal` are mandatory, instead `plain` is optional.
 */
export class Image {
  id: number;
  loading: 'eager' | 'lazy';
  fetchpriority: 'high' | 'low' | 'auto';
  modal: ModalImage;
  plain?: PlainImage;

  constructor(id: number, modal: ModalImage, plain?: PlainImage, loading: 'eager' | 'lazy' = 'lazy', fetchpriority: 'high' | 'low' | 'auto' = 'auto') {
    this.id = id;
    this.modal = modal;
    this.plain = plain;
    this.loading = loading;
    this.fetchpriority = fetchpriority
  }
}

/**
 * Interface `ImageData` to configure an image, but it isn't used directly.
 * Please, refers to `PlainImage` or `ModalImage`.
 */
export interface ImageData {
  img: string | SafeResourceUrl;
  description?: string;
  title?: string;
  alt?: string;
  ariaLabel?: string;
  fallbackImg?: string | SafeResourceUrl;
}

/**
 * Interface `ModalImage` to configure the modal image.
 */
export interface ModalImage extends ImageData {
  extUrl?: string;
  downloadFileName?: string;
  sources?: Source[];
}

/**
 * Interface `PlainImage` to configure the plain image.
 */
export interface PlainImage extends ImageData {
  size?: Size;
}

/**
 * Class `ImageEvent` that represents the event payload with the result and the triggered action.
 * It also contains the source id of the gallery that emitted this event
 */
export class ImageEvent {
  galleryId: number;
  action: Action;
  result: number | boolean;

  constructor(galleryId: number, action: Action, result: number | boolean) {
    this.galleryId = galleryId;
    this.action = action;
    this.result = result;
  }
}

/**
 * Class `ImageModalEvent` that represents the event payload with galleryId, result and the triggered action.
 */
export class ImageModalEvent extends ImageEvent {
  constructor(galleryId: number, action: Action, result: number | boolean) {
    super(galleryId, action, result);
  }
}

/**
 * Interface `Source` to configure sources of picture element.
 */
export interface Source {
  srcset: string;
  media: string;
}