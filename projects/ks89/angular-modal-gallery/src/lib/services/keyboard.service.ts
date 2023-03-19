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

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LibConfig } from '../model/lib-config.interface';

/**
 * Service to intercept ctrl+s (or cmd+s on macOS) using a third-party library, called Mousetrap.
 */
@Injectable({ providedIn: 'root' })
export class KeyboardService {
  /**
   * Private Mousetrap variable to store the instance.
   */
  // tslint:disable-next-line:no-any
  private mousetrapInstance: any;

  // tslint:disable-next-line:no-any
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  init(config: LibConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // temporary workaround to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/142
      if (config.keyboardServiceConfig && !config.keyboardServiceConfig.disableSsrWorkaround) {
        // To prevent issues with angular-universal on server-side
        if (isPlatformBrowser(this.platformId)) {
          import('mousetrap')
            // tslint:disable-next-line:no-any
            .then((loaded: any) => {
              // in this case, the .default is required for Typescript Dynamic Imports
              this.mousetrapInstance = loaded.default;
              resolve();
              return;
            })
            .catch(err => {
              reject(err);
              return;
            });
        } else {
          resolve();
          return;
        }
      } else {
        resolve();
        return;
      }
    });
  }

  /**
   * Method to add a lister for ctrl+s/cmd+s keyboard events.
   * @param (e: KeyboardEvent, combo: string) => any onBind callback function to add shortcuts
   */
  // tslint:disable-next-line:no-any
  add(onBind: (e: KeyboardEvent, combo: string) => any, config: LibConfig): void {
    // temporary workaround to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/142
    if (config.keyboardServiceConfig && !config.keyboardServiceConfig.disableSsrWorkaround) {
      // To prevent issues with angular-universal on server-side
      if (isPlatformBrowser(this.platformId)) {
        this.mousetrapInstance.bind(config.keyboardServiceConfig.shortcuts, (event: KeyboardEvent, combo: string) => {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            // internet explorer
            event.returnValue = false;
          }
          onBind(event, combo);
        });
      }
    }
  }

  /**
   * Method to reset all listeners. Please, call this function when needed
   * to free resources ad prevent leaks.
   */
  reset(config: LibConfig): void {
    // temporary workaround to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/142
    if (config.keyboardServiceConfig && !config.keyboardServiceConfig.disableSsrWorkaround) {
      // To prevent issues with angular-universal on server-side
      if (isPlatformBrowser(this.platformId)) {
        this.mousetrapInstance.reset();
      }
    }
  }
}
