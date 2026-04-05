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
import { Description } from '../model/description.interface';

/**
 * Directive to customize the description.
 */
@Directive({ selector: '[ksDescription]' })
export class DescriptionDirective implements OnInit, OnChanges {
  /**
   * Object of type `Description` to resize the element.
   */
  readonly description = input<Description>();

  private renderer: Renderer2 = inject(Renderer2);
  private el: ElementRef = inject(ElementRef);

  /**
   * Method `ngOnInit` to apply the style of this directive.
   * This is an angular lifecycle hook, so it's called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    this.applyStyle();
  }

  /**
   * Method `ngOnChanges` to apply the style of this directive.
   * This is an angular lifecycle hook, so it's called automatically by Angular itself.
   * In particular, it's called when any data-bound property of a directive changes!!!
   */
  ngOnChanges(): void {
    this.applyStyle();
  }

  /**
   * Private method to change description's style.
   */
  private applyStyle(): void {
    const description = this.description();
    if (!description) {
      return;
    }
    if (description.style) {
      const bgColor = this.sanitizeCssValue(description.style.bgColor);
      if (bgColor) {
        this.renderer.setStyle(this.el.nativeElement, 'background', bgColor);
      }
      const textColor = this.sanitizeCssValue(description.style.textColor);
      if (textColor) {
        this.renderer.setStyle(this.el.nativeElement, 'color', textColor);
      }

      const width = this.sanitizeCssValue(description.style.width);
      if (width) {
        this.renderer.setStyle(this.el.nativeElement, 'width', width);
      }
      const height = this.sanitizeCssValue(description.style.height);
      if (height) {
        this.renderer.setStyle(this.el.nativeElement, 'height', height);
      }
      const position = this.sanitizePosition(description.style.position);
      if (position) {
        this.renderer.setStyle(this.el.nativeElement, 'position', position);
      }

      const top = this.sanitizeCssValue(description.style.top);
      if (top) {
        this.renderer.setStyle(this.el.nativeElement, 'top', top);
      }
      const bottom = this.sanitizeCssValue(description.style.bottom);
      if (bottom) {
        this.renderer.setStyle(this.el.nativeElement, 'bottom', bottom);
      }
      const left = this.sanitizeCssValue(description.style.left);
      if (left) {
        this.renderer.setStyle(this.el.nativeElement, 'left', left);
      }
      const right = this.sanitizeCssValue(description.style.right);
      if (right) {
        this.renderer.setStyle(this.el.nativeElement, 'right', right);
      }

      this.renderer.setStyle(this.el.nativeElement, 'margin-top', this.sanitizeCssValue(description.style.marginTop) ?? '0px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', this.sanitizeCssValue(description.style.marginBottom) ?? '0px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-left', this.sanitizeCssValue(description.style.marginLeft) ?? '0px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-right', this.sanitizeCssValue(description.style.marginRight) ?? '0px');
    }
  }

  private sanitizeCssValue(value: string | undefined): string | undefined {
    if (!value) {
      return value;
    }
    if (/expression\s*\(/i.test(value) || /javascript\s*:/i.test(value) || /[;{}]/.test(value)) {
      return undefined;
    }
    return value;
  }

  private sanitizePosition(value: string | undefined): string | undefined {
    if (!value) {
      return value;
    }
    const allowed = ['static', 'relative', 'absolute', 'fixed', 'sticky'];
    return allowed.includes(value.toLowerCase().trim()) ? value : undefined;
  }
}
