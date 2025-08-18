import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  // import GalleryModule. Install @ks89/angular-modal-gallery first
  providers: [importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule, GalleryModule)]
})
  .catch(err => console.error(err));
