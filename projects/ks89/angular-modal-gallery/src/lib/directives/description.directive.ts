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
   * Private method to change description's style.
   */
  private applyStyle(): void {
    const description = this.description();
    if (!description) {
      return;
    }
    if (description.style) {
      this.renderer.setStyle(this.el.nativeElement, 'background', description.style.bgColor);
      this.renderer.setStyle(this.el.nativeElement, 'color', description.style.textColor);

      if (description.style.width) {
        this.renderer.setStyle(this.el.nativeElement, 'width', description.style.width);
      }
      if (description.style.height) {
        this.renderer.setStyle(this.el.nativeElement, 'height', description.style.height);
      }
      if (description.style.position) {
        this.renderer.setStyle(this.el.nativeElement, 'position', description.style.position);
      }
      if (description.style.top) {
        this.renderer.setStyle(this.el.nativeElement, 'top', description.style.top);
      }
      if (description.style.bottom) {
        this.renderer.setStyle(this.el.nativeElement, 'bottom', description.style.bottom);
      }
      if (description.style.left) {
        this.renderer.setStyle(this.el.nativeElement, 'left', description.style.left);
      }
      if (description.style.right) {
        this.renderer.setStyle(this.el.nativeElement, 'right', description.style.right);
      }

      this.renderer.setStyle(this.el.nativeElement, 'margin-top', description.style.marginTop ? description.style.marginTop : '0px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', description.style.marginBottom ? description.style.marginBottom : '0px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-left', description.style.marginLeft ? description.style.marginLeft : '0px');
      this.renderer.setStyle(this.el.nativeElement, 'margin-right', description.style.marginRight ? description.style.marginRight : '0px');
    }
  }
}
