<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/favicon-192x192.png" alt="@ks89/angular-modal-gallery" width="200">
  <br>
  <br>
@ks89/angular-modal-gallery
  <br>
</h1>

<h3 align="center"><b>@ks89/angular-modal-gallery</b> is an Angular library (<b>SSR compatible</b>) to create image galleries.</h3>
<br>
<p align="center">
Despite its name, this library is more than for modal galleries, because I'm introducing new features every major release. In fact, It's composed by 3 main parts:</p>
<ul>
  <li><b>plain-gallery</b>: shows either a row, a column or a grid of <b>clickable thumbnails</b> using pure flexbox</li>
<li><b>modal-gallery</b>: is the core part of this project and display a <b>modal window with full screen images</b>, <b>buttons</b>, the <b>current image</b> and optionally, also navigation <b>dots</b> and <b>previews</b></li>
<li><b>carousel</b>: shows a configurable plain carousel (not modal) with auto-play and other cool features</li>
</ul>
<p><b>@ks89/angular-modal-gallery</b> supports also <b>keyboard shortcuts</b>, <b>swipe gestures</b> and <b>mouse events</b>.</p>
<br>

<p align="center">
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery">
    <img src="https://img.shields.io/npm/v/@ks89/angular-modal-gallery.svg?style=flat-square" alt="npm@latest">
  </a>
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery">
      <img src="https://img.shields.io/npm/v/@ks89/angular-modal-gallery/beta.svg?style=flat-square" alt="npm@beta">
    </a>
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery">
    <img src="https://img.shields.io/npm/v/@ks89/angular-modal-gallery/next.svg?style=flat-square" alt="npm@next">
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery"><img src="https://img.shields.io/npm/dw/@ks89/angular-modal-gallery.svg?style=flat-square" alt="Downloads/week"></a>
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery"><img src="https://img.shields.io/npm/dm/@ks89/angular-modal-gallery.svg?style=flat-square" alt="Downloads/month"></a>
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery"><img src="https://img.shields.io/npm/dy/@ks89/angular-modal-gallery.svg?style=flat-square" alt="Downloads/year"></a>
</p>
<p align="center">
  <a href="https://github.com/Ks89/angular-modal-gallery/actions/workflows/main.yml"><img src="https://github.com/Ks89/angular-modal-gallery/actions/workflows/main.yml/badge.svg" alt="Github Actions CI result"></a>
</p>
<p align="center">
  <a href="https://snyk.io/test/github/ks89/angular-modal-gallery"><img src="https://snyk.io/test/github/ks89/angular-modal-gallery/badge.svg" alt="Known Vulnerabilities"></a>
  <a href="https://david-dm.org/Ks89/angular-modal-gallery"><img src="https://status.david-dm.org/gh/Ks89/angular-modal-gallery.svg" alt="david-dm Dependencies"></a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery?ref=badge_shield"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery.svg?type=shield" alt="FOSSA Status"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier"></a>
</p>
<p align="center">
  <a href="https://coveralls.io/github/Ks89/angular-modal-gallery?branch=master"><img src="https://coveralls.io/repos/github/Ks89/angular-modal-gallery/badge.svg?branch=master" alt="Coveralls Coverage"></a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery"><img src="https://img.shields.io/badge/angular--style--guide-compliant-brightgreen.svg" alt="AngularStyleGuide"></a>
</p>
<p align="center">
  <a href="https://www.paypal.me/stefanocappa"><img src="https://img.shields.io/badge/Donate-PayPal-green.svg?style=flat-square" alt="Donate"></a>
  <a href="https://www.npmjs.com/package/@ks89/angular-modal-gallery"><img src="https://img.shields.io/npm/l/@ks89/angular-modal-gallery.svg?style=flat-square" alt="NPMLicense"></a>
  <a href="https://semver.org/"><img src="https://img.shields.io/badge/semver-2.0-ff69b4.svg?style=flat-square" alt="Semver"></a>
</p>

<h5 align="center">
<b>Do you like @ks89/angular-modal-gallery? Please, add a :star: to support this library</b>
</h5>

<br>

## Table of Contents

1. **[Main parts](#rocket-main-parts-rocket)**
2. **[Features](#boom-features-boom)**
3. **[Installation](#package-installation-package)**
4. **[OFFICIAL DOCUMENTATION](#book-documentation-book)**
5. **[Choose the version](#warning-choose-the-version-warning)**
6. **[News](#fire-news-fire)**
7. **[FAQS](#question-faqs-question)**
8. **[Contributing](#computer-contributing-computer)**
9. **[A big thank you to](#sparkling_heart-a-big-thank-you-to-sparkling_heart)**
10. **[License](#copyright-license-copyright)**

<br>

## :rocket: Main parts :rocket:

### Carousel

<p align="center">
  <img src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/carousel-full.png" alt="Carousel full width">
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/carousel-fix.png" alt="Carousel fixed width">
</p>

### Modal Gallery

<p align="center">
  <img src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/modal1.png" alt="Modal gallery">
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/modal2.png" alt="Modal gallery with buttons">
</p>

### Plain Gallery

<p align="center">
  <img src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/plain-row.png" alt="Plain gallery row">
</p>

<p align="center">
  <img width="80" src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/plain-col.png" alt="Plain gallery column">
  &nbsp;&nbsp;&nbsp;
  <img width="300" src="https://raw.githubusercontent.com/Ks89/angular-modal-gallery/develop/readme-images/plain-grid.png" alt="Plain gallery grid">
</p>

<br>

## :boom: Features :boom:
- Angular Module to import this library
- compliant to Angular Package Format specifications and recommendations
- **use [Semantic versioning 2.0.0](http://semver.org/)** also known as 'semver'
- official examples with `angular-cli`, `angular-cli + material` and `angular-universal` [HERE](https://github.com/Ks89/angular-modal-gallery/tree/master/examples)
- unit testing with high % coverage
- **Server Side Rendering** support with angular-universal
- Web Accessibility features, like ARIA support and [toptal.com](https://www.toptal.com/designers/colorfilter) criteria (tested with `Sim Daltonism` for macOS)
- image **download** with buttons or keyboard shortcuts
- advanced **keyboard shortcuts** with `mousetrap` (both local and global)
- fully configurable default buttons to either close, download, navigate to an external url or delete images and so on
- support custom buttons with both pre and after hooks
- **click outside feature** to close the modal gallery clicking on the background
- configurable **plain gallery**
- configurable **carousel**
- configurable side-previews (visible only on bigger screen)
- configurable dots navigation (visible only on bigger screen)
- configurable previews (visible only on bigger screen)
- and many more... (check the official documentation [HERE](https://ks89.github.io/angular-modal-gallery-2022-v10.github.io/))

<br>

## :package: Installation :package:

- `npm install --save @ks89/angular-modal-gallery`
- `npm install --save hammerjs mousetrap @angular/cdk`
- `npm install --save-dev @types/mousetrap @types/hammerjs`

From version @ks89/angular-modal-gallery >= 5.0.0, **font-awesome isn't a mandatory dependency**.
You can use all default features without font-awesome. For more info, check official [documentation website](https://ks89.github.io/angular-modal-gallery-2022-v10.github.io/).

<br>

## :book: **Documentation** :book:

*Image loading could be slow, because this website is hosted on Github pages*

[OFFICIAL DOCUMENTATION WEBSITE](https://ks89.github.io/angular-modal-gallery-2022-v10.github.io/)

<br>

## :warning: Choose the right version :warning:

|            | @ks89/angular-modal-gallery | font-awesome |
|------------|:---------------------------:| :---:        |
| AngularJS  |        NOT SUPPORTED        |              |
| Angular 2  |           = 3.3.5           | &gt;= 4.0.0  |
| Angular 4  |           = 5.7.1           | optional     |
| Angular 5  |           = 6.3.0           | optional     |
| Angular 6  |           = 7.2.7           | optional     |
| Angular 7  |           = 7.2.7           | optional     |
| Angular 8  |           = 7.2.7           | optional     |
| Angular 9  |           = 7.2.7           | optional     |
| Angular 10 |           = 7.2.7           | optional     |
| Angular 11 |           = 7.2.7           | optional     |
| Angular 12 |           = 8.0.1           | optional     |
| Angular 13 |         &gt;= 9.0.0         | optional     |
| Angular 14 |         &gt;= 9.0.0         | optional     |
| Angular 15 |        &gt;= 10.0.0         | optional     |
| Angular 16 |        &gt;= 11.0.0         | optional     |

*Version 8.0.0 requires at least Angular 12.*
*Version 9.0.0 requires at least Angular 13.*
*Version 10.0.0 requires at least Angular 15.*
*Version 11.0.0 requires at least Angular 16.*

<br>

## :fire: News :fire:

**More than 100 releases in two years**, and more to come... :)

- ??/??/2023 - 11.0.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 11/18/2022 - 10.0.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 11/17/2022 - 10.0.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 08/03/2022 - 10.0.0-rc.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 05/10/2022 - 9.1.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 04/23/2022 - 9.1.0-beta.2 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 04/14/2022 - 9.1.0-beta.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 11/15/2021 - 9.0.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 11/06/2021 - 9.0.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 09/27/2021 - 8.0.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 07/10/2021 - 8.0.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 06/13/2021 - 8.0.0-rc.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 11/22/2020 - 8.0.0-beta.5 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 08/14/2020 - 8.0.0-beta.4 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 08/12/2020 - 8.0.0-beta.3 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 06/02/2020 - 8.0.0-beta.2 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 05/02/2020 - 8.0.0-beta.1 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 12/05/2020 - 7.2.7 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- - ... (many minor 7.x.x versions)
- 12/06/2018 - 7.0.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- 10/11/2018 - 6.3.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 6.x.x versions)
- 06/10/2018 - 6.0.0 - @ks89/angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 5.x.x versions)
- 02/27/2018 - 5.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 4.x.x versions)
- 11/05/2017 - 4.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 3.x.x versions)
- 03/20/2017 - 3.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)
- ... (many minor 2.x.x versions)
- 01/29/2017 - 2.0.0 - angular-modal-gallery - [HERE](https://github.com/Ks89/angular-modal-gallery/releases)

<br>

## :question: FAQS :question:

1. Question: **I have this error: `Cannot find name 'MousetrapInstance'`. What can I do?**<br>
   **Answer**: Simply run `npm i --save-dev @types/mousetrap`
2. Question: **I have this error: `Error: No provider for KeyboardService`. What can I do?**<br>
   **Answer**: You forgot to add .forRoot(), so KeyboardService will be never available as a service. Please read section "Installation" [HERE](https://ks89.github.io/angular-modal-gallery-2022-v10.github.io/gettingStarted).
   This is a common design pattern for Angular libraries. For more info check also [this issue](https://github.com/Ks89/angular-modal-gallery/issues/94).
3. Question: **How can I remove images using DELETE button without issues?**<br>
   **Answer**: **You cannot change the input image array. Instead, you should reassign it with a newer array** without the deleted element.
   In other words, **you must think in a functional way**, without changing the input array of images.
   For more information check this official demo [HERE](https://ks89.github.io/angular-modal-gallery-2022-v10.github.io/demo/buttons-strategies).

<br>

## :computer: Contributing :computer:

Check `CONTRIBUTING.md` in this repository.
To understand how to contribute to an open source project, [HERE](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) you can find useful information.

When you create a pull request, please, format your code to be consistent with the existing code. I suggest to use [WebStorm](https://www.jetbrains.com/webstorm/) as IDE and when you commit don't use a third party software, but the official command line `git`.
In this way, [prettier](https://prettier.io/) will run using my configuration, and it will auto-format the code. If it fails, add files with `git add .` again and retry.

<br>

## :sparkling_heart: A big thank you to :sparkling_heart:

##### all authors of icons used in this library:
- Icons made by <a href="https://www.flaticon.com/authors/smartline" title="Smartline">Smartline</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
- Icons made by <a href="https://www.flaticon.com/authors/dario-ferrando" title="Dario Ferrando">Dario Ferrando</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>

##### all authors of spinners used in this library:
- <a href="https://github.com/lukehaas">Luke Haas (@lukehaas)</a> - <a href="https://github.com/lukehaas/css-loaders">lukehaas/css-loaders</a></li>
- <a href="https://github.com/martinvd">Martin van Driel (@martinvd)</a> - <a href="https://codepen.io/martinvd/pen/xbQJom">martinvd example on codepen.io</a></li>
- <a href="https://devalchemist.com/">Devilish Alchemist</a> - <a href="https://codepen.io/devilishalchemist/pen/emOVYQ">devilishalchemist example on codepen.io</a></li>
- <a href="https://github.com/nikhil8krishnan">Nikhil Krishnan</a> - <a href="https://codepen.io/nikhil8krishnan/pen/dMEzGx">nikhil8krishnan example on codepen.io</a></li>
- <a href="https://codepen.io/WebSonata/">Anastasiya Kuligina</a> - <a href="https://codepen.io/WebSonata/pen/bRaONB">Anastasiya Kuligina example on codepen.io</a></li>

<br>

## :copyright: License :copyright:

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

<br/>

If you like my projects you can do a free donation here [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/stefanocappa)


## FOSSA report

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKs89%2Fangular-modal-gallery?ref=badge_large)

<br/>

**Created by Stefano Cappa**

**[⬆ back to top](#table-of-contents)**
