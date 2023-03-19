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

import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';

/**
 * Directive to change margins of an element.
 */
@Directive({
  selector: '[ksMargin]'
})
export class MarginDirective implements OnInit, OnChanges {
  /**
   * String to set the margin of an element.
   */
  @Input()
  marginLeft: string | undefined;
  /**
   * String to set the margin of an element.
   */
  @Input()
  marginRight: string | undefined;
  /**
   * String to set the margin of an element.
   */
  @Input()
  marginTop: string | undefined;
  /**
   * String to set the margin of an element.
   */
  @Input()
  marginBottom: string | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  /**
   * Method ´ngOnInit´ to apply the style of this directive.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    this.applyStyle();
  }

  /**
   * Method ´ngOnChanges´ to apply the style of this directive.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(): void {
    this.applyStyle();
  }

  /**
   * Private method to change both width and height of an element.
   */
  private applyStyle(): void {
    if (this.marginLeft) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-left', this.marginLeft);
    }
    if (this.marginRight) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-right', this.marginRight);
    }
    if (this.marginTop) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-top', this.marginTop);
    }
    if (this.marginBottom) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', this.marginBottom);
    }
  }
}
