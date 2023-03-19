// /*
//  The MIT License (MIT)
//
//  Copyright (C) 2017-2023 Stefano Cappa (Ks89)
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
//  */
//
// import { Component, DebugElement, EventEmitter, Output } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
//
// import { KeyboardNavigationDirective } from './keyboard-navigation.directive';
//
// @Component({
//   selector: 'ks-test-keyboard-navigation',
//   template: `
//     <main ksKeyboardNavigation [isOpen]="true" (keyPress)="onKeyPress($event)"></main>
//   `
// })
// class TestKeyboardNavigationComponent {
//   @Output() keyPress: EventEmitter<number> = new EventEmitter<number>();
//
//   onKeyPress(event: number) {
//     console.log('keyPress in comp');
//     this.keyPress.emit(event);
//   }
// }
//
// let fixture: ComponentFixture<TestKeyboardNavigationComponent>;
// let comp: TestKeyboardNavigationComponent;
// let des: DebugElement[] = [];
// let directive: KeyboardNavigationDirective;
//
// describe('KeyboardNavigationDirective', () => {
//   beforeEach(() => {
//     TestBed.resetTestingModule();
//     TestBed.configureTestingModule({
//       declarations: [TestKeyboardNavigationComponent, KeyboardNavigationDirective]
//     }); // not necessary with webpack .compileComponents();
//
//     fixture = TestBed.createComponent(TestKeyboardNavigationComponent);
//     comp = fixture.componentInstance;
//
//     fixture.detectChanges();
//     return fixture.whenStable().then(() => {
//       fixture.detectChanges();
//       des = fixture.debugElement.queryAll(By.directive(KeyboardNavigationDirective));
//       directive = <KeyboardNavigationDirective>des[0].injector.get(KeyboardNavigationDirective);
//     });
//   });
//
//   it('can instantiate it', () => expect(comp).not.toBeNull());
//
//   it('should have this directive', () => {
//     expect(des.length).toBe(1);
//   });
//
//   describe('---tests---', () => {
//     beforeEach(() => fixture.detectChanges());
//
//     it(`should check for this directive`, () => {
//       const clickOutsideDirective: DebugElement = fixture.debugElement.query(By.directive(KeyboardNavigationDirective));
//       expect(clickOutsideDirective.name).toBe('main');
//       expect(clickOutsideDirective.attributes['ksKeyboardNavigation']).toBe('');
//     });
//
//     it(`should close the modal gallery after a click`, () => {
//       directive.isOpen = true;
//       fixture.detectChanges();
//       // const mainElement: DebugElement = fixture.debugElement.query(By.css('main'));
//       comp.keyPress.subscribe((res: number) => {
//         // console.log('keypress ', res);
//         expect(res).toBe(27);
//       });
//       const keydownEvent = new KeyboardEvent('keydown', {
//         code: 'Escape',
//         key: 'Escape',
//         altKey: false,
//         ctrlKey: false,
//         shiftKey: false,
//         metaKey: false
//       });
//       window.dispatchEvent(keydownEvent);
//
//       // fixture.detectChanges();
//     });
//
//     // it(`shouldn't close the modal gallery after a click, because close-outside directive is disabled`, () => {
//     //   directive.clickOutsideEnable = false;
//     //   fixture.detectChanges();
//     //   const overlay: DebugElement = fixture.debugElement.query(By.css('div#modal-gallery-wrapper'));
//     //   comp.clicked.subscribe(() => {
//     //     fail('if clickOutsideEnable = false there will be no clicked events');
//     //   });
//     //   overlay.nativeElement.click();
//     // });
//     //
//     // it(`shouldn't close the modal gallery after a click over the current-image, because it isn't 'inside'`, () => {
//     //   directive.clickOutsideEnable = true;
//     //   fixture.detectChanges();
//     //   const image: DebugElement = fixture.debugElement.query(By.css('img#current-image-test'));
//     //   comp.clicked.subscribe((res: boolean) => {
//     //     fail(`if it's 'not inside' (variable isInside = false) there will be no clicked events`);
//     //   });
//     //   image.nativeElement.click();
//     // });
//     //
//     // it(`should close the modal gallery after a click over an 'hidden' div`, () => {
//     //   directive.clickOutsideEnable = true;
//     //   fixture.detectChanges();
//     //   const image: DebugElement = fixture.debugElement.query(By.css('div#hidden-div-test'));
//     //   comp.clicked.subscribe((res: boolean) => {
//     //     expect(res).toBe(true);
//     //   });
//     //   image.nativeElement.click();
//     // });
//   });
// });
