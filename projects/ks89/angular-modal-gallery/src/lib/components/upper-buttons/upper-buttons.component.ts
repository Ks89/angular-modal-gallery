/*
 The MIT License (MIT)

 Copyright (c) 2017-2023 Stefano Cappa (Ks89)

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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AccessibleComponent } from '../accessible.component';

import { Action } from '../../model/action.enum';
import { Image } from '../../model/image.class';
import { ButtonConfig, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, WHITELIST_BUTTON_TYPES } from '../../model/buttons-config.interface';

import {
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DELETE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_BTN_FULL_SCREEN
} from './upper-buttons-default';

import { NEXT } from '../../utils/user-input.util';
import { ConfigService } from '../../services/config.service';
import { LibConfig } from '../../model/lib-config.interface';

/**
 * Internal representation of `ButtonConfig` with an optional `id` field, used by trackId to improve performances.
 */
export interface InternalButtonConfig extends ButtonConfig {
  id?: number; // useful only for trackById, not needed by users
}

/**
 * Component with all upper buttons.
 * Also it emits click events as outputs.
 */
@Component({
  selector: 'ks-upper-buttons',
  styleUrls: ['upper-buttons.scss'],
  templateUrl: 'upper-buttons.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpperButtonsComponent extends AccessibleComponent implements OnInit {
  /**
   * Unique id (>=0) of the current instance of this library. This is required when you are using
   * the service to call modal gallery.
   */
  @Input()
  id: number | undefined;
  /**
   * Object of type `Image` that represent the visible image.
   */
  @Input()
  currentImage: Image | undefined;

  /**
   * Output to emit clicks on refresh button. The payload contains a `ButtonEvent`.
   */
  @Output()
  refresh: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit clicks on delete button. The payload contains a `ButtonEvent`.
   */
  @Output()
  delete: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit clicks on navigate button. The payload contains a `ButtonEvent`.
   */
  @Output()
  navigate: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit clicks on download button. The payload contains a `ButtonEvent`.
   */
  @Output()
  download: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit clicks on close button. The payload contains a `ButtonEvent`.
   */
  @Output()
  closeButton: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit clicks on full-screen button. The payload contains a `ButtonEvent`.
   */
  @Output()
  fullscreen: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit clicks on all custom buttons. The payload contains a `ButtonEvent`.
   */
  @Output()
  customEmit: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();

  /**
   * Object of type `ButtonsConfig` to init UpperButtonsComponent's features.
   * For instance, it contains an array of buttons.
   */
  buttonsConfig: ButtonsConfig | undefined;
  /**
   * Array of `InternalButtonConfig` exposed to the template. This field is initialized
   * applying transformations, default values and so on to the input of the same type.
   */
  buttons: InternalButtonConfig[] | undefined;

  /**
   * Default buttons array for standard configuration
   */
  private defaultButtonsDefault: ButtonConfig[] = [KS_DEFAULT_BTN_CLOSE];
  /**
   * Default buttons array for simple configuration
   */
  private simpleButtonsDefault: ButtonConfig[] = [KS_DEFAULT_BTN_DOWNLOAD, ...this.defaultButtonsDefault];
  /**
   * Default buttons array for advanced configuration
   */
  private advancedButtonsDefault: ButtonConfig[] = [KS_DEFAULT_BTN_EXTURL, ...this.simpleButtonsDefault];
  /**
   * Default buttons array for full configuration
   */
  private fullButtonsDefault: ButtonConfig[] = [
    KS_DEFAULT_BTN_FULL_SCREEN,
    KS_DEFAULT_BTN_DELETE,
    ...this.advancedButtonsDefault
  ];

  constructor(private configService: ConfigService) {
    super();
  }

  /**
   * Method ´ngOnInit´ to build `configButtons` applying a default value and also to
   * init the `buttons` array.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig || !libConfig.buttonsConfig) {
      throw new Error('Internal library error - libConfig and buttonsConfig must be defined');
    }
    this.buttonsConfig = libConfig.buttonsConfig;
    switch (this.buttonsConfig.strategy) {
      case ButtonsStrategy.SIMPLE:
        this.buttons = this.addButtonIds(this.simpleButtonsDefault);
        break;
      case ButtonsStrategy.ADVANCED:
        this.buttons = this.addButtonIds(this.advancedButtonsDefault);
        break;
      case ButtonsStrategy.FULL:
        this.buttons = this.addButtonIds(this.fullButtonsDefault);
        break;
      case ButtonsStrategy.CUSTOM:
        this.buttons = this.addButtonIds(this.validateCustomButtons(this.buttonsConfig.buttons));
        break;
      case ButtonsStrategy.DEFAULT:
      default:
        this.buttons = this.addButtonIds(this.defaultButtonsDefault);
        break;
    }
  }

  /**
   * Method called by events from both keyboard and mouse on a button.
   * This will call a private method to trigger an output with the right payload.
   * @param InternalButtonConfig button that called this method
   * @param KeyboardEvent | MouseEvent event payload
   * @param Action action that triggered the source event or `Action.CLICK` if not specified
   * @throws an error if the button type is unknown
   */
  onEvent(button: InternalButtonConfig, event: KeyboardEvent | MouseEvent, action: Action = Action.CLICK): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    if (!event) {
      return;
    }
    const dataToEmit: ButtonEvent = {
      button,
      // current image initialized as null
      // (I'll fill this value inside the parent of this component
      image: null,
      action,
      galleryId: this.id
    };
    switch (button.type) {
      case ButtonType.DELETE:
        this.triggerOnMouseAndKeyboard(this.delete, event, dataToEmit);
        break;
      case ButtonType.EXTURL:
        if (!this.currentImage || !this.currentImage.modal || !this.currentImage.modal.extUrl) {
          return;
        }
        this.triggerOnMouseAndKeyboard(this.navigate, event, dataToEmit);
        break;
      case ButtonType.DOWNLOAD:
        this.triggerOnMouseAndKeyboard(this.download, event, dataToEmit);
        break;
      case ButtonType.CLOSE:
        this.triggerOnMouseAndKeyboard(this.closeButton, event, dataToEmit);
        break;
      case ButtonType.CUSTOM:
        this.triggerOnMouseAndKeyboard(this.customEmit, event, dataToEmit);
        break;
      case ButtonType.FULLSCREEN:
        this.triggerOnMouseAndKeyboard(this.fullscreen, event, dataToEmit);
        break;
      default:
        throw new Error(`Unknown button's type into ButtonConfig`);
    }
  }

  /**
   * Method used in the template to track ids in ngFor.
   * @param number index of the array
   * @param Image item of the array
   * @returns number the id of the item or undefined if the item is not valid
   */
  trackById(index: number, item: InternalButtonConfig): number | undefined {
    return item ? item.id : undefined;
  }

  /**
   * Private method to emit an event using the specified output as an `EventEmitter`.
   * @param EventEmitter<ButtonEvent> emitter is the output to emit the `ButtonEvent`
   * @param KeyboardEvent | MouseEvent event is the source that triggered this method
   * @param ButtonEvent dataToEmit payload to emit
   */
  private triggerOnMouseAndKeyboard(emitter: EventEmitter<ButtonEvent>, event: KeyboardEvent | MouseEvent, dataToEmit: ButtonEvent): void {
    if (!emitter) {
      throw new Error(`UpperButtonsComponent unknown emitter in triggerOnMouseAndKeyboard`);
    }

    const result: number = super.handleImageEvent(event);
    if (result === NEXT) {
      emitter.emit(dataToEmit);
    }
  }

  /**
   * Private method to add ids to the array of buttons.
   * It adds ids in a reverse way, to be sure that the last button will always have id = 0.
   * This is really useful in unit testing to be sure that close button always have id = 0, download 1 and so on...
   * It's totally transparent to the user.
   * @param ButtonConfig[] buttons config array
   * @returns ButtonConfig[] the input array with incremental numeric ids
   */
  private addButtonIds(buttons: ButtonConfig[]): ButtonConfig[] {
    return buttons.map((val: ButtonConfig, i: number) => Object.assign(val, { id: buttons.length - 1 - i }));
  }

  /**
   * Private method to validate custom buttons received as input.
   * @param ButtonConfig[] buttons config array. [] by default.
   * @returns ButtonConfig[] the same input buttons config array
   * @throws an error is exists a button with an unknown type
   */
  private validateCustomButtons(buttons: ButtonConfig[] = []): ButtonConfig[] {
    buttons.forEach((val: ButtonConfig) => {
      const indexOfButtonType: number = WHITELIST_BUTTON_TYPES.findIndex((type: ButtonType) => type === val.type);
      if (indexOfButtonType === -1) {
        throw new Error(`Unknown ButtonType. For custom types use ButtonType.CUSTOM`);
      }
    });
    return buttons;
  }
}
