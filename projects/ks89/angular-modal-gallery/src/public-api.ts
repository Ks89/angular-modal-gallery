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

/**
 * Index file to export all interfaces, enums, classes and so on.
 * This file represents the public apis.
 */

export { GalleryModule } from './lib/modal-gallery.module';

export { Action } from './lib/model/action.enum';
export { Image, PlainImage, ModalImage, ImageEvent, ImageModalEvent } from './lib/model/image.class';
export { Description, DescriptionStrategy } from './lib/model/description.interface';
export { KeyboardConfig } from './lib/model/keyboard-config.interface';
export { DotsConfig } from './lib/model/dots-config.interface';
export { PreviewConfig } from './lib/model/preview-config.interface';
export { AccessibilityConfig } from './lib/model/accessibility.interface';

export { BreakpointsConfig, CarouselPreviewConfig } from './lib/model/carousel-preview-config.interface';
export { CarouselConfig } from './lib/model/carousel-config.interface';
export { PlayConfig } from './lib/model/play-config.interface';
export { CarouselImageConfig } from './lib/model/carousel-image-config.interface';

export { Size } from './lib/model/size.interface';

export { ButtonsConfig, ButtonsStrategy, ButtonType, ButtonEvent } from './lib/model/buttons-config.interface';

export { ModalLibConfig, PlainLibConfig, CarouselLibConfig } from './lib/model/lib-config.interface';

export { ModalGalleryConfig } from './lib/model/modal-gallery-config.interface';

export { CurrentImageConfig } from './lib/model/current-image-config.interface';

export { LoadingConfig, LoadingType } from './lib/model/loading-config.interface';

export { InteractionEvent } from './lib/model/interaction-event.interface';

export { KS_DEFAULT_ACCESSIBILITY_CONFIG } from './lib/components/accessibility-default';
export {
  KS_DEFAULT_BTN_FULL_SCREEN,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DELETE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_SIZE
} from './lib/components/upper-buttons/upper-buttons-default';

export {
  PlainGalleryConfig,
  PlainGalleryLayout,
  LineLayout,
  GridLayout,
  PlainGalleryStrategy,
  BreakConfig
} from './lib/model/plain-gallery-config.interface';

export { ModalGalleryComponent } from './lib/components/modal-gallery/modal-gallery.component';
export { PlainGalleryComponent } from './lib/components/plain-gallery/plain-gallery.component';
export { CarouselComponent } from './lib/components/carousel/carousel.component';

export { ModalGalleryService } from './lib/components/modal-gallery/modal-gallery.service';
export { ModalGalleryRef } from './lib/components/modal-gallery/modal-gallery-ref';
