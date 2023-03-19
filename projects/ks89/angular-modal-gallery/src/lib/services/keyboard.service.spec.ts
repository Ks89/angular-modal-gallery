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

import { waitForAsync, inject, TestBed } from '@angular/core/testing';
import { InjectionToken } from '@angular/core';

import { KeyboardService } from './keyboard.service';
import { KeyboardServiceConfig } from '../model/keyboard-service-config.interface';

const KEYBOARD_CONFIGURATION = new InjectionToken<KeyboardServiceConfig>('KEYBOARD_CONFIGURATION');

function setupRouter(injector: KeyboardServiceConfig): KeyboardService {
  return new KeyboardService(injector);
}

describe('KeyboardService', () => {

  describe('KeyboardService WITHOUT external config via forRoot()', () => {
    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: KeyboardService,
              useFactory: setupRouter,
              deps: [KEYBOARD_CONFIGURATION]
            },
            {
              provide: KEYBOARD_CONFIGURATION,
              useValue: {}
            }
          ]
        });
      })
    );

    it('should instantiate service when inject service',
      inject([KeyboardService], (service: KeyboardService) => {
        expect(service instanceof KeyboardService).toEqual(true);
      })
    );

    describe('#reset()', () => {
      it('should call reset',
        inject([KeyboardService], (service: KeyboardService) => {
          service.reset({});
        })
      );
    });

    describe('#add()', () => {
      it('should call add',
        inject([KeyboardService], (service: KeyboardService) => {
          service.add(() => null, {});
        })
      );
    });
  });

  describe('KeyboardService WITH external config via forRoot()', () => {
    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: KeyboardService,
              useFactory: setupRouter,
              deps: [KEYBOARD_CONFIGURATION]
            },
            {
              provide: KEYBOARD_CONFIGURATION,
              useValue: {shortcuts: ['ctrl+a', 'ctrl+s']}
            }
          ]
        });
      })
    );

    it('should instantiate service when inject service',
      inject([KeyboardService], (service: KeyboardService) => {
        expect(service instanceof KeyboardService).toEqual(true);
      })
    );

    describe('#reset()', () => {
      it('should call reset',
        inject([KeyboardService], (service: KeyboardService) => {
          service.reset({});
        })
      );
    });

    describe('#add()', () => {
      it('should call add',
        inject([KeyboardService], (service: KeyboardService) => {
          service.add(() => null, {});
        })
      );
    });
  });
});
