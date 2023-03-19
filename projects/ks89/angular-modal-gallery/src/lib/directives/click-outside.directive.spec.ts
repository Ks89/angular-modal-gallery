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
import { ClickOutsideDirective } from './click-outside.directive';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'ks-test-click-outside',
  template: `
    <div id="modal-gallery-wrapper"
         ksClickOutside [clickOutsideEnable]="true"
         (clickOutside)="onClickOutside($event)">

      <div class="ng-overlay"></div>

      <div id="flex-min-height-ie-fix">
        <div id="modal-gallery-container">

          <img id="current-image-test" class="inside current-image-next" [src]="'path'"/>

          <div id="hidden-div-test" class="div-class hidden"></div>

        </div>
      </div>
    </div>
  `
})
class TestClickOutsideComponent {
  @Output() clicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  onClickOutside(event: boolean): void {
    this.clicked.emit(event);
  }
}

let fixture: ComponentFixture<TestClickOutsideComponent>;
let comp: TestClickOutsideComponent;
let des: DebugElement[] = [];
let directive: ClickOutsideDirective;

describe('ClickOutsideDirective', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TestClickOutsideComponent, ClickOutsideDirective]
    }); // not necessary with webpack .compileComponents();

    fixture = TestBed.createComponent(TestClickOutsideComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      des = fixture.debugElement.queryAll(By.directive(ClickOutsideDirective));
      directive = des[0].injector.get(ClickOutsideDirective) as ClickOutsideDirective;
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  it('should have click-outside directive', () => {
    expect(des.length).toBe(1);
  });

  describe('---click outside---', () => {
    beforeEach(() => fixture.detectChanges());

    it(`should check for ksClickOutside`, () => {
      const clickOutsideDirective: DebugElement = fixture.debugElement.query(By.directive(ClickOutsideDirective));
      expect(clickOutsideDirective.name).toBe('div');
      expect(clickOutsideDirective.attributes.id).toBe('modal-gallery-wrapper');
      expect(clickOutsideDirective.attributes.ksClickOutside).toBe('');
    });

    it(`should close the modal gallery after a click`, () => {
      directive.clickOutsideEnable = true;
      fixture.detectChanges();
      const overlay: DebugElement = fixture.debugElement.query(By.css('div#modal-gallery-wrapper'));
      comp.clicked.subscribe((res: boolean) => {
        expect(res).toBe(true);
      });
      // in this scenario I'm using the native click
      overlay.nativeElement.click();
    });

    it(`shouldn't close the modal gallery after a click, because close-outside directive is disabled`, () => {
      directive.clickOutsideEnable = false;
      fixture.detectChanges();
      const overlay: DebugElement = fixture.debugElement.query(By.css('div#modal-gallery-wrapper'));
      comp.clicked.subscribe(() => {
        fail('if clickOutsideEnable = false there will be no clicked events');
      });
      overlay.nativeElement.click();
    });

    it(`shouldn't close the modal gallery after a click over the current-image, because it isn't 'inside'`, () => {
      directive.clickOutsideEnable = true;
      fixture.detectChanges();
      const image: DebugElement = fixture.debugElement.query(By.css('img#current-image-test'));
      comp.clicked.subscribe((res: boolean) => {
        fail(`if it's 'not inside' (variable isInside = false) there will be no clicked events`);
      });
      image.nativeElement.click();
    });

    it(`should close the modal gallery after a click over an 'hidden' div`, () => {
      directive.clickOutsideEnable = true;
      fixture.detectChanges();
      const image: DebugElement = fixture.debugElement.query(By.css('div#hidden-div-test'));
      comp.clicked.subscribe((res: boolean) => {
        expect(res).toBe(true);
      });
      image.nativeElement.click();
    });
  });
});
