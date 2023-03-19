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

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DIRECTION_RIGHT, MOUSE_MAIN_BUTTON_CLICK, NEXT, NOTHING, PREV, ENTER_CODE, SPACE_CODE } from '../utils/user-input.util';

/**
 * Provides some useful methods to add accessibility features to subclasses.
 * In particular, it exposes a method to handle navigation event with both Keyboard and Mouse
 * and another with also the direction (right or left).
 */
@Component({
  selector: 'ks-accessible',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibleComponent {
  constructor() {}

  /**
   * Method to handle navigation events with both Keyboard and Mouse.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param KeyboardEvent | MouseEvent event payload
   * @returns number -1 for PREV, 1 for NEXT and 0 for NOTHING
   */
  handleNavigationEvent(direction: string, event: KeyboardEvent | MouseEvent): number {
    if (!event) {
      return NOTHING;
    }
    if (event instanceof KeyboardEvent) {
      return this.handleKeyboardNavigationEvent(direction, event);
    } else if (event instanceof MouseEvent) {
      return this.handleMouseNavigationEvent(direction, event);
    }
    return NOTHING;
  }

  /**
   * Method to handle events over an image, for instance a keypress with the Keyboard or a Mouse click.
   * @param event KeyboardEvent | MouseEvent payload
   * @returns number 1 for NEXT and 0 for NOTHING
   */
  handleImageEvent(event: KeyboardEvent | MouseEvent): number {
    if (!event) {
      return NOTHING;
    }
    if (event instanceof KeyboardEvent) {
      return this.handleImageKeyboardEvent(event);
    } else if (event instanceof MouseEvent) {
      return this.handleImageMouseEvent(event);
    }
    return NOTHING;
  }

  /**
   * Private method to handle keyboard events over an image.
   * @param event KeyboardEvent payload
   * @returns number 1 for NEXT and 0 for NOTHING
   */
  private handleImageKeyboardEvent(event: KeyboardEvent): number {
    const key: string = event.code;
    if (key === SPACE_CODE || key === ENTER_CODE) {
      return NEXT;
    }
    return NOTHING;
  }

  /**
   * Private method to handle mouse events over an image.
   * @param MouseEvent event payload
   * @returns number 1 for NEXT and 0 for NOTHING
   */
  private handleImageMouseEvent(event: MouseEvent): number {
    const mouseBtn: number = event.button;
    if (mouseBtn === MOUSE_MAIN_BUTTON_CLICK) {
      return NEXT;
    }
    return NOTHING;
  }

  /**
   * Method to handle events over an image, for instance a keypress with the Keyboard or a Mouse click.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param KeyboardEvent event payload
   * @returns number -1 for PREV, 1 for NEXT and 0 for NOTHING
   */
  private handleKeyboardNavigationEvent(direction: string, event: KeyboardEvent): number {
    const key: string = event.code;
    if (key === SPACE_CODE || key === ENTER_CODE) {
      return direction === DIRECTION_RIGHT ? NEXT : PREV;
    }
    return NOTHING;
  }

  /**
   * Method to handle events over an image, for instance a keypress with the Keyboard or a Mouse click.
   * @param string direction of the navigation that can be either 'next' or 'prev'
   * @param MouseEvent event payload
   * @returns number -1 for PREV, 1 for NEXT and 0 for NOTHING
   */
  private handleMouseNavigationEvent(direction: string, event: MouseEvent): number {
    const mouseBtn: number = event.button;
    if (mouseBtn === MOUSE_MAIN_BUTTON_CLICK) {
      return direction === DIRECTION_RIGHT ? NEXT : PREV;
    }
    return NOTHING;
  }
}
