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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaxSizeDirective } from './max-size.directive';
import { MaxSize } from '../model/max-size.interface';

const expected: MaxSize[] = [
  {maxWidth: '100px', maxHeight: '80px'},
  {maxWidth: '50px', maxHeight: '20px'},
  {maxWidth: '50%', maxHeight: '100%'},
  {maxWidth: '', maxHeight: ''},
  {}
];

@Component({
  selector: 'ks-test-max-size',
  template: `
    <div ksMaxSize [maxSizeConfig]="{maxWidth: '100px', maxHeight: '80px'}"></div>
    <div ksMaxSize [maxSizeConfig]="{maxWidth: '50px', maxHeight: '20px'}"></div>
    <div ksMaxSize [maxSizeConfig]="{maxWidth: '50%', maxHeight: '100%'}"></div>
    <div ksMaxSize [maxSizeConfig]="{maxWidth: '', maxHeight: ''}"></div>
    <div ksMaxSize [maxSizeConfig]="null"></div>
  `
})
class TestSizeComponent {}

let fixture: ComponentFixture<TestSizeComponent>;
let comp: TestSizeComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

describe('MaxSizeDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestSizeComponent, MaxSizeDirective]
    }); // not necessary with webpack .compileComponents();
    fixture = TestBed.createComponent(TestSizeComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      bareElement = fixture.debugElement.query(By.css('div:not(ksMaxSize)'));
      des = fixture.debugElement.queryAll(By.directive(MaxSizeDirective));
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have this directive', () => {
      expect(des.length).toBe(expected.length);
    });

    expected.forEach((val: MaxSize, index: number) => {
      it(`should check expected results for <div> at position ${index}`, () => {
        // I'm using `|| ''` because it's not possible to have undefined inside css,
        // instead my MaxSize interface have all its fields optional, so they can be undefined.
        expect(des[index].nativeElement.style['max-width']).toBe(val.maxWidth || '');
        expect(des[index].nativeElement.style['max-height']).toBe(val.maxHeight || '');
      });
    });

    it('should check expected results for bare <div> without this directive', () => {
      expect(bareElement.properties.ksMaxSize).toBeUndefined();
    });
  });
});
