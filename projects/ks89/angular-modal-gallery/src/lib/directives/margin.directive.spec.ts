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
import { MarginDirective } from './margin.directive';

interface Margin {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}

const expected: Margin[] = [
  { left: '2px', right: '2px' },
  { left: '4px', right: '0px' },
  { left: '4px', right: '0px' },
  { left: '', right: '' },
  { left: '-2px', right: '-3px' },
  { top: '2px', bottom: '2px' },
  { top: '', bottom: '' },
  { top: '0px', bottom: '2px' },
  { top: '0px', bottom: '-7px' },
  { left: '2px', right: '2px', top: '0px', bottom: '2px' },
  // @ts-ignore
  { left: undefined, right: null, top: undefined, bottom: null },
  {}
];

@Component({
  selector: 'ks-test-margin',
  template: `
      <div ksMargin [marginLeft]="'2px'" [marginRight]="'2px'"></div>
      <div ksMargin [marginLeft]="'4px'" [marginRight]="'0px'"></div>
      <div ksMargin [marginLeft]="'4px'" [marginRight]="'0'"></div>
      <div ksMargin [marginLeft]="''" [marginRight]="''"></div>
      <div ksMargin [marginLeft]="'-2px'" [marginRight]="'-3px'"></div>
      <div ksMargin [marginTop]="'2px'" [marginBottom]="'2px'"></div>
      <div ksMargin [marginTop]="''" [marginBottom]="''"></div>
      <div ksMargin [marginTop]="'0px'" [marginBottom]="'2px'"></div>
      <div ksMargin [marginTop]="'0'" [marginBottom]="'-7px'"></div>
      <div ksMargin [marginLeft]="'2px'" [marginRight]="'2px'" [marginTop]="'0px'" [marginBottom]="'2px'"></div>
      <div ksMargin [marginLeft]="undefined" [marginRight]="null" [marginTop]="undefined" [marginBottom]="null"></div>
      <div ksMargin></div>
    `
})
class TestMarginComponent {}

let fixture: ComponentFixture<TestMarginComponent>;
let comp: TestMarginComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

describe('MarginDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestMarginComponent, MarginDirective]
    }); // not necessary with webpack .compileComponents();
    fixture = TestBed.createComponent(TestMarginComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      bareElement = fixture.debugElement.query(By.css('div:not(ksMargin)'));
      des = fixture.debugElement.queryAll(By.directive(MarginDirective));
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have this directive', () => {
      expect(des.length).toBe(expected.length);
    });

    expected.forEach((val: Margin, index: number) => {
      it(`should check expected results for <div> at position ${index}`, () => {
        if (val.left) {
          expect(des[index].nativeElement.style.marginLeft).toBe(val.left);
        }
        if (val.right) {
          expect(des[index].nativeElement.style.marginRight).toBe(val.right);
        }
        if (val.top) {
          expect(des[index].nativeElement.style.marginTop).toBe(val.top);
        }
        if (val.bottom) {
          expect(des[index].nativeElement.style.marginBottom).toBe(val.bottom);
        }
      });
    });

    it('should check expected results for bare <div> without this directive', () => {
      expect(bareElement.properties.ksMargin).toBeUndefined();
    });
  });
});
