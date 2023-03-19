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
import { SizeDirective } from './size.directive';
import { Size } from '../model/size.interface';

const expected: Size[] = [
  {width: '100px', height: '80px'},
  {width: '50px', height: '20px'},
  {width: '50%', height: '100%'},
  {width: 'auto', height: 'auto'},
  {width: 'auto', height: '20px'},
  {width: '50px', height: 'auto'},
  {width: '', height: ''},
  {width: '', height: ''}
];

@Component({
  selector: 'ks-test-size',
  template: `
    <div ksSize [sizeConfig]="{width: '100px', height: '80px'}"></div>
    <div ksSize [sizeConfig]="{width: '50px', height: '20px'}"></div>
    <div ksSize [sizeConfig]="{width: '50%', height: '100%'}"></div>
    <div ksSize [sizeConfig]="{width: 'auto', height: 'auto'}"></div>
    <div ksSize [sizeConfig]="{width: 'auto', height: '20px'}"></div>
    <div ksSize [sizeConfig]="{width: '50px', height: 'auto'}"></div>
    <div ksSize [sizeConfig]="{width: '', height: ''}"></div>
    <div ksSize [sizeConfig]="null"></div>
  `
})
class TestSizeComponent {}

let fixture: ComponentFixture<TestSizeComponent>;
let comp: TestSizeComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

describe('SizeDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestSizeComponent, SizeDirective]
    }); // not necessary with webpack .compileComponents();
    fixture = TestBed.createComponent(TestSizeComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      bareElement = fixture.debugElement.query(By.css('div:not(ksSize)'));
      des = fixture.debugElement.queryAll(By.directive(SizeDirective));
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have this directive', () => {
      expect(des.length).toBe(expected.length);
    });

    expected.forEach((val: Size, index: number) => {
      it(`should check expected results for <div> at position ${index}`, () => {
        expect(des[index].nativeElement.style.width).toBe(val.width);
        expect(des[index].nativeElement.style.height).toBe(val.height);
      });
    });

    it('should check expected results for bare <div> without this directive', () => {
      expect(bareElement.properties.ksSize).toBeUndefined();
    });
  });
});
