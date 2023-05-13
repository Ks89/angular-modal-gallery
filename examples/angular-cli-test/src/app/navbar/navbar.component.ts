/*
 * MIT License
 *
 * Copyright (c) 2017-2023 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'ks-navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['navbar.scss']
})
export class NavbarComponent {
  navbarHeight = '56px';
  // path: string = PATH + '/assets/amg.svg';

  collapsed = false;

  constructor(private router: Router, breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(['(min-width: 990px)']).subscribe(result => {
      if (result.matches) {
        console.log('min width 990px');
        this.collapsed = false;
      }
    });
  }

  isNavItemActive(location: string): string {
    return this.router.url.includes(location) ? 'active' : '';
  }

  onNavigateTo(path: string): void {
    this.collapsed = false;
    this.router.navigate([path]);
  }

  onToggle(): void {
    this.collapsed = !this.collapsed;
    this.navbarHeight = this.collapsed ? '56px' : '150px';
  }
}
