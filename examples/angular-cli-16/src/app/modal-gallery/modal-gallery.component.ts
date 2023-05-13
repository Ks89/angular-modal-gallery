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

import { TemplateRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  Action,
  ButtonEvent,
  ButtonType,
  Image,
  ImageModalEvent,
  ModalGalleryService,
  ModalGalleryRef,
  ModalGalleryConfig,
  ModalLibConfig
} from '@ks89/angular-modal-gallery';
import { Subscription } from 'rxjs';

import * as libConfigs from './libconfigs';

@Component({
  selector: 'ks-modal-gallery-page',
  templateUrl: './modal-gallery.html',
  styleUrls: ['./modal-gallery.scss']
})
export class ModalGalleryExampleComponent implements OnDestroy {
  /**
   * A custom template to illustrate the customization of previews rendering.
   */
  @ViewChild('previewsTemplate')
  previewsTemplate?: TemplateRef<HTMLElement>;

  imageIndex = 0;
  galleryId = 1;
  isPlaying = true;
  // Examples A
  CONFIG406: ModalLibConfig = libConfigs.LIBCONFIG_406;
  CONFIG407: ModalLibConfig = libConfigs.LIBCONFIG_407;
  CONFIG408: ModalLibConfig = libConfigs.LIBCONFIG_408;
  // Examples B
  CONFIG500: ModalLibConfig = libConfigs.LIBCONFIG_500;
  CONFIG501: ModalLibConfig = libConfigs.LIBCONFIG_501;
  CONFIG502: ModalLibConfig = libConfigs.LIBCONFIG_502;
  CONFIG503: ModalLibConfig = libConfigs.LIBCONFIG_503;
  CONFIG504: ModalLibConfig = libConfigs.LIBCONFIG_504;
  CONFIG505: ModalLibConfig = libConfigs.LIBCONFIG_505;
  CONFIG506: ModalLibConfig = libConfigs.LIBCONFIG_506;
  CONFIG507: ModalLibConfig = libConfigs.LIBCONFIG_507;
  CONFIG508: ModalLibConfig = libConfigs.LIBCONFIG_508;
  CONFIG509: ModalLibConfig = libConfigs.LIBCONFIG_509;
  CONFIG510: ModalLibConfig = libConfigs.LIBCONFIG_510;
  CONFIG511: ModalLibConfig = libConfigs.LIBCONFIG_511;
  CONFIG512: ModalLibConfig = libConfigs.LIBCONFIG_512;
  CONFIG513: ModalLibConfig = libConfigs.LIBCONFIG_513;
  CONFIG514: ModalLibConfig = libConfigs.LIBCONFIG_514;
  CONFIG515: ModalLibConfig = libConfigs.LIBCONFIG_515;
  CONFIG516: ModalLibConfig = libConfigs.LIBCONFIG_516;
  CONFIG517: ModalLibConfig = libConfigs.LIBCONFIG_517;
  CONFIG518: ModalLibConfig = libConfigs.LIBCONFIG_518;
  CONFIG519: ModalLibConfig = libConfigs.LIBCONFIG_519;
  CONFIG520: ModalLibConfig = libConfigs.LIBCONFIG_520;
  CONFIG521: ModalLibConfig = libConfigs.LIBCONFIG_521;
  CONFIG522: ModalLibConfig = libConfigs.LIBCONFIG_522;
  CONFIG523: ModalLibConfig = libConfigs.LIBCONFIG_523;
  CONFIG524: ModalLibConfig = libConfigs.LIBCONFIG_524;
  CONFIG525: ModalLibConfig = libConfigs.LIBCONFIG_525;
  // Examples C
  CONFIG600: ModalLibConfig = libConfigs.LIBCONFIG_600;
  CONFIG601: ModalLibConfig = libConfigs.LIBCONFIG_601;
  CONFIG602: ModalLibConfig = libConfigs.LIBCONFIG_602;
  CONFIG603: ModalLibConfig = libConfigs.LIBCONFIG_603;
  CONFIG604: ModalLibConfig = libConfigs.LIBCONFIG_604;
  CONFIG605: ModalLibConfig = libConfigs.LIBCONFIG_605;
  CONFIG606: ModalLibConfig = libConfigs.LIBCONFIG_606;
  CONFIG607: ModalLibConfig = libConfigs.LIBCONFIG_607;
  CONFIG608: ModalLibConfig = libConfigs.LIBCONFIG_608;
  CONFIG609: ModalLibConfig = libConfigs.LIBCONFIG_609;
  CONFIG610: ModalLibConfig = libConfigs.LIBCONFIG_610;
  CONFIG611: ModalLibConfig = libConfigs.LIBCONFIG_611;
  CONFIG612: ModalLibConfig = libConfigs.LIBCONFIG_612;
  CONFIG613: ModalLibConfig = libConfigs.LIBCONFIG_613;
  // Examples D
  CONFIG701: ModalLibConfig = libConfigs.LIBCONFIG_701;
  CONFIG702: ModalLibConfig = libConfigs.LIBCONFIG_702;
  CONFIG703: ModalLibConfig = libConfigs.LIBCONFIG_703;
  // Examples E
  CONFIG800: ModalLibConfig = libConfigs.LIBCONFIG_800;
  CONFIG801: ModalLibConfig = libConfigs.LIBCONFIG_801;
  CONFIG802: ModalLibConfig = libConfigs.LIBCONFIG_802;
  // Example F
  CONFIG900: ModalLibConfig = libConfigs.LIBCONFIG_900;

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

  // array of images (obviously with different id) where paths are the same.
  // to prevent caching issues I have to append '?index'.
  sameImages: Image[] = [
    new Image(0, {
      img: '../assets/images/gallery/img1.jpg?1',
      extUrl: 'http://www.google.com'
    }),
    new Image(1, {
      img: '../assets/images/gallery/img1.jpg?2',
      extUrl: 'http://www.google.com'
    }),
    new Image(2, {
      img: '../assets/images/gallery/img1.jpg?3',
      extUrl: 'http://www.google.com'
    })
  ];

  // example of a png converted into base64 using https://www.base64-image.de/ or other similar websites
  base64String =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABN0lEQV' +
    'R4nO3SQQ2AQBDAwAVlaMEhCkAV' +
    'b2RcQmcU9NEZAAAAAOD/tvN675k5VoewxLOvLmAtA8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0C' +
    'cAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4g' +
    'wQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGQAAAAAA4Pc+8asEoPPGq' +
    'xUAAAAASUVORK5CYII';

  base64RedString =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX/AAD/////WVn/+vr/qan/Nzf/ERH/2tr/s7P/KSn/' +
    '7+//vr7/0ND/W1v/6+v/m5v/4+P/U1P/HR3/o6P/rq7/g4P/k5P/t7f/dXX/SEj/zMz/ZWX/h4f/bm7/amr/np7/yMhDG/2oAAAC8ElEQVR4nO3dC3KqQBCF4WkHERHFRyKIL/' +
    'a/ymDuVYMMFipTbbfnW8H5S4lQVGUMaWe4B3iHQvlQKB8K5UOhfCiUD4XyoVA+FJ7Myijd5dvBO9nmuzQqZ68X2mI9NO9suC7s84VxNuAO6GSQxU8VJvuQe3pn4T55uLDYcK9+' +
    '0KZ4qDB574vPbej+HF2Fcc499km563p0FAbcQ18QdCi0B+6VLzk0fjtuC0dj7o0vGo/uF064B/agvFcYca/rRdReeOTe1pNjW6HkP6J1gbtQwzV4NnEVJtyrepU0C2M599ldhH' +
    'GjcMq9qWfT28KUe1Hv0nrhnHuPB/Na4YJ7jgeLv4UZ9xovsmuhXXKP8WJpL4Ur7i2erC6Fun4Kr8Jz4Rf3Em++/hdKf+htN/5XqOuGtC75LfzmnuHR96nQ6v2SVl9TWxVq/pKevq' +
    'aG1twjvFpXhTLeLz1rQMZyb/DMmhH3BM9GRudjxVVmtN51n62M1DdpXeVG2rveR22MxLe9jxgazfdsJ2Oj9en3THsfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAgHba/+98+AFnI+g/30L/GSX6z5nRf1aQ/vOe9J/Zpf/cNf1n533A+Yf6z7DUfw6p/rNkVX9Nkw850/kDzuXWf7Y6ab37Xl0K7ZJ7ixdLeykknQ8YGV0LacG9xo' +
    'MF/S2cc8/xYF4rpJR7T+9SqhfSlHtRz6Z0Wxjr+lEM40ahstvThJqFNOFe1aMJuQop4N7Vm4DchXTkXtaTI7UVUsS9rRcRtRequBZLuldII+mPw+MR3S8ke+De+JKDvQ1qFMr+kx' +
    'o0cxyFFEt945bHjhpXYXV/I/HN8DBxtrgLiQpp74Y3RUtJW2H1Oe7l3IuHe/fnd7+wuh4zGe+lBpnr+utSWLHF+r0vyeG6aPw+PFT4a1ZG6S7fDt7JNt+lUTnrsL5LoWwolA+F8q' +
    'FQPhTKh0L5UCgfCuVDoXw/lnQz7dm7GjoAAAAASUVORK5CYII=';
  base64GreenString =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAgMAAADQNkYNAAAADFBMVEUAAAAy/ysy/ysy/ysyTcibAAAAA3RSTlMA2r/af0d' +
    'WAAAAQUlEQVRo3u3YMREAMAzEsJAMyZJsMXy3XORdBFySJK3qxFXH1Y1DEARBEARBEARBEARBEARBkNmk436mvSRJ0o4eOKL2P81eyn8AAAAASUVORK5CYII=';

  base64Image: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64String);
  base64RedImage: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64RedString);
  base64GreenImage: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64GreenString);

  imagesBase64: Image[] = [
    new Image(0, {
      img: this.base64Image,
      extUrl: 'http://www.google.com'
    }),
    new Image(1, {
      img: this.base64GreenImage,
      description: 'Description 2'
    }),
    new Image(
      2,
      {
        img: this.base64RedImage,
        description: 'Description 3',
        extUrl: 'http://www.google.com'
      },
      {
        img: this.base64RedImage,
        title: 'custom title 2',
        alt: 'custom alt 2',
        ariaLabel: 'arial label 2'
      }
    )
  ];

  imagesCustomDownloadFileName: Image[] = [
    new Image(0, {
      img: '../assets/images/gallery/img1.jpg',
      downloadFileName: 'first-img.jpg'
    }),
    new Image(1, {
      img: this.base64Image,
      downloadFileName: 'second-img-base64.jpg'
    })
  ];

  imagesHtmlDescriptions: Image[] = [
    new Image(0, {
      img: '../assets/images/gallery/img1.jpg',
      extUrl: 'http://www.google.com'
    }),
    new Image(1, {
      img: '../assets/images/gallery/img2.jpg',
      description: '<ol><li>This is</li><li>the description</li><li>number</li><li>2</li></ol>'
    }),
    new Image(
      2,
      {
        img: '../assets/images/gallery/img3.jpg',
        description: '<ul><li>Description</li><li><i>3</i></li></ul>',
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

  imagesMixedSizes: Image[] = [
    new Image(0, {
      img: '../assets/images/gallery/pexels-photo-135230.png',
      description: 'Description 1'
    }),
    new Image(1, {
      img: '../assets/images/gallery/pexels-photo-547115.jpeg'
    }),
    new Image(2, {
      img: '../assets/images/gallery/pexels-photo-556664.jpeg',
      description: 'Description 3'
    }),
    new Image(3, {
      img: '../assets/images/gallery/pexels-photo-787594.jpeg',
      description: 'Description 4'
    }),
    new Image(4, {
      img: '../assets/images/gallery/pexels-photo-803105.jpeg'
    })
  ];

  // example of images with small previews (they are different files) to show
  // loading spinners
  imagesForLoadingSpinner: Image[] = [
    new Image(
      0,
      {
        img: '../assets/images/loading-spinner-samples/pexels-photo-74506.jpg'
      },
      { img: '../assets/images/loading-spinner-samples/pexels-photo-74506-thumb.jpg' }
    ),
    new Image(
      1,
      {
        img: '../assets/images/loading-spinner-samples/pexels-photo-106006.jpg'
      },
      { img: '../assets/images/loading-spinner-samples/pexels-photo-106006-thumb.jpg' }
    ),
    new Image(
      2,
      {
        img: '../assets/images/loading-spinner-samples/pexels-photo-464336.jpg'
      },
      { img: '../assets/images/loading-spinner-samples/pexels-photo-464336-thumb.jpg' }
    ),
    new Image(
      3,
      {
        img: '../assets/images/loading-spinner-samples/pexels-photo.jpg'
      },
      { img: '../assets/images/loading-spinner-samples/pexels-photo-thumb.jpg' }
    ),
    new Image(
      4,
      {
        img: '../assets/images/loading-spinner-samples/traffic-highway-lights-night-56891.jpg'
      },
      { img: '../assets/images/loading-spinner-samples/traffic-highway-lights-night-56891-thumb.jpg' }
    )
  ];

  // array with a single image inside (the first one)
  singleImage: Image[] = [this.images[0]];

  imagesInfiniteAutoAdd: Image[] = [
    new Image(0, {
      img: '../assets/images/gallery/img1.jpg?1',
      extUrl: 'http://www.google.com'
    })
  ];

  private count = 0;

  // subscriptions to receive events from the gallery
  // REMEMBER TO call unsubscribe(); in ngOnDestroy (see below)
  private closeSubscription: Subscription | undefined;
  private showSubscription: Subscription | undefined;
  private firstImageSubscription: Subscription | undefined;
  private lastImageSubscription: Subscription | undefined;
  private hasDataSubscription: Subscription | undefined;
  private buttonBeforeHookSubscription: Subscription | undefined;
  private buttonAfterHookSubscription: Subscription | undefined;

  constructor(private modalGalleryService: ModalGalleryService, private sanitizer: DomSanitizer) {}

  // this variable is used only for example of auto navigation
  // tslint:disable-next-line:no-any
  private timeout: any;

  openModalWithAutoClose(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;

    this.showSubscription = dialogRef.show$.subscribe((event: ImageModalEvent) => {
      console.log('OUTPUT - show$: ', event);
      const galleryId: number = event.galleryId;
      console.log(`onShowAutoCloseExample with id=${galleryId} action: ` + Action[event.action]);
      console.log('onShowAutoCloseExample result:' + event.result);
      console.log('Starting timeout of 3 seconds to close modal gallery automatically');
      // clear previous timeout
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        console.log('setTimeout end - closing gallery with id=' + galleryId);
        this.modalGalleryService.close(galleryId, false);
      }, 3000);
    });
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
    // add also to imagesMixedSizes
    const imageMixToCopy: Image = this.imagesMixedSizes[Math.floor(Math.random() * this.imagesMixedSizes.length)];
    const newImageMix: Image = new Image(this.imagesMixedSizes.length - 1 + 1, imageMixToCopy.modal, imageMixToCopy.plain);
    this.imagesMixedSizes = [...this.imagesMixedSizes, newImageMix];
  }

  openModal(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    if(imagesArrayToUse.length === 0) {
      console.error('Cannot open modal-gallery because images array cannot be empty');
      return;
    }
    if(imageIndex > imagesArrayToUse.length - 1) {
      console.error('Cannot open modal-gallery because imageIndex must be valid');
      return;
    }
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;
  }

  openModalWithOutputs(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;
    this.closeSubscription = dialogRef.close$.subscribe((event: ImageModalEvent) => {
      console.log('OUTPUT - close$: ', event);
    });
    this.showSubscription = dialogRef.show$.subscribe((event: ImageModalEvent) => {
      console.log('OUTPUT - show$: ', event);
    });
    this.firstImageSubscription = dialogRef.firstImage$.subscribe((event: ImageModalEvent) => {
      console.log('OUTPUT - firstImage$: ', event);
    });
    this.lastImageSubscription = dialogRef.lastImage$.subscribe((event: ImageModalEvent) => {
      console.log('OUTPUT - lastImage$: ', event);
    });
    this.hasDataSubscription = dialogRef.hasData$.subscribe((event: ImageModalEvent) => {
      // angular-modal-gallery will emit this event if it will load successfully input images
      console.log('OUTPUT - hasData$: ', event);
    });
    this.buttonBeforeHookSubscription = dialogRef.buttonBeforeHook$.subscribe((event: ButtonEvent) => {
      console.log('OUTPUT - buttonBeforeHook$: ', event);
      if (!event || !event.button) {
        return;
      }
      // Invoked after a click on a button, but before that the related
      // action is applied.
      // For instance: this method will be invoked after a click
      // of 'close' button, but before that the modal gallery
      // will be really closed.
      if (event.button.type === ButtonType.DELETE) {
        // remove the current image and reassign all other to the array of images
        console.log('delete in app with images count ' + this.images.length);
        this.images = this.images.filter((val: Image) => event.image && val.id !== event.image.id);
      }
    });
    this.buttonAfterHookSubscription = dialogRef.buttonAfterHook$.subscribe((event: ButtonEvent) => {
      if (!event || !event.button) {
        return;
      }
      // Invoked after both a click on a button and its related action.
      // For instance: this method will be invoked after a click
      // of 'close' button, but before that the modal gallery
      // will be really closed.
    });
  }

  openModalWithDeleteButton(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: [...imagesArrayToUse],
      currentImage: Object.assign({}, imageToShow),
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;
    this.buttonBeforeHookSubscription = dialogRef.buttonBeforeHook$.subscribe((event: ButtonEvent) => {
      console.log('OUTPUT - buttonBeforeHook$:', event);
      if (!event || !event.button) {
        return;
      }
      // Invoked after a click on a button, but before that the related
      // action is applied.
      // For instance: this method will be invoked after a click
      // of 'close' button, but before that the modal gallery
      // will be really closed.
    });
    this.buttonAfterHookSubscription = dialogRef.buttonAfterHook$.subscribe((event: ButtonEvent) => {
      console.log('OUTPUT - buttonAfterHook$:', event);
      if (!event || !event.button) {
        return;
      }
      if (event.button.type === ButtonType.DELETE) {
        // remove the current image and reassign all other to the array of images
        this.images = this.images.filter((val: Image) => event.image && val.id !== event.image.id);
        this.modalGalleryService.updateModalImages(this.images);
      }
      // Invoked after both a click on a button and its related action.
      // For instance: this method will be invoked after a click
      // of 'close' button, but before that the modal gallery
      // will be really closed.
    });
  }

  openModalWithAddButton(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;
    this.buttonBeforeHookSubscription = dialogRef.buttonBeforeHook$.subscribe((event: ButtonEvent) => {
      if (!event || !event.button) {
        return;
      }
      // Invoked after a click on a button, but before that the related
      // action is applied.

      if (event.button.type === ButtonType.CUSTOM) {
        console.log('adding a new random image at the end');
        this.addRandomImage();
        setTimeout(() => {
          this.modalGalleryService.updateModalImages(this.images);
        }, 0);
      }
    });
    this.buttonAfterHookSubscription = dialogRef.buttonAfterHook$.subscribe((event: ButtonEvent) => {
      console.log('OUTPUT - buttonAfterHook$:', event);
      if (!event || !event.button) {
        return;
      }
      // Invoked after both a click on a button and its related action.
      // For instance: this method will be invoked after a click
      // of 'close' button, but before that the modal gallery
      // will be really closed.
    });
  }

  openModalWithAutoAdd(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;
    this.showSubscription = dialogRef.show$.subscribe((event: ImageModalEvent) => {
      console.log('OUTPUT - show$: ', event);
      if (this.count !== 0) {
        return;
      }
      const interval = setInterval(() => {
        const imageToCopy: Image = this.images[Math.floor(Math.random() * this.images.length)];
        const newImage: Image = new Image(this.imagesInfiniteAutoAdd.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
        newImage.modal.img += `?${this.imagesInfiniteAutoAdd.length + 1}`;
        this.imagesInfiniteAutoAdd = [...this.imagesInfiniteAutoAdd, newImage];
        this.modalGalleryService.updateModalImages(this.imagesInfiniteAutoAdd);
        this.count++;
        if (this.count === 4) {
          clearInterval(interval);
        }
      }, 2000);
    });
  }

  openModalWithAutoUpdate(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;
    this.showSubscription = dialogRef.show$.subscribe((event: ImageModalEvent) => {
      console.log('OUTPUT - show$: ', event);
      if (this.count !== 0) {
        return;
      }
      const indexToRefresh = 1;
      const image: Image = new Image(1, {
        img: '../assets/images/gallery/img5.jpg',
        description: 'Description 2 updated with imag5.jpg'
      });

      console.log('updating image at index ' + indexToRefresh + ', after 4 seconds');

      // create the new array of images with the updated image inside
      const newImages: Image[] = [...this.images];
      newImages[indexToRefresh] = image;

      setTimeout(() => {
        this.modalGalleryService.updateModalImages(newImages);
        console.log('image updated successfully!');
      }, 4000);
    });
  }

  autoPlayButton(config: ModalLibConfig): boolean {
    this.isPlaying = !this.isPlaying;
    if (config && config.slideConfig && config.slideConfig.playConfig) {
      config.slideConfig.playConfig.autoPlay = this.isPlaying;
    }
    return this.isPlaying;
  }

  trackById(index: number, item: Image): number {
    return item.id;
  }

  openModalWithPreviewsTemplate(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    if(imagesArrayToUse.length === 0) {
      console.error('Cannot open modal-gallery because images array cannot be empty');
      return;
    }
    if(imageIndex > imagesArrayToUse.length - 1) {
      console.error('Cannot open modal-gallery because imageIndex must be valid');
      return;
    }
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig,
      previewsTemplate: this.previewsTemplate,
    } as ModalGalleryConfig) as ModalGalleryRef;
  }

  ngOnDestroy(): void {
    // release resources to prevent memory leaks and unexpected behaviours
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    if (this.showSubscription) {
      this.showSubscription.unsubscribe();
    }
    if (this.firstImageSubscription) {
      this.firstImageSubscription.unsubscribe();
    }
    if (this.lastImageSubscription) {
      this.lastImageSubscription.unsubscribe();
    }
    if (this.hasDataSubscription) {
      this.hasDataSubscription.unsubscribe();
    }
    if (this.buttonBeforeHookSubscription) {
      this.buttonBeforeHookSubscription.unsubscribe();
    }
    if (this.buttonAfterHookSubscription) {
      this.buttonAfterHookSubscription.unsubscribe();
    }
  }
}
