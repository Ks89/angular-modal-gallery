/*
 * Copyright (C) 2017-2021 Stefano Cappa
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
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { LoadingSpinnerComponent } from './loading-spinner.component';
import { AccessibilityConfig } from '../../../model/accessibility.interface';
import { LoadingConfig, LoadingType } from '../../../model/loading-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../../accessibility-default';

let comp: LoadingSpinnerComponent;
let fixture: ComponentFixture<LoadingSpinnerComponent>;

const CUSTOM_ACCESSIBILITY: AccessibilityConfig = Object.assign({}, KS_DEFAULT_ACCESSIBILITY_CONFIG);
CUSTOM_ACCESSIBILITY.loadingSpinnerAriaLabel = 'custom loadingSpinnerAriaLabel';
CUSTOM_ACCESSIBILITY.loadingSpinnerTitle = 'custom loadingSpinnerTitle';

const VISIBLE_CONFIG: LoadingConfig[] = [
  {enable: true, type: LoadingType.STANDARD},
  {enable: true, type: LoadingType.BARS},
  {enable: true, type: LoadingType.CIRCULAR},
  {enable: true, type: LoadingType.DOTS},
  {enable: true, type: LoadingType.CUBE_FLIPPING},
  {enable: true, type: LoadingType.CIRCLES},
  {enable: true, type: LoadingType.EXPLOSING_SQUARES}
];

function initTestBed(): void {
  TestBed.configureTestingModule({
    declarations: [LoadingSpinnerComponent]
  });
}

describe('LoadingSpinnerComponent', () => {
  beforeEach(() => {
    initTestBed();
    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    VISIBLE_CONFIG.forEach((loadingConfig: LoadingConfig, i: number) => {
      it(`should display loading spinner with default accessibility config. Test i=${i}`, () => {
        comp.loadingConfig = loadingConfig;
        comp.accessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;
        const spinnerContainer: DebugElement = element.query(By.css('div'));
        expect(spinnerContainer).not.toBeUndefined();
        expect(spinnerContainer.name).toBe('div');
        expect(spinnerContainer.attributes['aria-label']).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.loadingSpinnerAriaLabel);
        expect(spinnerContainer.properties.title).toBe(KS_DEFAULT_ACCESSIBILITY_CONFIG.loadingSpinnerTitle);

        switch (loadingConfig.type) {
          case LoadingType.STANDARD:
            const cssLoadLoader: DebugElement = element.query(By.css('div.cssload-loader'));
            expect(cssLoadLoader).not.toBeUndefined();
            expect(cssLoadLoader.name).toBe('div');
            const cssloadInner1: DebugElement = element.query(By.css('div.cssload-inner.cssload-one'));
            expect(cssloadInner1).not.toBeUndefined();
            expect(cssloadInner1.name).toBe('div');
            const cssloadInner2: DebugElement = element.query(By.css('div.cssload-inner.cssload-two'));
            expect(cssloadInner2).not.toBeUndefined();
            expect(cssloadInner2.name).toBe('div');
            const cssloadInner3: DebugElement = element.query(By.css('div.cssload-inner.cssload-three'));
            expect(cssloadInner3).not.toBeUndefined();
            expect(cssloadInner3.name).toBe('div');
            break;
          case LoadingType.DOTS:
            const dotsSpinner: DebugElement = element.query(By.css('div.loader-dots'));
            expect(dotsSpinner).not.toBeUndefined();
            expect(dotsSpinner.name).toBe('div');
            break;
          case LoadingType.CIRCULAR:
            const circularSpinner: DebugElement = element.query(By.css('div.loader-circular'));
            expect(circularSpinner).not.toBeUndefined();
            expect(circularSpinner.name).toBe('div');
            break;
          case LoadingType.BARS:
            const barsSpinner: DebugElement = element.query(By.css('div.loader-bars'));
            expect(barsSpinner).not.toBeUndefined();
            expect(barsSpinner.name).toBe('div');
            break;
          case LoadingType.CUBE_FLIPPING:
            const cubeFlippingSpinner: DebugElement = element.query(By.css('div.cube-wrapper'));
            expect(cubeFlippingSpinner).not.toBeUndefined();
            expect(cubeFlippingSpinner.name).toBe('div');
            const cssCubeFolding: DebugElement = element.query(By.css('div.cube-wrapper > div.cube-folding'));
            expect(cssCubeFolding).not.toBeUndefined();
            expect(cssCubeFolding.name).toBe('div');
            const cssLeaf1: DebugElement = element.query(By.css('div.cube-wrapper > div.cube-folding >.leaf1'));
            expect(cssLeaf1).not.toBeUndefined();
            expect(cssLeaf1.name).toBe('span');
            const cssLeaf2: DebugElement = element.query(By.css('div.cube-wrapper > div.cube-folding >.leaf2'));
            expect(cssLeaf2).not.toBeUndefined();
            expect(cssLeaf2.name).toBe('span');
            const cssLeaf3: DebugElement = element.query(By.css('div.cube-wrapper> div.cube-folding >.leaf3'));
            expect(cssLeaf3).not.toBeUndefined();
            expect(cssLeaf3.name).toBe('span');
            break;
          case LoadingType.CIRCLES:
            const circlesSpinner: DebugElement = element.query(By.css('#preloader'));
            expect(circlesSpinner).not.toBeUndefined();
            expect(circlesSpinner.name).toBe('div');
            const cssLoader: DebugElement = element.query(By.css('#loader'));
            expect(cssLoader).not.toBeUndefined();
            expect(cssLoader.name).toBe('div');
            break;
          case LoadingType.EXPLOSING_SQUARES:
            const explosingSquaresSpinner: DebugElement = element.query(By.css('div.loader'));
            expect(explosingSquaresSpinner).not.toBeUndefined();
            expect(explosingSquaresSpinner.name).toBe('div');
            explosingSquaresSpinner.children.forEach((el: DebugElement) => {
              expect(el.name).toBe('span');
            });
            break;
        }
      });
    });

    VISIBLE_CONFIG.forEach((loadingConfig: LoadingConfig, i: number) => {
      it(`should display loading spinner with CUSTOM accessibility config. Test i=${i}`, () => {
        comp.loadingConfig = loadingConfig;
        comp.accessibilityConfig = CUSTOM_ACCESSIBILITY;
        fixture.detectChanges();

        const element: DebugElement = fixture.debugElement;
        const spinnerContainer: DebugElement = element.query(By.css('div'));
        expect(spinnerContainer).not.toBeUndefined();
        expect(spinnerContainer.name).toBe('div');
        expect(spinnerContainer.attributes['aria-label']).toBe(CUSTOM_ACCESSIBILITY.loadingSpinnerAriaLabel);
        expect(spinnerContainer.properties.title).toBe(CUSTOM_ACCESSIBILITY.loadingSpinnerTitle);

        switch (loadingConfig.type) {
          case LoadingType.STANDARD:
            const cssLoadLoader: DebugElement = element.query(By.css('div.cssload-loader'));
            expect(cssLoadLoader).not.toBeUndefined();
            expect(cssLoadLoader.name).toBe('div');
            const cssloadInner1: DebugElement = element.query(By.css('div.cssload-inner.cssload-one'));
            expect(cssloadInner1).not.toBeUndefined();
            expect(cssloadInner1.name).toBe('div');
            const cssloadInner2: DebugElement = element.query(By.css('div.cssload-inner.cssload-two'));
            expect(cssloadInner2).not.toBeUndefined();
            expect(cssloadInner2.name).toBe('div');
            const cssloadInner3: DebugElement = element.query(By.css('div.cssload-inner.cssload-three'));
            expect(cssloadInner3).not.toBeUndefined();
            expect(cssloadInner3.name).toBe('div');
            break;
          case LoadingType.DOTS:
            const dotsSpinner: DebugElement = element.query(By.css('div.loader-dots'));
            expect(dotsSpinner).not.toBeUndefined();
            expect(dotsSpinner.name).toBe('div');
            break;
          case LoadingType.CIRCULAR:
            const circularSpinner: DebugElement = element.query(By.css('div.loader-circular'));
            expect(circularSpinner).not.toBeUndefined();
            expect(circularSpinner.name).toBe('div');
            break;
          case LoadingType.BARS:
            const barsSpinner: DebugElement = element.query(By.css('div.loader-bars'));
            expect(barsSpinner).not.toBeUndefined();
            expect(barsSpinner.name).toBe('div');
            break;
          case LoadingType.CUBE_FLIPPING:
            const cubeFlippingSpinner: DebugElement = element.query(By.css('div.cube-wrapper'));
            expect(cubeFlippingSpinner).not.toBeUndefined();
            expect(cubeFlippingSpinner.name).toBe('div');
            const cssCubeFolding: DebugElement = element.query(By.css('div.cube-wrapper > div.cube-folding'));
            expect(cssCubeFolding).not.toBeUndefined();
            expect(cssCubeFolding.name).toBe('div');
            const cssLeaf1: DebugElement = element.query(By.css('div.cube-wrapper > div.cube-folding >.leaf1'));
            expect(cssLeaf1).not.toBeUndefined();
            expect(cssLeaf1.name).toBe('span');
            const cssLeaf2: DebugElement = element.query(By.css('div.cube-wrapper > div.cube-folding >.leaf2'));
            expect(cssLeaf2).not.toBeUndefined();
            expect(cssLeaf2.name).toBe('span');
            const cssLeaf3: DebugElement = element.query(By.css('div.cube-wrapper> div.cube-folding >.leaf3'));
            expect(cssLeaf3).not.toBeUndefined();
            expect(cssLeaf3.name).toBe('span');
            break;
          case LoadingType.CIRCLES:
            const circlesSpinner: DebugElement = element.query(By.css('#preloader'));
            expect(circlesSpinner).not.toBeUndefined();
            expect(circlesSpinner.name).toBe('div');
            const cssLoader: DebugElement = element.query(By.css('#loader'));
            expect(cssLoader).not.toBeUndefined();
            expect(cssLoader.name).toBe('div');
            break;
          case LoadingType.EXPLOSING_SQUARES:
            const explosingSquaresSpinner: DebugElement = element.query(By.css('div.loader'));
            expect(explosingSquaresSpinner).not.toBeUndefined();
            expect(explosingSquaresSpinner.name).toBe('div');
            explosingSquaresSpinner.children.forEach((el: DebugElement) => {
              expect(el.name).toBe('span');
            });
            break;
        }
      });
    });
  });
});
