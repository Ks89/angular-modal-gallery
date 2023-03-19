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
import { WrapDirective } from './wrap.directive';

interface TestModel {
  width: string;
  wrap: boolean | undefined;
  wrapStyle: string;
}

@Component({
  selector: 'ks-test-wrap',
  template: `
    <div ksWrap [wrap]="true" [width]="'100px'"></div>
    <div ksWrap [wrap]="false" [width]="'100px'"></div>
    <div ksWrap [wrap]="undefined" [width]="'100px'"></div>
  `
})
class TestWrapComponent {}

let fixture: ComponentFixture<TestWrapComponent>;
let comp: TestWrapComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

const expected: TestModel[] = [
  {width: '100px', wrap: true, wrapStyle: 'wrap'},
  {width: '', wrap: false, wrapStyle: ''},
  {width: '', wrap: undefined, wrapStyle: ''},
];

describe('WrapDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestWrapComponent, WrapDirective]
    }); // not necessary with webpack .compileComponents();
    fixture = TestBed.createComponent(TestWrapComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      bareElement = fixture.debugElement.query(By.css('div:not(ksWrap)'));
      des = fixture.debugElement.queryAll(By.directive(WrapDirective));
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have this directive', () => {
      expect(des.length).toBe(3);
    });

    expected.forEach((val: TestModel, index: number) => {
      it(`should check expected results for <div> at position ${index}`, () => {
        expect(des[index].nativeElement.style.width).toBe(val.width);
        expect(des[index].nativeElement.style['flex-wrap']).toBe(val.wrapStyle);
      });
    });

    it('should check expected results for bare <div> without this directive', () => {
      expect(bareElement.properties.ksWrap).toBeUndefined();
    });
  });
});
