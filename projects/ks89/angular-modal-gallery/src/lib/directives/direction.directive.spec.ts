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
import { DirectionDirective } from './direction.directive';

interface TestModel {
  direction: string;
  justify: string;
}

const expected: TestModel[] = [
  // direction can be: row | row-reverse | column | column-reverse
  // justify can be: flex-start | flex-end | center | space-between | space-around | space-evenly
  {direction: 'row', justify: 'flex-start'},
  {direction: 'row-reverse', justify: 'flex-end'},
  {direction: 'column', justify: 'center'},
  {direction: 'column-reverse', justify: 'space-between'},
  {direction: 'row', justify: 'space-around'},
  {direction: 'row', justify: 'space-evenly'},
  {direction: '', justify: ''}, // with '' and '' the expected result is '' and ''
  {direction: '', justify: ''}, // with '' and 'center' the expected result is '' and ''
  {direction: '', justify: ''} // with 'row' and '' the expected result is '' and ''
];

@Component({
  selector: 'ks-test-direction',
  template: `
    <div ksDirection [direction]="'row'" [justify]="'flex-start'"></div>
    <div ksDirection [direction]="'row-reverse'" [justify]="'flex-end'"></div>
    <div ksDirection [direction]="'column'" [justify]="'center'"></div>
    <div ksDirection [direction]="'column-reverse'" [justify]="'space-between'"></div>
    <div ksDirection [direction]="'row'" [justify]="'space-around'"></div>
    <div ksDirection [direction]="'row'" [justify]="'space-evenly'"></div>
    <div ksDirection [direction]="''" [justify]="''"></div>
    <div ksDirection [direction]="''" [justify]="'center'"></div>
    <div ksDirection [direction]="'row'" [justify]="''"></div>
  `
})
class TestDirectionComponent {}

let fixture: ComponentFixture<TestDirectionComponent>;
let comp: TestDirectionComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

describe('DirectionDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestDirectionComponent, DirectionDirective]
    }); // not necessary with webpack .compileComponents();
    fixture = TestBed.createComponent(TestDirectionComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      bareElement = fixture.debugElement.query(By.css('div:not(ksDirection)'));
      des = fixture.debugElement.queryAll(By.directive(DirectionDirective));
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have this directive', () => {
      expect(des.length).toBe(expected.length);
    });

    expected.forEach((val: TestModel, index: number) => {
      it(`should check expected results for <div> at position ${index}`, () => {
        expect(des[index].nativeElement.style['flex-direction']).toBe(val.direction);
        expect(des[index].nativeElement.style['justify-content']).toBe(val.justify);
      });
    });

    it('should check expected results for bare <div> without this directive', () => {
      expect(bareElement.properties.ksDirection).toBeUndefined();
    });
  });
});
