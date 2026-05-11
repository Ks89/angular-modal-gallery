/*
 The MIT License (MIT)

 Copyright (c) 2017-2026 Stefano Cappa (Ks89)

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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SwipeDirective } from './swipe.directive';

@Component({
  template: `
    <div
      ksSwipe
      (swipeLeft)="onSwipeLeft()"
      (swipeRight)="onSwipeRight()"
      (swipeUp)="onSwipeUp()"
      (swipeDown)="onSwipeDown()">
    </div>
  `,
  imports: [SwipeDirective]
})
class TestHostComponent {
  left = 0;
  right = 0;
  up = 0;
  down = 0;

  onSwipeLeft(): void {
    this.left++;
  }

  onSwipeRight(): void {
    this.right++;
  }

  onSwipeUp(): void {
    this.up++;
  }

  onSwipeDown(): void {
    this.down++;
  }
}

describe('SwipeDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    element = fixture.debugElement.query(By.directive(SwipeDirective)).nativeElement;
  });

  function touchEvent(type: string, x: number, y: number, timeStamp: number): TouchEvent {
    const touch = new Touch({
      identifier: 1,
      target: element,
      pageX: x,
      pageY: y
    });

    const event = new TouchEvent(type, {
      touches: type === 'touchstart' ? [touch] : [],
      changedTouches: [touch],
      bubbles: true,
      cancelable: true
    });

    spyOnProperty(event, 'timeStamp').and.returnValue(timeStamp);
    return event;
  }

  function swipe(fromX: number, fromY: number, toX: number, toY: number, duration = 100): void {
    element.dispatchEvent(touchEvent('touchstart', fromX, fromY, 0));
    element.dispatchEvent(touchEvent('touchend', toX, toY, duration));
    fixture.detectChanges();
  }

  it('should emit swipeLeft', () => {
    swipe(100, 0, 20, 0);

    expect(fixture.componentInstance.left).toBe(1);
  });

  it('should emit swipeRight', () => {
    swipe(20, 0, 100, 0);

    expect(fixture.componentInstance.right).toBe(1);
  });

  it('should emit swipeUp', () => {
    swipe(0, 100, 0, 20);

    expect(fixture.componentInstance.up).toBe(1);
  });

  it('should emit swipeDown', () => {
    swipe(0, 20, 0, 100);

    expect(fixture.componentInstance.down).toBe(1);
  });

  it('should not emit when movement is below threshold', () => {
    swipe(0, 0, 40, 40);

    expect(fixture.componentInstance.left).toBe(0);
    expect(fixture.componentInstance.right).toBe(0);
    expect(fixture.componentInstance.up).toBe(0);
    expect(fixture.componentInstance.down).toBe(0);
  });

  it('should not emit when swipe is too slow', () => {
    swipe(100, 0, 20, 0, 500);

    expect(fixture.componentInstance.left).toBe(0);
  });
});
