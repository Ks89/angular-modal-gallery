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

import { Component, DebugElement, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, SafeResourceUrl } from '@angular/platform-browser';
import { FallbackImageDirective } from './fallback-image.directive';

@Component({
  selector: 'ks-test-fallback-image',
  template: `
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="imgPath" (fallbackApplied)="onError(true)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="base64" (fallbackApplied)="onError(true)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="''" (fallbackApplied)="onError(true)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="base64" (fallbackApplied)="onError(true)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="''" (fallbackApplied)="onError(true)">
  `
})
class TestFallbackImageComponent {
  base64: SafeResourceUrl = 'data:image/png;base64,iVBORw0KG=';
  imgPath = 'http:/example.com/bad-url.jpg';

  @Output()
  fallbackApplied: EventEmitter<boolean> = new EventEmitter<boolean>();

  onError(data: boolean): void {
    this.fallbackApplied.emit(data);
  }
}

@Component({
  selector: 'ks-test-fallback-image-wrong',
  template: `
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="null" (fallbackApplied)="onError(false)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="undefined" (fallbackApplied)="onError(false)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="undefined" (fallbackApplied)="onError(false)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="null" (fallbackApplied)="onError(false)">
    <img src="wrong-img-path.jpg" ksFallbackImage [fallbackImg]="undefined" (fallbackApplied)="onError(false)">
  `
})
class WrongTestFallbackImageComponent {
  @Output()
  fallbackApplied: EventEmitter<boolean> = new EventEmitter<boolean>();

  onError(data: boolean): void {
    this.fallbackApplied.emit(data);
  }
}

let fixture: ComponentFixture<TestFallbackImageComponent>;
let comp: TestFallbackImageComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

let fixtureWrong: ComponentFixture<WrongTestFallbackImageComponent>;
let compWrong: WrongTestFallbackImageComponent;
let desWrong: DebugElement[] = [];
let bareElementWrong: DebugElement;

describe('FallbackImageDirective', () => {

  describe('---OK---', () => {

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [TestFallbackImageComponent, FallbackImageDirective]
      }); // not necessary with webpack .compileComponents();
      fixture = TestBed.createComponent(TestFallbackImageComponent);
      comp = fixture.componentInstance;

      fixture.detectChanges();
      return fixture.whenStable().then(() => {
        fixture.detectChanges();
        bareElement = fixture.debugElement.query(By.css('img:not(ksFallbackImage)'));
        des = fixture.debugElement.queryAll(By.directive(FallbackImageDirective));
      });
    });

    it('can instantiate it', () => expect(comp).not.toBeNull());

    it('should have this directive', () => {
      expect(des.length).toBe(5);
    });

    it(`should return true, because fallbackImg is valid`, () => {
      comp.fallbackApplied.subscribe((result: boolean) => {
        expect(result).toBeTrue();
      });
    });

    it('should check expected results for bare <img> without this directive', () => {
      expect(bareElement.properties.ksFallbackImage).toBeUndefined();
    });
  });

  describe('---NO---', () => {

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [WrongTestFallbackImageComponent, FallbackImageDirective]
      }); // not necessary with webpack .compileComponents();
      fixtureWrong = TestBed.createComponent(WrongTestFallbackImageComponent);
      compWrong = fixtureWrong.componentInstance;

      fixtureWrong.detectChanges();
      return fixtureWrong.whenStable().then(() => {
        fixtureWrong.detectChanges();
        bareElementWrong = fixtureWrong.debugElement.query(By.css('img:not(ksFallbackImage)'));
        desWrong = fixtureWrong.debugElement.queryAll(By.directive(FallbackImageDirective));
      });
    });

    it('can instantiate it', () => expect(compWrong).not.toBeNull());

    it('should have this directive', () => {
      expect(desWrong.length).toBe(5);
    });

    it(`should return false, because fallbackImg is not valid`, () => {
      compWrong.fallbackApplied.subscribe((result: boolean) => {
        expect(result).toBeFalse();
      });
    });

    it('should check expected results for bare <img> without this directive', () => {
      expect(bareElementWrong.properties.ksFallbackImage).toBeUndefined();
    });
  });
});
