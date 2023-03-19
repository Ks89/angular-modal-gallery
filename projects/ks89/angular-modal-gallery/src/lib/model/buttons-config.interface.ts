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

import { Action } from './action.enum';
import { InternalLibImage } from './image-internal.class';
import { Size } from './size.interface';

/**
 * Interface `ButtonsConfig` to add buttons, show/hide their, and to add the strategy.
 */
export interface ButtonsConfig {
  visible: boolean;
  strategy: ButtonsStrategy;
  buttons?: ButtonConfig[];
}

/**
 * Interface `ButtonConfig` to configure a single button.
 */
export interface ButtonConfig {
  className?: string;
  size?: Size;
  fontSize?: string;
  type: ButtonType;
  title?: string;
  ariaLabel?: string;
  extUrlInNewTab?: boolean; // to open the external url in a new tab, instead of the current one
}

/**
 * Interface `ButtonEvent` to represent the event payload when a button is clicked.
 */
export interface ButtonEvent {
  button: ButtonConfig;
  image: InternalLibImage | null;
  action: Action;
  galleryId: number;
}

/**
 * Enum `ButtonsStrategy` to configure the logic of a button.
 */
export enum ButtonsStrategy {
  // don't use 0 here
  // the first index is 1 and all of the following members are auto-incremented from that point on
  DEFAULT = 1,
  SIMPLE,
  ADVANCED,
  FULL,
  CUSTOM
}

/**
 * Enum `ButtonType` is the type of a button.
 */
export enum ButtonType {
  // don't use 0 here
  // the first index is 1 and all of the following members are auto-incremented from that point on
  DELETE = 1,
  EXTURL,
  DOWNLOAD,
  CLOSE,
  CUSTOM,
  FULLSCREEN
}

/**
 * Array of admitted types of buttons.
 */
export const WHITELIST_BUTTON_TYPES: ButtonType[] = [
  ButtonType.FULLSCREEN,
  ButtonType.DELETE,
  ButtonType.EXTURL,
  ButtonType.DOWNLOAD,
  ButtonType.CLOSE,
  ButtonType.CUSTOM
];
