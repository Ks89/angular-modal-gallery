/*
 The MIT License (MIT)

 Copyright (c) 2017-2020 Stefano Cappa (Ks89)

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

import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  AccessibilityConfig,
  Action,
  ButtonEvent,
  ButtonsConfig,
  ButtonsStrategy,
  ButtonType,
  Description,
  DescriptionStrategy,
  DotsConfig,
  Image,
  ImageModalEvent,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DELETE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_BTN_FULL_SCREEN,
  PreviewConfig,
  LoadingConfig,
  LoadingType,
  CurrentImageConfig,
  ModalGalleryService,
  ModalGalleryRef,
  ModalGalleryConfig,
  InteractionEvent,
  LibConfig
} from '@ks89/angular-modal-gallery';
import { Subscription } from 'rxjs';

import * as libConfigs from './libconfigs';

@Component({
  selector: 'ks-modal-gallery-page',
  templateUrl: './modal-gallery.html',
  styleUrls: ['./modal-gallery.scss']
})
export class ModalGalleryExampleComponent implements OnDestroy {
  imageIndex = 0;
  galleryId = 1;
  isPlaying = true;
  // Examples A
  CONFIG406: LibConfig = libConfigs.LIBCONFIG_406;
  CONFIG407: LibConfig = libConfigs.LIBCONFIG_407;
  CONFIG408: LibConfig = libConfigs.LIBCONFIG_408;
  // Examples B
  CONFIG500: LibConfig = libConfigs.LIBCONFIG_500;
  CONFIG501: LibConfig = libConfigs.LIBCONFIG_501;
  CONFIG502: LibConfig = libConfigs.LIBCONFIG_502;
  CONFIG503: LibConfig = libConfigs.LIBCONFIG_503;
  CONFIG504: LibConfig = libConfigs.LIBCONFIG_504;
  CONFIG505: LibConfig = libConfigs.LIBCONFIG_505;
  CONFIG506: LibConfig = libConfigs.LIBCONFIG_506;
  CONFIG507: LibConfig = libConfigs.LIBCONFIG_507;
  CONFIG508: LibConfig = libConfigs.LIBCONFIG_508;
  CONFIG509: LibConfig = libConfigs.LIBCONFIG_509;
  CONFIG510: LibConfig = libConfigs.LIBCONFIG_510;
  CONFIG511: LibConfig = libConfigs.LIBCONFIG_511;
  CONFIG512: LibConfig = libConfigs.LIBCONFIG_512;
  CONFIG513: LibConfig = libConfigs.LIBCONFIG_513;
  CONFIG514: LibConfig = libConfigs.LIBCONFIG_514;
  CONFIG515: LibConfig = libConfigs.LIBCONFIG_515;
  CONFIG516: LibConfig = libConfigs.LIBCONFIG_516;
  CONFIG517: LibConfig = libConfigs.LIBCONFIG_517;
  CONFIG518: LibConfig = libConfigs.LIBCONFIG_518;
  CONFIG519: LibConfig = libConfigs.LIBCONFIG_519;
  CONFIG520: LibConfig = libConfigs.LIBCONFIG_520;
  CONFIG521: LibConfig = libConfigs.LIBCONFIG_521;
  CONFIG522: LibConfig = libConfigs.LIBCONFIG_522;
  CONFIG523: LibConfig = libConfigs.LIBCONFIG_523;
  CONFIG524: LibConfig = libConfigs.LIBCONFIG_524;
  CONFIG525: LibConfig = libConfigs.LIBCONFIG_525;
  // Examples C
  CONFIG600: LibConfig = libConfigs.LIBCONFIG_600;
  CONFIG601: LibConfig = libConfigs.LIBCONFIG_601;
  CONFIG602: LibConfig = libConfigs.LIBCONFIG_602;
  CONFIG603: LibConfig = libConfigs.LIBCONFIG_603;
  CONFIG604: LibConfig = libConfigs.LIBCONFIG_604;
  CONFIG605: LibConfig = libConfigs.LIBCONFIG_605;
  CONFIG606: LibConfig = libConfigs.LIBCONFIG_606;
  CONFIG607: LibConfig = libConfigs.LIBCONFIG_607;
  CONFIG608: LibConfig = libConfigs.LIBCONFIG_608;
  CONFIG609: LibConfig = libConfigs.LIBCONFIG_609;
  CONFIG610: LibConfig = libConfigs.LIBCONFIG_610;
  CONFIG611: LibConfig = libConfigs.LIBCONFIG_611;
  CONFIG612: LibConfig = libConfigs.LIBCONFIG_612;
  CONFIG613: LibConfig = libConfigs.LIBCONFIG_613;
  // Examples D
  CONFIG701: LibConfig = libConfigs.LIBCONFIG_701;
  CONFIG702: LibConfig = libConfigs.LIBCONFIG_702;
  CONFIG703: LibConfig = libConfigs.LIBCONFIG_703;
  // Examples E
  CONFIG800: LibConfig = libConfigs.LIBCONFIG_800;
  CONFIG801: LibConfig = libConfigs.LIBCONFIG_801;
  CONFIG802: LibConfig = libConfigs.LIBCONFIG_802;

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

  dotsConfig: DotsConfig = {
    visible: false
  };

  customDescription: Description = {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => '
  };

  customDescriptionStyle: Description = {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => ',
    style: {
      bgColor: 'rgba(255,0,0,.5)',
      textColor: 'blue',
      marginTop: '3px',
      marginBottom: '0px',
      marginLeft: '5px',
      marginRight: '5px',
      position: 'absolute',
      top: '0px',
      height: '25px'
      // be careful to use width, in particular with % values
    }
  };

  customDescriptionHideIfEmpty: Description = {
    strategy: DescriptionStrategy.HIDE_IF_EMPTY,
    imageText: 'Look this image ',
    numberSeparator: ' of ',
    beforeTextDescription: ' => '
  };

  customFullDescription: Description = {
    strategy: DescriptionStrategy.ALWAYS_VISIBLE,
    // you should build this value programmatically with the result of (show)="..()" event
    customFullDescription: 'Custom description of the current visible image'
    // if customFullDescription !== undefined, all other fields will be ignored
    // imageText: '',
    // numberSeparator: '',
    // beforeTextDescription: '',
  };

  customFullDescriptionHidden: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN,
    // you should build this value programmatically with the result of (show)="..()" event
    customFullDescription: 'Custom description of the current visible image'
    // if customFullDescription !== undefined, all other fields will be ignored
    // imageText: '',
    // numberSeparator: '',
    // beforeTextDescription: '',
  };

  // customButtonsSize: ButtonSize = {
  //   width: 10,
  //   height: 10,
  //   unit: 'px'
  // };

  buttonsConfigDefault: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  };
  buttonsConfigSimple: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  };
  buttonsConfigAdvanced: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.ADVANCED
  };
  buttonsConfigFull: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.FULL
  };
  buttonsConfigCustom: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      // KS_DEFAULT_BTN_ROTATE,
      KS_DEFAULT_BTN_FULL_SCREEN,
      KS_DEFAULT_BTN_DELETE,
      KS_DEFAULT_BTN_EXTURL,
      KS_DEFAULT_BTN_DOWNLOAD,
      KS_DEFAULT_BTN_CLOSE
    ]
  };

  // default buttons but extUrl will open the link in a new tab instead of the current one
  // this requires to specify all buttons manually (also if they are not really custom)
  customButtonsConfigExtUrlNewTab: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'ext-url-image',
        type: ButtonType.EXTURL,
        extUrlInNewTab: true // <--- this is the important thing to understand this example
      },
      {
        className: 'download-image',
        type: ButtonType.DOWNLOAD
      },
      {
        className: 'close-image',
        type: ButtonType.CLOSE
      }
    ]
  };

  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fas fa-plus white',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom plus aria label',
        title: 'custom plus title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-times white',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'custom close title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-download white',
        type: ButtonType.DOWNLOAD,
        ariaLabel: 'custom download aria label',
        title: 'custom download title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-external-link-alt white',
        type: ButtonType.EXTURL,
        ariaLabel: 'custom exturl aria label',
        title: 'custom exturl title',
        fontSize: '20px'
      }
    ]
  };

  previewConfigOneImage: PreviewConfig = {
    visible: true,
    number: 1
  };

  previewConfigFiveImages: PreviewConfig = {
    visible: true,
    number: 5
  };

  previewConfigNoArrows: PreviewConfig = {
    visible: true,
    arrows: false
  };

  previewConfigNoClickable: PreviewConfig = {
    visible: true,
    clickable: false
  };

  // TODO still not implemented
  previewConfigAlwaysCenter: PreviewConfig = {
    visible: true
  };

  previewConfigCustomSize: PreviewConfig = {
    visible: true,
    size: { width: '30px', height: '30px' }
  };

  currentImageConfigExperimental = {
    loadingConfig: { enable: true, type: LoadingType.STANDARD } as LoadingConfig,
    description: { strategy: DescriptionStrategy.ALWAYS_VISIBLE } as Description
  } as CurrentImageConfig;

  accessibilityConfig: AccessibilityConfig = {
    backgroundAriaLabel: 'CUSTOM Modal gallery full screen background',
    backgroundTitle: 'CUSTOM background title',

    plainGalleryContentAriaLabel: 'CUSTOM Plain gallery content',
    plainGalleryContentTitle: 'CUSTOM plain gallery content title',

    modalGalleryContentAriaLabel: 'CUSTOM Modal gallery content',
    modalGalleryContentTitle: 'CUSTOM modal gallery content title',

    loadingSpinnerAriaLabel: 'CUSTOM The current image is loading. Please be patient.',
    loadingSpinnerTitle: 'CUSTOM The current image is loading. Please be patient.',

    mainContainerAriaLabel: 'CUSTOM Current image and navigation',
    mainContainerTitle: 'CUSTOM main container title',
    mainPrevImageAriaLabel: 'CUSTOM Previous image',
    mainPrevImageTitle: 'CUSTOM Previous image',
    mainNextImageAriaLabel: 'CUSTOM Next image',
    mainNextImageTitle: 'CUSTOM Next image',

    dotsContainerAriaLabel: 'CUSTOM Image navigation dots',
    dotsContainerTitle: 'CUSTOM dots container title',
    dotAriaLabel: 'CUSTOM Navigate to image number',

    previewsContainerAriaLabel: 'CUSTOM Image previews',
    previewsContainerTitle: 'CUSTOM previews title',
    previewScrollPrevAriaLabel: 'CUSTOM Scroll previous previews',
    previewScrollPrevTitle: 'CUSTOM Scroll previous previews',
    previewScrollNextAriaLabel: 'CUSTOM Scroll next previews',
    previewScrollNextTitle: 'CUSTOM Scroll next previews',

    carouselContainerAriaLabel: 'Current image and navigation',
    carouselContainerTitle: '',
    carouselPrevImageAriaLabel: 'Previous image',
    carouselPrevImageTitle: 'Previous image',
    carouselNextImageAriaLabel: 'Next image',
    carouselNextImageTitle: 'Next image',
    carouselPreviewsContainerAriaLabel: 'Image previews',
    carouselPreviewsContainerTitle: '',
    carouselPreviewScrollPrevAriaLabel: 'Scroll previous previews',
    carouselPreviewScrollPrevTitle: 'Scroll previous previews',
    carouselPreviewScrollNextAriaLabel: 'Scroll next previews',
    carouselPreviewScrollNextTitle: 'Scroll next previews'
  };

  private count = 0;

  // subscriptions to receive events from the gallery
  // REMEMBER TO call unsubscribe(); in ngOnDestroy (see below)
  private closeSubscription: Subscription;
  private showSubscription: Subscription;
  private firstImageSubscription: Subscription;
  private lastImageSubscription: Subscription;
  private hasDataSubscription: Subscription;
  private buttonBeforeHookSubscription: Subscription;
  private buttonAfterHookSubscription: Subscription;

  constructor(private modalGalleryService: ModalGalleryService, private sanitizer: DomSanitizer) {}

  // this variable is used only for example of auto navigation
  isShownAutoNavigate = false;
  private timeout;

  openModalWithAutoClose(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: LibConfig) {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      config: {
        id,
        images: imagesArrayToUse,
        currentImage: imageToShow,
        libConfig
      }
    } as ModalGalleryConfig);

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

  // onShowAutoNavigateExample(event: ImageModalEvent, galleryId: number) {
  //   if (this.isShownAutoNavigate) {
  //     // this prevent multiple triggers of this method
  //     // this is only an example and shouldn't be done in this way in a real app
  //     return;
  //   }
  //   console.log(`onShowAutoNavigateExample with id=${galleryId} action: ` + Action[event.action]);
  //   console.log('onShowAutoNavigateExample result:' + event.result);
  //   console.log('Starting timeout of 3 second to navigate to image 0 and then to the next every second automatically');
  //   setTimeout(() => {
  //     this.isShownAutoNavigate = true;
  //     console.log('setTimeout end - navigating to index 0, gallery with id=' + galleryId);
  //     this.galleryService.navigateGallery(galleryId, 0);
  //
  //     setTimeout(() => {
  //       console.log('setTimeout end - navigating to index 1, gallery with id=' + galleryId);
  //       this.galleryService.navigateGallery(galleryId, 1);
  //
  //       setTimeout(() => {
  //         console.log('setTimeout end - navigating to index 2 (finished :) !), gallery with id=' + galleryId);
  //         this.galleryService.navigateGallery(galleryId, 2);
  //       }, 3000);
  //     }, 3000);
  //   }, 3000);
  // }

  addRandomImage() {
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

  openModal(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: LibConfig) {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      config: {
        id,
        images: imagesArrayToUse,
        currentImage: imageToShow,
        libConfig
      }
    } as ModalGalleryConfig);
  }

  openModalWithOutputs(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: LibConfig) {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      config: {
        id,
        images: imagesArrayToUse,
        currentImage: imageToShow,
        libConfig
      }
    } as ModalGalleryConfig);
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

  openModalWithDeleteButton(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: LibConfig) {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      config: {
        id,
        images: [...imagesArrayToUse],
        currentImage: Object.assign({}, imageToShow),
        libConfig
      }
    } as ModalGalleryConfig);
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

  openModalWithAddButton(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: LibConfig) {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      config: {
        id,
        images: imagesArrayToUse,
        currentImage: imageToShow,
        libConfig
      }
    } as ModalGalleryConfig);
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

  openModalWithAutoAdd(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: LibConfig) {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      config: {
        id,
        images: imagesArrayToUse,
        currentImage: imageToShow,
        libConfig
      }
    } as ModalGalleryConfig);
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

  openModalWithAutoUpdate(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: LibConfig) {
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      config: {
        id,
        images: imagesArrayToUse,
        currentImage: imageToShow,
        libConfig
      }
    } as ModalGalleryConfig);
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

  trackById(index: number, item: Image) {
    return item.id;
  }

  autoPlayButton(config: LibConfig) {
    this.isPlaying = !this.isPlaying;
    if (config && config.slideConfig && config.slideConfig.playConfig) {
      config.slideConfig.playConfig.autoPlay = this.isPlaying;
    }
    return this.isPlaying;
  }

  ngOnDestroy() {
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