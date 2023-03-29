/*
 * Copyright (c) 2017-2023 Stefano Cappa (Ks89)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibleComponent } from './accessible.component';
import {
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  ENTER_CODE,
  ENTER_KEY,
  MOUSE_MAIN_BUTTON_CLICK,
  NEXT,
  NOTHING,
  PREV,
  SPACE_CODE,
  SPACE_KEY
} from '../utils/user-input.util';

let comp: AccessibleComponent;
let fixture: ComponentFixture<AccessibleComponent>;

function initTestBed(): void {
  TestBed.configureTestingModule({
    declarations: [AccessibleComponent]
  });
}

describe('AccessibleComponent', () => {
  beforeEach(() => {
    initTestBed();
    fixture = TestBed.createComponent(AccessibleComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---Keyboard navigation---', () => {
    it('should handle navigation event with direction right and space key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: SPACE_CODE,
        key: SPACE_KEY
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_RIGHT, keyboardEvent);
      expect(result).toBe(NEXT);
    });
    it('should handle navigation event with direction right and enter key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: ENTER_CODE,
        key: ENTER_KEY
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_RIGHT, keyboardEvent);
      expect(result).toBe(NEXT);
    });

    it('should handle navigation event with direction left and space key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: SPACE_CODE,
        key: SPACE_KEY
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_LEFT, keyboardEvent);
      expect(result).toBe(PREV);
    });
    it('should handle navigation event with direction left and enter key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: ENTER_CODE,
        key: ENTER_KEY
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_LEFT, keyboardEvent);
      expect(result).toBe(PREV);
    });

    it('should handle navigation event with direction right and an invalid key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: '', // invalid code and key
        key: ''
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_RIGHT, keyboardEvent);
      expect(result).toBe(NOTHING);
    });

    it('should handle navigation event with direction left and an invalid key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: '', // invalid code and key
        key: ''
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_LEFT, keyboardEvent);
      expect(result).toBe(NOTHING);
    });

    // it('should handle navigation event without event', () => {
    //   const result: number = comp.handleNavigationEvent(DIRECTION_LEFT, undefined);
    //   expect(result).toBe(NOTHING);
    // });
  });

  describe('---Mouse navigation---', () => {
    it('should handle navigation event with direction right and space key', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click', {
        button: MOUSE_MAIN_BUTTON_CLICK
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_RIGHT, mouseEvent);
      expect(result).toBe(NEXT);
    });

    it('should handle navigation event with direction left and space key', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click', {
        button: MOUSE_MAIN_BUTTON_CLICK
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_LEFT, mouseEvent);
      expect(result).toBe(PREV);
    });

    it('should handle navigation event with direction right and an invalid key', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click', {
        button: -2 // invalid button
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_RIGHT, mouseEvent);
      expect(result).toBe(NOTHING);
    });
    it('should handle navigation event with direction LEFT and an invalid key', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click', {
        button: -2 // invalid button
      });
      const result: number = comp.handleNavigationEvent(DIRECTION_LEFT, mouseEvent);
      expect(result).toBe(NOTHING);
    });
  });

  // describe('---Unknown navigation---', () => {
  //   it(`should handle navigation event, but since it's not permitted, the result should be NOTHING`, () => {
  //     const unrecognizedEvent: FocusEvent = new FocusEvent('click', {
  //       relatedTarget: null
  //     });
  //     const result: number = comp.handleNavigationEvent(DIRECTION_LEFT, unrecognizedEvent);
  //     expect(result).toBe(NOTHING);
  //   });
  // });

  describe('---Keyboard image event---', () => {
    it('should handle keyboard image event with space key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: SPACE_CODE,
        key: SPACE_KEY
      });
      const result: number = comp.handleImageEvent(keyboardEvent);
      expect(result).toBe(NEXT);
    });
    it('should handle keyboard image event with enter key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: ENTER_CODE,
        key: ENTER_KEY
      });
      const result: number = comp.handleImageEvent(keyboardEvent);
      expect(result).toBe(NEXT);
    });
    it('should handle keyboard image event with an invalid key', () => {
      const keyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: '', // invalid code and key
        key: ''
      });
      const result: number = comp.handleImageEvent(keyboardEvent);
      expect(result).toBe(NOTHING);
    });
  });

  describe('---Mouse image event---', () => {
    it('should handle mouse image event with space key', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click', {
        button: MOUSE_MAIN_BUTTON_CLICK
      });
      const result: number = comp.handleImageEvent(mouseEvent);
      expect(result).toBe(NEXT);
    });
    it('should handle mouse image event with enter key', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click', {
        button: MOUSE_MAIN_BUTTON_CLICK
      });
      const result: number = comp.handleImageEvent(mouseEvent);
      expect(result).toBe(NEXT);
    });
    it('should handle mouse image event with an invalid key', () => {
      const mouseEvent: MouseEvent = new MouseEvent('click', {
        button: -2 // invalid button
      });
      const result: number = comp.handleImageEvent(mouseEvent);
      expect(result).toBe(NOTHING);
    });
  });

  describe('---Unknown image event---', () => {
    it(`should handle image event, but since it's not permitted, the result should be NOTHING`, () => {
      // tslint:disable-next-line:no-any
      const unrecognizedEvent: any = new FocusEvent('click', {
        relatedTarget: null
      });
      const result: number = comp.handleImageEvent(unrecognizedEvent);
      expect(result).toBe(NOTHING);
    });
  });

  // describe('---Undefined image event---', () => {
  //   it(`should handle image event, but since it's undefined, the result should be NOTHING`, () => {
  //     const result: number = comp.handleImageEvent(undefined);
  //     expect(result).toBe(NOTHING);
  //   });
  // });
});
