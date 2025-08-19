import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

import { GalleryModule } from '@ks89/angular-modal-gallery';

bootstrapApplication(AppComponent, {
  // import GalleryModule. Install @ks89/angular-modal-gallery first
  providers: [importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule, GalleryModule)]
})
  .catch(err => console.error(err));
