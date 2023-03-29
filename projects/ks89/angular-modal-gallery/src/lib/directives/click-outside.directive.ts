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

import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Directive to close the modal gallery clicking on the semi-transparent background.
 * In fact, it listens for a click on all elements that aren't 'inside' and it emits
 * an event using `@Output clickOutside`.
 */
@Directive({
  selector: '[ksClickOutside]'
})
export class ClickOutsideDirective {
  /**
   * Boolean to enable this directive.
   */
  @Input()
  clickOutsideEnable: boolean | undefined;
  /**
   * Output to emit an event if the clicked element class doesn't contain 'inside' or it is 'hidden'. The payload is a boolean.
   */
  @Output()
  clickOutside: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Method called by Angular itself every click thanks to `@HostListener`.
   * @param event MouseEvent
   */
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();

    // tslint:disable-next-line:no-any
    const target: any = event.target;

    if (!this.clickOutsideEnable || !target) {
      return;
    }

    let isInside = false;
    let isHidden = false;

    if (typeof target.className !== 'string') {
      // it happens with @fortawesome/fontawesome 5
      // for some reasons className is an object with 2 empty properties inside
      isInside = true;
    } else {
      // in normal scenarios, use classname, because it's a simple string
      isInside = target.className && target.className.includes('inside');
      isHidden = target.className.includes('hidden');
    }

    // if inside => don't close modal gallery
    // if hidden => close modal gallery
    /*
        i i' h | close
        0 1  0 |   1 => close modal gallery
        0 1  1 |   1 => close modal gallery
        1 0  0 |   0
        1 0  1 |   1 => close modal gallery
     */
    if (!isInside || isHidden) {
      // close modal gallery
      this.clickOutside.emit(true);
    }
  }
}
