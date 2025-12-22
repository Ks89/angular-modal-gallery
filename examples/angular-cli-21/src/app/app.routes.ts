import { Routes } from '@angular/router';

import { ModalGalleryExampleComponent } from './modal-gallery/modal-gallery.component';
import { PlainGalleryExampleComponent } from './plain-gallery/plain-gallery.component';
import { CarouselExampleComponent } from './carousel/carousel.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'carousel', component: CarouselExampleComponent },
  { path: 'modal', component: ModalGalleryExampleComponent },
  { path: 'plain', component: PlainGalleryExampleComponent }
];
