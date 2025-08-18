/*
 The MIT License (MIT)

 Copyright (c) 2017-2025 Stefano Cappa (Ks89)

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
import { By } from '@angular/platform-browser';

import { KeyboardNavigationDirective } from './keyboard-navigation.directive';

@Component({
    selector: 'ks-test-keyboard-navigation',
    template: `
    <main ksKeyboardNavigation [isOpen]="true" (keyboardNavigation)="onKeyPress($event)"></main>
  `
})
class TestKeyboardNavigationComponent {
  @Output() keyPress: EventEmitter<string> = new EventEmitter<string>();

  onKeyPress(event: string) {
    this.keyPress.emit(event);
  }
}

let fixture: ComponentFixture<TestKeyboardNavigationComponent>;
let comp: TestKeyboardNavigationComponent;
let des: DebugElement[] = [];
let directive: KeyboardNavigationDirective;

describe('KeyboardNavigationDirective', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
    imports: [TestKeyboardNavigationComponent, KeyboardNavigationDirective]
}); // not necessary with webpack .compileComponents();

    fixture = TestBed.createComponent(TestKeyboardNavigationComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      des = fixture.debugElement.queryAll(By.directive(KeyboardNavigationDirective));
      directive = <KeyboardNavigationDirective>des[0].injector.get(KeyboardNavigationDirective);
    });
  });

  it('can instantiate it', () => expect(comp).not.toBeNull());

  it('should have this directive', () => {
    expect(des.length).toBe(1);
  });

  describe('---tests---', () => {
    beforeEach(() => fixture.detectChanges());

    it(`should check for this directive`, () => {
      const clickOutsideDirective: DebugElement = fixture.debugElement.query(By.directive(KeyboardNavigationDirective));
      expect(clickOutsideDirective.name).toBe('main');
      expect(clickOutsideDirective.attributes['ksKeyboardNavigation']).toBe('');
    });

    it(`should close the modal gallery after a click`, () => {
      directive.isOpen = true;
      fixture.detectChanges();
      comp.keyPress.subscribe((res: string) => {
        expect(res).toBe('Escape');
      });
      const keydownEvent = new KeyboardEvent('keydown', {
        code: 'Escape',
        key: 'Escape',
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        metaKey: false
      });
      window.dispatchEvent(keydownEvent);
    });

    it(`should navigate to the left when you press left arrow keyboard button`, () => {
      directive.isOpen = true;
      fixture.detectChanges();
      comp.keyPress.subscribe((res: string) => {
        expect(res).toBe('Left');
      });
      const keydownEvent = new KeyboardEvent('keydown', {
        code: 'Left',
        key: 'Left',
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        metaKey: false
      });
      window.dispatchEvent(keydownEvent);
    });

    it(`should navigate to the right when you press right arrow keyboard button`, () => {
      directive.isOpen = true;
      fixture.detectChanges();
      comp.keyPress.subscribe((res: string) => {
        expect(res).toBe('Right');
      });
      const keydownEvent = new KeyboardEvent('keydown', {
        code: 'Right',
        key: 'Right',
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        metaKey: false
      });
      window.dispatchEvent(keydownEvent);
    });

    it(`shouldn't close the modal gallery after a click, because isOpen is false`, () => {
      directive.isOpen = false;
      fixture.detectChanges();
      comp.keyPress.subscribe(() => {
        fail('if isOpen = false there will be no clicked events');
      });
      const keydownEvent = new KeyboardEvent('keydown', {
        code: 'Escape',
        key: 'Escape',
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        metaKey: false
      });
      window.dispatchEvent(keydownEvent);
    });
  });
});
