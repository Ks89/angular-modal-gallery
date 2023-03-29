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

import { Image } from '../model/image.class';
import { SafeResourceUrl } from '@angular/platform-browser';

/**
 * Directive to add an image to an `<a>` tag with some additional custom properties.
 */
@Directive({
  selector: '[ksATagBgImage]'
})
export class ATagBgImageDirective implements OnInit, OnChanges {
  /**
   * Object of type `Image` that represents the image to add to the `<a>` tag.
   */
  @Input()
  image: Image | undefined;
  /**
   * Additional style to customize the background attribute.
   * Empty string by default.
   */
  @Input()
  style: string | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

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
   * Private method to add an image as background of an `<a>` tag.
   */
  private applyStyle(): void {
    if (!this.image || (!this.image.plain && !this.image.modal)) {
      return;
    }

    const imgPath: string | SafeResourceUrl = this.image.plain && this.image.plain.img ? this.image.plain.img : this.image.modal.img;
    let bg = `url("${imgPath}") ${this.style}`;

    const fallbackImgPath: string | SafeResourceUrl | undefined =
      this.image.plain && this.image.plain.fallbackImg ? this.image.plain.fallbackImg : this.image.modal.fallbackImg;
    if (!!fallbackImgPath) {
      bg += `, url("${fallbackImgPath}") ${this.style}`;
    }

    this.renderer.setStyle(this.el.nativeElement, 'background', bg);
  }
}
