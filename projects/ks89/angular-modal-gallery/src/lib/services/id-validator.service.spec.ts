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

import { IdValidatorService } from './id-validator.service';

const validIds: number[] = [0, 1, 2, 3, 500, 900, 1000];
const notValidIds: number[] = [-12, -50, -1, NaN];

const errorMessage = 'You must provide a valid [id]="unique integer > 0 here" to the gallery/carousel in your template';

function getErrorNotUnique(galleryId: number): string {
  return `Cannot create gallery with id=${galleryId} because already used in your application. This must be a unique integer >= 0`;
}

describe('IdValidatorService', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [IdValidatorService]
      });
    })
  );

  it('should instantiate service when inject service',
    inject([IdValidatorService], (service: IdValidatorService) => {
      expect(service instanceof IdValidatorService).toEqual(true);
    })
  );

  describe('#checkAndAdd()', () => {
    validIds.forEach((val: number, index: number) => {
      it(`should call checkAndAdd with valid inputs expecting true as result. Test i=${index}`,
        inject([IdValidatorService], (service: IdValidatorService) => {
          expect(service.checkAndAdd(val)).toBeTruthy();
        })
      );
    });

    notValidIds.forEach((val: number, index: number) => {
      it(`should call checkAndAdd with bad inputs expecting an error as result. Test i=${index}`,
        inject([IdValidatorService], (service: IdValidatorService) => {
          expect(() => service.checkAndAdd(val)).toThrow(new Error(errorMessage));
        })
      );
    });

    it(`should call checkAndAdd multiple times with the same input expecting an error as result.`,
      inject([IdValidatorService], (service: IdValidatorService) => {
        const multipleValue = 5;
        service.checkAndAdd(0);
        service.checkAndAdd(1);
        service.checkAndAdd(multipleValue);
        service.checkAndAdd(300);
        expect(() => service.checkAndAdd(multipleValue)).toThrow(new Error(getErrorNotUnique(multipleValue)));
      })
    );
  });

  describe('#remove()', () => {
    validIds.forEach((val: number, index: number) => {
      it(`should call remove with valid inputs expecting true as result. Test i=${index}`,
        inject([IdValidatorService], (service: IdValidatorService) => {
          expect(service.remove(val)).toBeTruthy();
        })
      );
    });

    it(`should call remove multiple times with the same input expecting true as result.`,
      inject([IdValidatorService], (service: IdValidatorService) => {
        const multipleValue = 5;
        service.checkAndAdd(0);
        service.checkAndAdd(1);
        service.checkAndAdd(multipleValue);
        expect(service.remove(multipleValue)).toBeTruthy();
        expect(service.remove(multipleValue)).toBeTruthy();
      })
    );

    it(`should call remove for a non existing id expecting true as result.`,
      inject([IdValidatorService], (service: IdValidatorService) => {
        const notExisting = 5;
        service.checkAndAdd(0);
        service.checkAndAdd(1);
        expect(service.remove(notExisting)).toBeTruthy();
        expect(service.remove(notExisting)).toBeTruthy();
      })
    );

    it(`should call remove for an id and add it again without errors.`,
      inject([IdValidatorService], (service: IdValidatorService) => {
        const validId = 5;
        service.checkAndAdd(0);
        service.checkAndAdd(1);
        service.checkAndAdd(validId);
        expect(service.remove(validId)).toBeTruthy();
        expect(service.checkAndAdd(validId)).toBeTruthy();
        expect(service.remove(validId)).toBeTruthy();
        expect(service.checkAndAdd(validId)).toBeTruthy();
      })
    );

    notValidIds.forEach((val: number, index: number) => {
      it(`should call remove with bad inputs expecting an error as result. Test i=${index}`,
        inject([IdValidatorService], (service: IdValidatorService) => {
          expect(() => service.remove(val)).toThrow(new Error(errorMessage));
        })
      );
    });
  });
});
