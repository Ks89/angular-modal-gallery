/*
 The MIT License (MIT)

 Copyright (c) 2017-2021 Stefano Cappa (Ks89)

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
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  GridLayout,
  Image,
  LineLayout,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  ModalGalleryService,
  ModalGalleryRef,
  PlainLibConfig
} from '@ks89/angular-modal-gallery';

@Component({
  selector: 'ks-plain-gallery-page',
  templateUrl: './plain-gallery.html',
  styleUrls: ['./plain-gallery.scss']
})
export class PlainGalleryExampleComponent {
  plainGalleryRow: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout: new LineLayout({ width: '80px', height: '80px' }, { length: 2, wrap: true }, 'flex-start')
  };
  plainGalleryRowSpaceAround: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout: new LineLayout({ width: '50px', height: '50px' }, { length: 2, wrap: true }, 'space-around')
  };
  plainGalleryRowATags: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.ROW,
    layout: new LineLayout({ width: '95px', height: '63px' }, { length: 4, wrap: true }, 'flex-start'),
    // when advanced is defined, additionalBackground: '50% 50%/cover' will be used by default.
    // I added this here, to be more explicit.
    advanced: { aTags: true, additionalBackground: '50% 50%/cover' }
  };

  plainGalleryColumn: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.COLUMN,
    layout: new LineLayout({ width: '50px', height: '50px' }, { length: 3, wrap: true }, 'flex-start')
  };

  plainGalleryGrid: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout: new GridLayout({ width: '80px', height: '80px' }, { length: 3, wrap: true })
  };

  images: Image[] = [
    new Image(0, {
      img: '../assets/images/gallery/img1.jpg',
      extUrl: 'http://www.google.com'
    }),
    new Image(1, {
      img: '../assets/images/gallery/img2.jpg',
      description: 'Description 2'
    }),
    new Image(
      2,
      {
        img: '../assets/images/gallery/img3.jpg',
        description: 'Description 3',
        extUrl: 'http://www.google.com'
      },
      {
        img: '../assets/images/gallery/thumbs/img3.png',
        title: 'custom title 2',
        alt: 'custom alt 2',
        ariaLabel: 'arial label 2'
      }
    ),
    new Image(3, {
      img: '../assets/images/gallery/img4.jpg',
      description: 'Description 4',
      extUrl: 'http://www.google.com'
    }),
    new Image(4, { img: '../assets/images/gallery/img5.jpg' }, { img: '../assets/images/gallery/thumbs/img5.jpg' })
  ];

  emptyImagesArray: Image[] = [];

  fallbackImages: Image[] = [
    new Image(0, {
      // this file is not available so the browser returns an error
      img: '../assets/images/gallery/UNEXISTING_IMG1.jpg',
      // because the img above doesn't exists, the library will use this file
      fallbackImg: '../assets/images/gallery/fallback1.jpg'
    }),
    new Image(1, {
      img: '../assets/images/gallery/UNEXISTING_IMG2.jpg',
      fallbackImg: '../assets/images/gallery/fallback2.jpg'
    }),
    new Image(
      2,
      {
        img: '../assets/images/gallery/UNEXISTING_IMG3.jpg',
        fallbackImg: '../assets/images/gallery/fallback3.jpg'
      },
      {
        img: '../assets/images/gallery/thumbs/UNEXISTING_IMG3.png',
        fallbackImg: '../assets/images/gallery/fallback3.jpg'
      }
    ),
    new Image(3, {
      img: '../assets/images/gallery/UNEXISTING_IMG4.jpg',
      fallbackImg: '../assets/images/gallery/fallback4.jpg'
    }),
    new Image(
      4,
      {
        img: '../assets/images/gallery/UNEXISTING_IMG5.jpg',
        fallbackImg: '../assets/images/gallery/fallback5.jpg'
      },
      {
        img: '../assets/images/gallery/thumbs/UNEXISTING_IMG5.jpg',
        fallbackImg: '../assets/images/gallery/fallback5.jpg'
      }
    )
  ];

  imagesRect: Image[] = [
    new Image(
      0,
      {
        img: '../assets/images/gallery/milan-pegasus-gallery-statue.jpg',
        description: 'Description 1'
      },
      { img: '../assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg' }
    ),
    new Image(1, { img: '../assets/images/gallery/pexels-photo-47223.jpeg' }, { img: '../assets/images/gallery/thumbs/t-pexels-photo-47223.jpg' }),
    new Image(
      2,
      {
        img: '../assets/images/gallery/pexels-photo-52062.jpeg',
        description: 'Description 3'
      },
      {
        img: '../assets/images/gallery/thumbs/t-pexels-photo-52062.jpg',
        description: 'Description 3'
      }
    ),
    new Image(
      3,
      {
        img: '../assets/images/gallery/pexels-photo-66943.jpeg',
        description: 'Description 4'
      },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-66943.jpg' }
    ),
    new Image(4, { img: '../assets/images/gallery/pexels-photo-93750.jpeg' }, { img: '../assets/images/gallery/thumbs/t-pexels-photo-93750.jpg' }),
    new Image(
      5,
      {
        img: '../assets/images/gallery/pexels-photo-94420.jpeg',
        description: 'Description 6'
      },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-94420.jpg' }
    ),
    new Image(6, { img: '../assets/images/gallery/pexels-photo-96947.jpeg' }, { img: '../assets/images/gallery/thumbs/t-pexels-photo-96947.jpg' })
  ];

  imagesRectNoTitles: Image[] = [
    new Image(
      0,
      { img: '../assets/images/gallery/milan-pegasus-gallery-statue.jpg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg', title: '' }
    ),
    new Image(
      1,
      { img: '../assets/images/gallery/pexels-photo-47223.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-47223.jpg', title: '' }
    ),
    new Image(
      2,
      { img: '../assets/images/gallery/pexels-photo-52062.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-52062.jpg', title: '' }
    ),
    new Image(
      3,
      { img: '../assets/images/gallery/pexels-photo-66943.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-66943.jpg', title: '' }
    ),
    new Image(
      4,
      { img: '../assets/images/gallery/pexels-photo-93750.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-93750.jpg', title: '' }
    ),
    new Image(
      5,
      { img: '../assets/images/gallery/pexels-photo-94420.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-94420.jpg', title: '' }
    ),
    new Image(
      6,
      { img: '../assets/images/gallery/pexels-photo-96947.jpeg', title: '' },
      { img: '../assets/images/gallery/thumbs/t-pexels-photo-96947.jpg', title: '' }
    )
  ];

  libConfigPlainGalleryRow: PlainLibConfig = {
    plainGalleryConfig: this.plainGalleryRow
  };
  libConfigPlainGalleryRowSpaceAround: PlainLibConfig = {
    plainGalleryConfig: this.plainGalleryRowSpaceAround
  };
  libConfigPlainGalleryRowATags: PlainLibConfig = {
    plainGalleryConfig: this.plainGalleryRowATags
  };
  libConfigPlainGalleryColumn: PlainLibConfig = {
    plainGalleryConfig: this.plainGalleryColumn
  };
  libConfigPlainGalleryGrid: PlainLibConfig = {
    plainGalleryConfig: this.plainGalleryGrid
  };

  constructor(private modalGalleryService: ModalGalleryService, private sanitizer: DomSanitizer) {}

  openImageModalRow(id: number, image: Image): void {
    console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
    const index: number = this.getCurrentIndexCustomLayout(image, this.images);
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: this.images,
      currentImage: this.images[index]
    }) as ModalGalleryRef;
  }

  openImageModalColumn(id: number, image: Image): void {
    console.log('Opening modal gallery from custom plain gallery column, with image: ', image);
    const index: number = this.getCurrentIndexCustomLayout(image, this.images);
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: this.images,
      currentImage: this.images[index]
    }) as ModalGalleryRef;
  }

  openImageModalRowDescription(id: number, image: Image): void {
    console.log('Opening modal gallery from custom plain gallery row and description, with image: ', image);
    const index: number = this.getCurrentIndexCustomLayout(image, this.imagesRect);
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: this.imagesRect,
      currentImage: this.imagesRect[index]
    }) as ModalGalleryRef;
  }

  addRandomImage(): void {
    // add to images array
    const imageToCopy: Image = this.images[Math.floor(Math.random() * this.images.length)];
    const newImage: Image = new Image(this.images.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
    this.images = [...this.images, newImage];
    // add also to imagesRect
    const imageRectToCopy: Image = this.imagesRect[Math.floor(Math.random() * this.imagesRect.length)];
    const newImageRect: Image = new Image(this.imagesRect.length - 1 + 1, imageRectToCopy.modal, imageRectToCopy.plain);
    this.imagesRect = [...this.imagesRect, newImageRect];
  }

  onShow(id: number, index: number, images: Image[] = this.images): void {
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images,
      currentImage: images[index]
    }) as ModalGalleryRef;
  }

  trackById(index: number, item: Image): number {
    return item.id;
  }

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
}
