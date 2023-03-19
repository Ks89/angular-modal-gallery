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

import { Injectable } from '@angular/core';

/**
 * Service to check if the provided id is unique
 */
@Injectable({ providedIn: 'root' })
export class IdValidatorService {
  ids = new Map();

  /**
   * Method to check and reserve an id for the current instance of the library.
   * In this way, no other instances can use the same id.
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @return boolean true if success. false is never returned, instead an exception is thrown
   * @throws a error with a message if galleryId is neither unique, < 0 or an integer
   */
  checkAndAdd(galleryId: number | undefined): boolean {
    if (galleryId === undefined || !Number.isInteger(galleryId) || galleryId < 0) {
      throw new Error('You must provide a valid [id]="unique integer > 0 here" to the gallery/carousel in your template');
    }
    if (this.ids.get(galleryId)) {
      throw new Error(`Cannot create gallery with id=${galleryId} because already used in your application. This must be a unique integer >= 0`);
    }
    this.ids.set(galleryId, galleryId);
    return true;
  }

  /**
   * Method to remove a reserved id. In this way you are able to use the id again for another instance of the library.
   * @param galleryId number or undefined that represents the unique id of the gallery.
   * @return boolean true if success. false is never returned, instead an exception is thrown*
   * @throws a error with a message if galleryId is neither integer or < 0
   * * this should be improved without return true, because it doesn't make sense! :(
   */
  remove(galleryId: number | undefined): boolean {
    if (galleryId === undefined || !Number.isInteger(galleryId) || galleryId < 0) {
      throw new Error('You must provide a valid [id]="unique integer > 0 here" to the gallery/carousel in your template');
    }
    this.ids.delete(galleryId);
    return true;
  }
}
