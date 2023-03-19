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

import { inject, TestBed, waitForAsync } from '@angular/core/testing';

import {
  ConfigService,
  DEFAULT_CAROUSEL_BREAKPOINTS,
  DEFAULT_CAROUSEL_DESCRIPTION,
  DEFAULT_CAROUSEL_IMAGE_CONFIG,
  DEFAULT_CAROUSEL_PREVIEWS_CONFIG,
  DEFAULT_CURRENT_CAROUSEL_CONFIG,
  DEFAULT_CURRENT_CAROUSEL_PLAY,
  DEFAULT_CURRENT_IMAGE_CONFIG,
  DEFAULT_DESCRIPTION,
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_KEYBOARD_SERVICE_CONFIG,
  DEFAULT_LAYOUT,
  DEFAULT_LOADING,
  DEFAULT_PLAIN_CONFIG,
  DEFAULT_PREVIEW_CONFIG,
  DEFAULT_PREVIEW_SIZE,
  DEFAULT_SLIDE_CONFIG
} from './config.service';
import { LibConfig } from '../model/lib-config.interface';
import { ButtonsConfig, ButtonsStrategy, ButtonType } from '../model/buttons-config.interface';
import { AccessibilityConfig } from '../model/accessibility.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../components/accessibility-default';
import { Size } from '../model/size.interface';
import { DotsConfig } from '../model/dots-config.interface';
import { KeyboardConfig } from '../model/keyboard-config.interface';
import { CarouselConfig } from '../model/carousel-config.interface';
import { PlayConfig } from '../model/play-config.interface';
import { KeyboardServiceConfig } from '../model/keyboard-service-config.interface';
import { CarouselPreviewConfig } from '../model/carousel-preview-config.interface';
import { CarouselImageConfig } from '../model/carousel-image-config.interface';
import { Description, DescriptionStrategy, DescriptionStyle } from '../model/description.interface';
import { AdvancedConfig, GridLayout, LineLayout, PlainGalleryConfig, PlainGalleryStrategy } from '../model/plain-gallery-config.interface';
import { CurrentImageConfig } from '../model/current-image-config.interface';
import { LoadingConfig, LoadingType } from '../model/loading-config.interface';
import { SidePreviewsConfig, SlideConfig } from '../model/slide-config.interface';
import { PreviewConfig } from '../model/preview-config.interface';

// tslint:disable:no-shadowed-variable

describe('ConfigService', () => {

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [ConfigService]
      });
    })
  );

  it('should instantiate service when inject service',
    inject([ConfigService], (service: ConfigService) => {
      expect(service instanceof ConfigService).toEqual(true);
    })
  );

  describe('#setConfig()', () => {

    describe('---YES---', () => {

      describe('slideConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined slideConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              slideConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.slideConfig).toEqual(DEFAULT_SLIDE_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom slideConfig (playConfig and sidePreviews are undefined)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              slideConfig: {
                infinite: true,
                playConfig: undefined,
                sidePreviews: undefined
              } as SlideConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.slideConfig?.infinite).toEqual(inputConfig.slideConfig?.infinite);
            expect(result?.slideConfig?.playConfig).toEqual({autoPlay: false, interval: 5000, pauseOnHover: true} as PlayConfig);
            expect(result?.slideConfig?.sidePreviews).toEqual({show: true, size: {width: '100px', height: 'auto'}} as SidePreviewsConfig);
          })
        );

        it(`should call setConfig to update the library configuration with a custom slideConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              slideConfig: {
                infinite: true,
                playConfig: {autoPlay: true, interval: 10000, pauseOnHover: false} as PlayConfig,
                sidePreviews: {show: false, size: {width: '200px', height: '100px'}} as SidePreviewsConfig
              } as SlideConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.slideConfig?.infinite).toEqual(inputConfig.slideConfig?.infinite);
            expect(result?.slideConfig?.playConfig?.autoPlay).toEqual(inputConfig.slideConfig?.playConfig?.autoPlay);
            expect(result?.slideConfig?.playConfig?.interval).toEqual(inputConfig.slideConfig?.playConfig?.interval);
            expect(result?.slideConfig?.playConfig?.pauseOnHover).toEqual(inputConfig.slideConfig?.playConfig?.pauseOnHover);
            expect(result?.slideConfig?.sidePreviews?.show).toEqual(inputConfig.slideConfig?.sidePreviews?.show);
            expect(result?.slideConfig?.sidePreviews?.size?.width).toEqual(inputConfig.slideConfig?.sidePreviews?.size?.width);
            expect(result?.slideConfig?.sidePreviews?.size?.height).toEqual(inputConfig.slideConfig?.sidePreviews?.size?.height);
          })
        );
      });

      describe('accessibilityConfig', () => {
        it(`should call setConfig to update the library configuration with an undefined accessibilityConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              accessibilityConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.accessibilityConfig).toEqual(KS_DEFAULT_ACCESSIBILITY_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom accessibilityConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              accessibilityConfig: {
                backgroundAriaLabel: 'example-test'
              } as AccessibilityConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            if (!result || !result.accessibilityConfig || !inputConfig || !inputConfig.accessibilityConfig) {
              throw new Error('Interrupted test, because of some undefined values');
            }
            expect(result.accessibilityConfig.backgroundAriaLabel).toEqual(inputConfig.accessibilityConfig.backgroundAriaLabel);
          })
        );
      });

      describe('previewConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined previewConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              previewConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.previewConfig).toEqual(DEFAULT_PREVIEW_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom previewConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              previewConfig: {
                visible: false,
                number: 2,
                arrows: false,
                clickable: false,
                size: DEFAULT_PREVIEW_SIZE
              } as PreviewConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.previewConfig?.visible).toEqual(inputConfig.previewConfig?.visible);
            expect(result?.previewConfig?.number).toEqual(inputConfig.previewConfig?.number);
            expect(result?.previewConfig?.arrows).toEqual(inputConfig.previewConfig?.arrows);
            expect(result?.previewConfig?.clickable).toEqual(inputConfig.previewConfig?.clickable);
            expect(result?.previewConfig?.size).toEqual(inputConfig.previewConfig?.size);
          })
        );

        it(`should call setConfig to update the library configuration with a custom previewConfig (number < 0)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              previewConfig: {
                visible: false,
                number: -1,
                arrows: false,
                clickable: false,
                size: DEFAULT_PREVIEW_SIZE
              } as PreviewConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.previewConfig?.visible).toEqual(inputConfig.previewConfig?.visible);
            expect(result?.previewConfig?.number).toEqual(DEFAULT_PREVIEW_CONFIG.number);
            expect(result?.previewConfig?.arrows).toEqual(inputConfig.previewConfig?.arrows);
            expect(result?.previewConfig?.clickable).toEqual(inputConfig.previewConfig?.clickable);
            expect(result?.previewConfig?.size).toEqual(inputConfig.previewConfig?.size);
          })
        );

        it(`should call setConfig to update the library configuration with a custom previewConfig (number = 0)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              previewConfig: {
                visible: false,
                number: 0,
                arrows: false,
                clickable: false,
                size: DEFAULT_PREVIEW_SIZE
              } as PreviewConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.previewConfig?.visible).toEqual(inputConfig.previewConfig?.visible);
            expect(result?.previewConfig?.number).toEqual(DEFAULT_PREVIEW_CONFIG.number);
            expect(result?.previewConfig?.arrows).toEqual(inputConfig.previewConfig?.arrows);
            expect(result?.previewConfig?.clickable).toEqual(inputConfig.previewConfig?.clickable);
            expect(result?.previewConfig?.size).toEqual(inputConfig.previewConfig?.size);
          })
        );
      });

      describe('buttonsConfig', () => {
        it(`should call setConfig to update the library configuration with an undefined buttonsConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              buttonsConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.buttonsConfig).toEqual({visible: true, strategy: ButtonsStrategy.DEFAULT});
          })
        );

        it(`should call setConfig to update the library configuration with a custom buttonsConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const customConfig: ButtonsConfig = {
              visible: false,
              strategy: ButtonsStrategy.CUSTOM,
              buttons: [{
                className: 'fake',
                size: {height: '100px', width: '200px'} as Size,
                fontSize: '12px',
                type: ButtonType.CUSTOM,
                title: 'fake title',
                ariaLabel: 'fake aria label',
                extUrlInNewTab: false
              }]
            };
            const inputConfig: LibConfig = {
              buttonsConfig: customConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.buttonsConfig?.visible).toEqual(inputConfig.buttonsConfig?.visible);
            expect(result?.buttonsConfig?.strategy).toEqual(inputConfig.buttonsConfig?.strategy);
            expect(result?.buttonsConfig?.buttons).toEqual(inputConfig.buttonsConfig?.buttons);
          })
        );
      });

      describe('dotsConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined dotsConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              dotsConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.dotsConfig).toEqual({visible: true} as DotsConfig);
          })
        );

        it(`should call setConfig to update the library configuration with a custom dotsConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              dotsConfig: {visible: false} as DotsConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.dotsConfig?.visible).toEqual(inputConfig.dotsConfig?.visible);
          })
        );
      });

      describe('plainGalleryConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined plainGalleryConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              plainGalleryConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.plainGalleryConfig).toEqual(DEFAULT_PLAIN_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom plainGalleryConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              plainGalleryConfig: {
                strategy: PlainGalleryStrategy.ROW,
                layout: DEFAULT_LAYOUT,
                advanced: undefined
              } as PlainGalleryConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.plainGalleryConfig?.strategy).toEqual(inputConfig.plainGalleryConfig?.strategy);
            expect(result?.plainGalleryConfig?.layout).toEqual(inputConfig.plainGalleryConfig?.layout);
            expect(result?.plainGalleryConfig?.advanced).toEqual({aTags: false, additionalBackground: '50% 50%/cover'} as AdvancedConfig);
          })
        );

        it(`should call setConfig to update the library configuration with a custom plainGalleryConfig with custom advanced`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              plainGalleryConfig: {
                strategy: PlainGalleryStrategy.ROW,
                layout: DEFAULT_LAYOUT,
                advanced: {aTags: true, additionalBackground: '10% 10%/cover'} as AdvancedConfig
              } as PlainGalleryConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.plainGalleryConfig?.strategy).toEqual(inputConfig.plainGalleryConfig?.strategy);
            expect(result?.plainGalleryConfig?.layout).toEqual(inputConfig.plainGalleryConfig?.layout);
            expect(result?.plainGalleryConfig?.advanced?.aTags).toEqual(inputConfig.plainGalleryConfig?.advanced?.aTags);
            expect(result?.plainGalleryConfig?.advanced?.additionalBackground).toEqual(inputConfig.plainGalleryConfig?.advanced?.additionalBackground);
          })
        );

        it(`should call setConfig to update the library configuration with a custom plainGalleryConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              plainGalleryConfig: {
                strategy: PlainGalleryStrategy.GRID,
                layout: new GridLayout(DEFAULT_PREVIEW_SIZE, {length: -1, wrap: false}),
                advanced: {aTags: true, additionalBackground: '10% 10%/cover'} as AdvancedConfig
              } as PlainGalleryConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            // wrap is forced to true in case of GridLayout
            expect((result?.plainGalleryConfig?.layout as GridLayout).breakConfig?.wrap).toEqual(true);
          })
        );
      });

      describe('currentImageConfig', () => {
        it(`should call setConfig to update the library configuration with an undefined currentImageConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              currentImageConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.currentImageConfig).toEqual(DEFAULT_CURRENT_IMAGE_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom currentImageConfig (loadingConfig and description are undefined)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              currentImageConfig: {
                navigateOnClick: false,
                loadingConfig: undefined,
                description: undefined,
                downloadable: true,
                invertSwipe: true
              } as CurrentImageConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.currentImageConfig?.navigateOnClick).toEqual(inputConfig.currentImageConfig?.navigateOnClick);
            expect(result?.currentImageConfig?.downloadable).toEqual(inputConfig.currentImageConfig?.downloadable);
            expect(result?.currentImageConfig?.invertSwipe).toEqual(inputConfig.currentImageConfig?.invertSwipe);
            expect(result?.currentImageConfig?.loadingConfig).toEqual(DEFAULT_LOADING);
            expect(result?.currentImageConfig?.description).toEqual(DEFAULT_DESCRIPTION);
          })
        );

        it(`should call setConfig to update the library configuration with a custom currentImageConfig (custom loadingConfig)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              currentImageConfig: {
                navigateOnClick: false,
                loadingConfig: {enable: false, type: LoadingType.CIRCLES} as LoadingConfig,
                description: undefined,
                downloadable: true,
                invertSwipe: true
              } as CurrentImageConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.currentImageConfig?.navigateOnClick).toEqual(inputConfig.currentImageConfig?.navigateOnClick);
            expect(result?.currentImageConfig?.downloadable).toEqual(inputConfig.currentImageConfig?.downloadable);
            expect(result?.currentImageConfig?.invertSwipe).toEqual(inputConfig.currentImageConfig?.invertSwipe);
            expect(result?.currentImageConfig?.loadingConfig?.enable).toEqual(inputConfig.currentImageConfig?.loadingConfig?.enable);
            expect(result?.currentImageConfig?.loadingConfig?.type).toEqual(inputConfig.currentImageConfig?.loadingConfig?.type);
            expect(result?.currentImageConfig?.description).toEqual(DEFAULT_DESCRIPTION);
          })
        );

        it(`should call setConfig to update the library configuration with a custom currentImageConfig (custom description)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              currentImageConfig: {
                navigateOnClick: false,
                loadingConfig: undefined,
                description: {
                  strategy: DescriptionStrategy.HIDE_IF_EMPTY,
                  imageText: 'Img ',
                  numberSeparator: ' of ',
                  beforeTextDescription: ' * ',
                  style: DEFAULT_DESCRIPTION_STYLE
                } as Description,
                downloadable: true,
                invertSwipe: true
              } as CurrentImageConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.currentImageConfig?.navigateOnClick).toEqual(inputConfig.currentImageConfig?.navigateOnClick);
            expect(result?.currentImageConfig?.downloadable).toEqual(inputConfig.currentImageConfig?.downloadable);
            expect(result?.currentImageConfig?.invertSwipe).toEqual(inputConfig.currentImageConfig?.invertSwipe);
            expect(result?.currentImageConfig?.loadingConfig).toEqual(DEFAULT_LOADING);
            expect(result?.currentImageConfig?.description?.strategy).toEqual(inputConfig.currentImageConfig?.description?.strategy);
            expect(result?.currentImageConfig?.description?.imageText).toEqual(inputConfig.currentImageConfig?.description?.imageText);
            expect(result?.currentImageConfig?.description?.numberSeparator).toEqual(inputConfig.currentImageConfig?.description?.numberSeparator);
            expect(result?.currentImageConfig?.description?.beforeTextDescription).toEqual(inputConfig.currentImageConfig?.description?.beforeTextDescription);
            expect(result?.currentImageConfig?.description?.style).toEqual(inputConfig.currentImageConfig?.description?.style);
          })
        );

        it(`should call setConfig to update the library configuration with a custom currentImageConfig (custom description with style undefined)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              currentImageConfig: {
                navigateOnClick: false,
                loadingConfig: undefined,
                description: {
                  strategy: DescriptionStrategy.ALWAYS_VISIBLE,
                  imageText: 'Img ',
                  numberSeparator: ' of ',
                  beforeTextDescription: ' * ',
                  style: undefined
                } as Description,
                downloadable: true,
                invertSwipe: true
              } as CurrentImageConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.currentImageConfig?.navigateOnClick).toEqual(inputConfig.currentImageConfig?.navigateOnClick);
            expect(result?.currentImageConfig?.downloadable).toEqual(inputConfig.currentImageConfig?.downloadable);
            expect(result?.currentImageConfig?.invertSwipe).toEqual(inputConfig.currentImageConfig?.invertSwipe);
            expect(result?.currentImageConfig?.loadingConfig).toEqual(DEFAULT_LOADING);
            expect(result?.currentImageConfig?.description?.strategy).toEqual(inputConfig.currentImageConfig?.description?.strategy);
            expect(result?.currentImageConfig?.description?.imageText).toEqual(inputConfig.currentImageConfig?.description?.imageText);
            expect(result?.currentImageConfig?.description?.numberSeparator).toEqual(inputConfig.currentImageConfig?.description?.numberSeparator);
            expect(result?.currentImageConfig?.description?.beforeTextDescription).toEqual(inputConfig.currentImageConfig?.description?.beforeTextDescription);
            expect(result?.currentImageConfig?.description?.style).toEqual(DEFAULT_DESCRIPTION_STYLE);
          })
        );
      });

      describe('keyboardConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined keyboardConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              keyboardConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.keyboardConfig).toEqual(undefined);
          })
        );

        it(`should call setConfig to update the library configuration with a custom keyboardConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              keyboardConfig: {
                esc: 'KeyQ',
                right: 'KeyW',
                left: 'KeyE'
              } as KeyboardConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.keyboardConfig).toEqual(inputConfig.keyboardConfig);
          })
        );
      });

      describe('carouselImageConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined carouselImageConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselImageConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselImageConfig).toEqual(DEFAULT_CAROUSEL_IMAGE_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom carouselImageConfig (description undefined)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselImageConfig: {
                description: undefined,
                invertSwipe: true
              } as CarouselImageConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselImageConfig?.invertSwipe).toEqual(inputConfig.carouselImageConfig?.invertSwipe);
            expect(result?.carouselImageConfig?.description).toEqual(DEFAULT_CAROUSEL_DESCRIPTION);
          })
        );

        it(`should call setConfig to update the library configuration with a custom carouselImageConfig (description.style undefined)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselImageConfig: {
                description: {
                  strategy: DescriptionStrategy.ALWAYS_HIDDEN,
                  imageText: 'Img ',
                  numberSeparator: ' of ',
                  beforeTextDescription: ' * ',
                  style: undefined
                },
                invertSwipe: true
              } as CarouselImageConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselImageConfig?.invertSwipe).toEqual(inputConfig.carouselImageConfig?.invertSwipe);
            expect(result?.carouselImageConfig?.description?.strategy).toEqual(inputConfig.carouselImageConfig?.description?.strategy);
            expect(result?.carouselImageConfig?.description?.imageText).toEqual(inputConfig.carouselImageConfig?.description?.imageText);
            expect(result?.carouselImageConfig?.description?.numberSeparator).toEqual(inputConfig.carouselImageConfig?.description?.numberSeparator);
            expect(result?.carouselImageConfig?.description?.beforeTextDescription).toEqual(inputConfig.carouselImageConfig?.description?.beforeTextDescription);
            expect(result?.carouselImageConfig?.description?.style).toEqual(DEFAULT_DESCRIPTION_STYLE);
          })
        );

        it(`should call setConfig to update the library configuration with a custom carouselImageConfig (custom description.style)`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselImageConfig: {
                description: {
                  strategy: DescriptionStrategy.ALWAYS_HIDDEN,
                  imageText: 'Img ',
                  numberSeparator: ' of ',
                  beforeTextDescription: ' * ',
                  style: {
                    bgColor: 'rgba(200, 0, 120, .5)',
                    textColor: 'black',
                    marginTop: '5px',
                    marginBottom: '10px',
                    marginLeft: '10px',
                    marginRight: '10px'
                  } as DescriptionStyle
                },
                invertSwipe: true
              } as CarouselImageConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselImageConfig?.invertSwipe).toEqual(inputConfig.carouselImageConfig?.invertSwipe);
            expect(result?.carouselImageConfig?.description?.strategy).toEqual(inputConfig.carouselImageConfig?.description?.strategy);
            expect(result?.carouselImageConfig?.description?.imageText).toEqual(inputConfig.carouselImageConfig?.description?.imageText);
            expect(result?.carouselImageConfig?.description?.numberSeparator).toEqual(inputConfig.carouselImageConfig?.description?.numberSeparator);
            expect(result?.carouselImageConfig?.description?.beforeTextDescription).toEqual(inputConfig.carouselImageConfig?.description?.beforeTextDescription);
            expect(result?.carouselImageConfig?.description?.style?.bgColor).toEqual(inputConfig.carouselImageConfig?.description?.style?.bgColor);
            expect(result?.carouselImageConfig?.description?.style?.textColor).toEqual(inputConfig.carouselImageConfig?.description?.style?.textColor);
            expect(result?.carouselImageConfig?.description?.style?.marginTop).toEqual(inputConfig.carouselImageConfig?.description?.style?.marginTop);
            expect(result?.carouselImageConfig?.description?.style?.marginBottom).toEqual(inputConfig.carouselImageConfig?.description?.style?.marginBottom);
            expect(result?.carouselImageConfig?.description?.style?.marginLeft).toEqual(inputConfig.carouselImageConfig?.description?.style?.marginLeft);
            expect(result?.carouselImageConfig?.description?.style?.marginRight).toEqual(inputConfig.carouselImageConfig?.description?.style?.marginRight);
          })
        );
      });

      describe('carouselConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined carouselConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselConfig).toEqual(DEFAULT_CURRENT_CAROUSEL_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom carouselConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselConfig: {
                maxWidth: '80%',
                maxHeight: '200px',
                showArrows: false,
                objectFit: 'cover',
                keyboardEnable: false,
                modalGalleryEnable: false
              } as CarouselConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselConfig).toEqual(inputConfig.carouselConfig);
          })
        );
      });

      describe('carouselPlayConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined carouselPlayConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselPlayConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselPlayConfig).toEqual(DEFAULT_CURRENT_CAROUSEL_PLAY);
          })
        );

        it(`should call setConfig to update the library configuration with a custom carouselPlayConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselPlayConfig: {
                autoPlay: false,
                interval: 1000,
                pauseOnHover: false
              } as PlayConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselPlayConfig).toEqual(inputConfig.carouselPlayConfig);
          })
        );
      });

      describe('carouselPreviewsConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined carouselPreviewsConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselPreviewsConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselPreviewsConfig).toEqual(DEFAULT_CAROUSEL_PREVIEWS_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with an undefined carouselPreviewsConfig without 'breakpoints'`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselPreviewsConfig: {
                visible: true,
                number: 4,
                arrows: true,
                clickable: true,
                width: 100 / 4 + '%',
                maxHeight: '200px'
              } as CarouselPreviewConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselPreviewsConfig).toEqual(DEFAULT_CAROUSEL_PREVIEWS_CONFIG);
          })
        );

        [0, -1].forEach((item: number, index: number) => {
          it(`should call setConfig to update the library configuration with a custom carouselPreviewsConfig with invalid 'number'. Test i = ${index}`,
            inject([ConfigService], (service: ConfigService) => {
              const inputConfig: LibConfig = {
                carouselPreviewsConfig: {
                  visible: false,
                  number: item,
                  arrows: false,
                  clickable: false,
                  width: 100 / 2 + '%',
                  maxHeight: '100px',
                  breakpoints: DEFAULT_CAROUSEL_BREAKPOINTS
                } as CarouselPreviewConfig
              };
              service.setConfig(1, inputConfig);
              const result: LibConfig | undefined = service.getConfig(1);
              const numberVal: number = DEFAULT_CAROUSEL_PREVIEWS_CONFIG.number as number;
              const widthVal: number = 100 / numberVal;
              expect(result?.carouselPreviewsConfig?.visible).toEqual(inputConfig.carouselPreviewsConfig?.visible);
              expect(result?.carouselPreviewsConfig?.number).toEqual(numberVal);
              expect(result?.carouselPreviewsConfig?.arrows).toEqual(inputConfig.carouselPreviewsConfig?.arrows);
              expect(result?.carouselPreviewsConfig?.clickable).toEqual(inputConfig.carouselPreviewsConfig?.clickable);
              expect(result?.carouselPreviewsConfig?.width).toEqual(`${widthVal}%`);
              expect(result?.carouselPreviewsConfig?.maxHeight).toEqual(inputConfig.carouselPreviewsConfig?.maxHeight);
              expect(result?.carouselPreviewsConfig?.breakpoints).toEqual(inputConfig.carouselPreviewsConfig?.breakpoints);
            })
          );
        });
      });

      describe('carouselDotsConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined carouselDotsConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselDotsConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselDotsConfig).toEqual({visible: true} as DotsConfig);
          })
        );

        it(`should call setConfig to update the library configuration with a custom carouselDotsConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselDotsConfig: {visible: false} as DotsConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.carouselDotsConfig).toEqual(inputConfig.carouselDotsConfig);
          })
        );
      });

      describe('keyboardServiceConfig', () => {

        it(`should call setConfig to update the library configuration with an undefined keyboardServiceConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              keyboardServiceConfig: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.keyboardServiceConfig).toEqual(DEFAULT_KEYBOARD_SERVICE_CONFIG);
          })
        );

        it(`should call setConfig to update the library configuration with a custom keyboardServiceConfig`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              keyboardServiceConfig: {
                shortcuts: ['ctrl+s'],
                disableSsrWorkaround: true
              } as KeyboardServiceConfig
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.keyboardServiceConfig).toEqual(inputConfig.keyboardServiceConfig);
          })
        );
      });

      describe('enableCloseOutside', () => {

        it(`should call setConfig to update the library configuration with an undefined enableCloseOutside`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              enableCloseOutside: undefined
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.enableCloseOutside).toEqual(true);
          })
        );

        it(`should call setConfig to update the library configuration with a custom enableCloseOutside`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              enableCloseOutside: false
            };
            service.setConfig(1, inputConfig);
            const result: LibConfig | undefined = service.getConfig(1);
            expect(result?.enableCloseOutside).toEqual(inputConfig.enableCloseOutside);
          })
        );
      });

      it(`should call setConfig with an undefined configuration object.`,
        inject([ConfigService], (service: ConfigService) => {
          service.setConfig(1, undefined);
          const result: LibConfig | undefined = service.getConfig(1);
          // console.log('result', result);
        })
      );
    });

    describe('---NO---', () => {
      describe('carouselPlayConfig', () => {
        it(`should throw an error if carouselPlayConfig.interval is < 0`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              carouselPlayConfig: {
                autoPlay: false,
                interval: -1,
                pauseOnHover: false
              } as PlayConfig
            };
            expect(() => service.setConfig(1, inputConfig)).toThrowError(`Carousel's interval must be a number >= 0`);
          })
        );
      });

      describe('plainGalleryConfig', () => {
        [PlainGalleryStrategy.GRID, PlainGalleryStrategy.CUSTOM].forEach((item: PlainGalleryStrategy) => {
          it(`should throw an error because 'LineLayout requires either ROW or COLUMN strategy'`,
            inject([ConfigService], (service: ConfigService) => {
              const inputConfig: LibConfig = {
                plainGalleryConfig: {
                  strategy: item,
                  layout: new LineLayout(DEFAULT_PREVIEW_SIZE, {length: -1, wrap: false}, 'flex-start'),
                  advanced: {aTags: true, additionalBackground: '10% 10%/cover'} as AdvancedConfig
                } as PlainGalleryConfig
              };
              expect(() => service.setConfig(1, inputConfig)).toThrowError('LineLayout requires either ROW or COLUMN strategy');
            })
          );
        });

        it(`should throw an error because 'GridLayout requires GRID strategy'`,
          inject([ConfigService], (service: ConfigService) => {
            const inputConfig: LibConfig = {
              plainGalleryConfig: {
                strategy: PlainGalleryStrategy.ROW,
                layout: new GridLayout(DEFAULT_PREVIEW_SIZE, {length: -1, wrap: false}),
                advanced: {aTags: true, additionalBackground: '10% 10%/cover'} as AdvancedConfig
              } as PlainGalleryConfig
            };
            expect(() => service.setConfig(1, inputConfig)).toThrowError('GridLayout requires GRID strategy');
          })
        );
      });
    });
  });
});
