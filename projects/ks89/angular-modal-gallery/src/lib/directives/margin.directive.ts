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

import { Directive, ElementRef, inject, OnChanges, OnInit, Renderer2, input } from '@angular/core';

/**
 * Directive to change margins of an element.
 */
@Directive({ selector: '[ksMargin]' })
export class MarginDirective implements OnInit, OnChanges {
  /**
   * String to set the margin of an element.
   */
  readonly marginLeft = input<string>();
  /**
   * String to set the margin of an element.
   */
  readonly marginRight = input<string>();
  /**
   * String to set the margin of an element.
   */
  readonly marginTop = input<string>();
  /**
   * String to set the margin of an element.
   */
  readonly marginBottom = input<string>();

  private renderer: Renderer2 = inject(Renderer2);
  private el: ElementRef = inject(ElementRef);

  /**
   * Method ´ngOnInit´ to apply the style of this directive.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    this.applyStyle();
  }

  /**
   * Method ´ngOnChanges´ to apply the style of this directive.
   * This is an angular lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(): void {
    this.applyStyle();
  }

  /**
   * Private method to change both width and height of an element.
   */
  private applyStyle(): void {
    const marginLeft = this.marginLeft();
    if (marginLeft) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-left', marginLeft);
    }
    const marginRight = this.marginRight();
    if (marginRight) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-right', marginRight);
    }
    const marginTop = this.marginTop();
    if (marginTop) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-top', marginTop);
    }
    const marginBottom = this.marginBottom();
    if (marginBottom) {
      this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', marginBottom);
    }
  }
}
