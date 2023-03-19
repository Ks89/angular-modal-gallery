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
import { By, SafeResourceUrl } from '@angular/platform-browser';
import { ATagBgImageDirective } from './a-tag-bg-image.directive';
import { Image, PlainImage } from '../model/image.class';

interface TestModel {
  image: Image;
  style: string;
}

const base64: SafeResourceUrl = 'data:image/png;base64,iVBORw0KG=';

const expectedModal: TestModel[] = [
  {image: new Image(0, {img: 'path'}), style: '50% 50% / cover'},
  {image: new Image(0, {img: 'path'}), style: ''}
];

const expectedPlain: TestModel[] = [
  {image: new Image(1, {img: 'path'}, {img: 'plainPath'}), style: '50% 50% / cover'},
  {image: new Image(1, {img: 'path'}, {img: 'plainPath'}), style: ''}
];

const expectedModalBase64: TestModel[] = [
  {image: new Image(0, {img: base64 as SafeResourceUrl}), style: '50% 50% / cover'},
  {image: new Image(0, {img: base64 as SafeResourceUrl}), style: ''}
];

const expectedPlainBase64: TestModel[] = [
  {image: new Image(1, {img: base64 as SafeResourceUrl}, {img: base64 as SafeResourceUrl}), style: '50% 50% / cover'},
  {image: new Image(1, {img: base64 as SafeResourceUrl}, {img: base64 as SafeResourceUrl}), style: ''}
];

const expectedWrongPlain: TestModel[] = [
  // @ts-ignore
  {image: new Image(2, {img: 'path'}, {img: null}), style: '50% 50% / cover'},
  // @ts-ignore
  {image: new Image(3, {img: 'path'}, {img: undefined}), style: '50% 50% / cover'}
];

const expectedWithNoImages: TestModel[] = [
  // @ts-ignore
  {image: null, style: '50% 50% / cover'},
  // @ts-ignore
  {image: null, style: ''},
  // @ts-ignore
  {image: undefined, style: '50% 50% / cover'},
  // @ts-ignore
  {image: undefined, style: ''}
];

const expectedPlainWithFallback: TestModel[] = [
  {image: new Image(1, {img: 'path'}, {img: 'plainPath', fallbackImg: 'fallbackmodal.jpg'}), style: '50% 50% / cover'}
];

const length: number = expectedModal.length + expectedPlain.length + expectedWrongPlain.length +
  expectedWithNoImages.length + expectedModalBase64.length + expectedPlainBase64.length +
  expectedPlainWithFallback.length;

@Component({
  selector: 'ks-test-atagbgimage',
  template: `
    <div ksATagBgImage [image]="images[0]" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="images[0]" [style]="''"></div>
    <div ksATagBgImage [image]="images[1]" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="images[1]" [style]="''"></div>
    <div ksATagBgImage [image]="images[2]" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="images[3]" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="null" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="null" [style]="''"></div>
    <div ksATagBgImage [image]="undefined" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="undefined" [style]="''"></div>

    <div ksATagBgImage [image]="images[4]" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="images[4]" [style]="''"></div>
    <div ksATagBgImage [image]="images[5]" [style]="'50% 50% / cover'"></div>
    <div ksATagBgImage [image]="images[5]" [style]="''"></div>

    <!-- tests with fallback image -->
    <div ksATagBgImage [image]="expectedPlainWithFallback[0]" [style]="''"></div>
  `
})
class TestATagBgImageComponent {
  base64: SafeResourceUrl = 'data:image/png;base64,iVBORw0KG=';

  images: Image[] = [
    new Image(0, {img: 'path'}),
    // @ts-ignore
    new Image(1, {img: 'path'}, {img: 'plainPath'}),
    // @ts-ignore
    new Image(2, {img: 'path'}, {img: null}),
    // @ts-ignore
    new Image(3, {img: 'path'}, {img: undefined}),
    new Image(4, {img: this.base64}),
    new Image(5, {img: this.base64}, {img: this.base64})
  ];

  expectedPlainWithFallback: Image[] = [
    new Image(1, {img: 'path'}, {img: 'plainPath', fallbackImg: 'fallbackmodal.jpg'})
  ];
}

let fixture: ComponentFixture<TestATagBgImageComponent>;
let comp: TestATagBgImageComponent;
let des: DebugElement[] = [];
let bareElement: DebugElement;

describe('ATagBgImageDirective', () => {

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestATagBgImageComponent, ATagBgImageDirective]
    }); // not necessary with webpack .compileComponents();
    fixture = TestBed.createComponent(TestATagBgImageComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      bareElement = fixture.debugElement.query(By.css('div:not(ksATagBgImage)'));
      des = fixture.debugElement.queryAll(By.directive(ATagBgImageDirective));
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---tests---', () => {

    beforeEach(() => fixture.detectChanges());

    it('should have this directive', () => {
      expect(des.length).toBe(length);
    });

    // Different browsers manage this scenario in different ways,
    // for instance, some of them apply default stuff like 'repeat scroll 0% 0%',
    // others prepend 'localhost:port' to the path.
    // So, I decided to use 'toContain', ignoring all other stuff.

    expectedModal.forEach((val: TestModel, index: number) => {
      it(`should check expected results for <main> with an Image (only modal) at position ${index}`, () => {
        // no plain image, only modal
        const path: string | SafeResourceUrl = val.image.modal.img;
        const style: string = val.style;
        expect(des[index].nativeElement.style.background).toContain(`url("${path}")`.trim());
        expect(des[index].nativeElement.style.background).toContain(`${style}`.trim());
      });
    });

    expectedPlain.forEach((val: TestModel, index: number) => {
      it(`should check expected results for <main> with an Image (modal + plain) at position ${index}`, () => {
        // when there are both modal and plain, plain wins
        const path: string | SafeResourceUrl = (val.image.plain as PlainImage).img;
        const style: string = val.style;
        const prevIndex: number = expectedModal.length;
        expect(des[index + prevIndex].nativeElement.style.background).toContain(`url("${path}")`.trim());
        expect(des[index + prevIndex].nativeElement.style.background).toContain(`${style}`.trim());
      });
    });

    it(`should check expected results for <main> with an Image (only modal) as base66`, () => {
      // no plain image, only modal
      // const base64String: string = <string>expectedModalBase64[0].modal.img;
      // const path: SafeResourceUrl = <SafeResourceUrl>base64String;
      // const style: string = expectedModalBase64[0].style;
      expect(des[10].nativeElement.style.background).toContain(`url("${expectedModalBase64[0].image.modal.img as string}")`.trim());
      expect(des[10].nativeElement.style.background).toContain(`${expectedModalBase64[0].style}`.trim());
      expect(des[11].nativeElement.style.background).toContain(`url("${expectedModalBase64[1].image.modal.img as string}")`.trim());
      expect(des[11].nativeElement.style.background).toContain(`${expectedModalBase64[1].style}`.trim());
    });

    it(`should check expected results for <main> with an Image (modal + plain) as base64`, () => {
      // when there are both modal and plain, plain wins
      expect(des[12].nativeElement.style.background).toContain(`url("${(expectedPlainBase64[0].image.plain as PlainImage).img as string}")`.trim());
      expect(des[12].nativeElement.style.background).toContain(`${expectedPlainBase64[0].style}`.trim());
      expect(des[13].nativeElement.style.background).toContain(`url("${(expectedPlainBase64[1].image.plain as PlainImage).img as string}")`.trim());
      expect(des[13].nativeElement.style.background).toContain(`${expectedPlainBase64[1].style}`.trim());
    });

    expectedWrongPlain.forEach((val: TestModel, index: number) => {
      it(`should check expected results for <main> with an Image (modal + plain without img) at position ${index}`, () => {
        // plain malformed without an img, so modal wins
        const base64String: string = (val.image.plain as PlainImage).img as string;
        const path: string | SafeResourceUrl = val.image.modal.img;
        const style: string = val.style;
        const prevIndex: number = +expectedModal.length + expectedPlain.length;
        expect(des[index + prevIndex].nativeElement.style.background).toContain(`url("${path}")`.trim());
        expect(des[index + prevIndex].nativeElement.style.background).toContain(`${style}`.trim());
      });
    });

    expectedWithNoImages.forEach((val: TestModel, index: number) => {
      it(`should check expected results for <main> when input Image is not valid at position ${index}`, () => {
        // no input image
        const style: string = val.style;
        const prevIndex: number = +expectedModal.length + expectedPlain.length + expectedWrongPlain.length;
        expect(des[index + prevIndex].nativeElement.style.background).toBe('');
      });
    });

    expectedPlainWithFallback.forEach((val: TestModel, index: number) => {
      it(`should check expected results for <main> when plain image has a fallback image ${index}`, () => {
        expect(des[index].nativeElement.style.background).toContain(`url("${'path'}")`.trim());
      });
    });

    it('should check expected results for bare <div> without this directive', () => {
      expect(bareElement.properties.ksATagBgImage).toBeUndefined();
    });
  });
});
