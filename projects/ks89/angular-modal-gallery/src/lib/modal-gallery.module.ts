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

import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { COMPONENTS, CarouselComponent } from './components/components';
import { PlainGalleryComponent } from './components/plain-gallery/plain-gallery.component';
import { DIRECTIVES } from './directives/directives';
import { AttachToOverlayService } from './components/modal-gallery/attach-to-overlay.service';

/**
 * Module to import it in the root module of your application.
 */
@NgModule({
  imports: [CommonModule, OverlayModule, COMPONENTS, DIRECTIVES],
  providers: [
    provideAppInitializer(() => {
      const service = inject(AttachToOverlayService);
      service.initialize();
    })
  ],
  exports: [PlainGalleryComponent, CarouselComponent]
})
export class GalleryModule {
}
