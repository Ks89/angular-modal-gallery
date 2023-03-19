/*
 The MIT License (MIT)

 Copyright (C) 2017-2022 Stefano Cappa (Ks89)

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


// Inspired from https://stackblitz.com/edit/angular-swipe-events-with-hostlistner?file=src%2Fapp%2Fapp.component.ts

/**
 * Directive to close the modal gallery clicking on the semi-transparent background.
 * In fact, it listens for a click on all elements that aren't 'inside' and it emits
 * an event using `@Output clickOutside`.
 */
@Directive({
  selector: '[ksSwipe]'
})
export class SwipeDirective {
  defaultTouch = { x: 0, y: 0, time: 0 };

  /**
   */
  @Output()
  swipeLeft: EventEmitter<void> = new EventEmitter<void>();
  /**
   */
  @Output()
  swipeRight: EventEmitter<void> = new EventEmitter<void>();
  /**
   */
  @Output()
  swipeUp: EventEmitter<void> = new EventEmitter<void>();
  /**
   */
  @Output()
  swipeDown: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Method called by Angular itself every click thanks to `@HostListener`.
   * @param event TouchEvent payload received on touch
   */
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event: TouchEvent) {
    let touch = event.touches[0] || event.changedTouches[0];
    // check the events
    if (event.type === 'touchstart') {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = event.timeStamp;
    } else if (event.type === 'touchend') {
      let deltaX = touch.pageX - this.defaultTouch.x;
      let deltaY = touch.pageY - this.defaultTouch.y;
      let deltaTime = event.timeStamp - this.defaultTouch.time;

      // simulate a swipe -> less than 500 ms and more than 60 px
      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 60) {
          // delta x is at least 60 pixels
          if (deltaX > 0) {
            this.swipeRight.emit();
          } else {
            this.swipeLeft.emit();
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            this.swipeDown.emit();
          } else {
            this.swipeUp.emit();
          }
        }
      }
    }
  }

}
