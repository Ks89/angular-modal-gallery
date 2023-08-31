import { Injectable, Injector } from '@angular/core';
import { ModalGalleryRef } from './modal-gallery-ref';
import { ModalGalleryComponent } from './modal-gallery.component';
import { DIALOG_DATA } from './modal-gallery.tokens';
import { ComponentPortal } from '@angular/cdk/portal';
import { AttachToOverlayPayload, ModalGalleryService } from './modal-gallery.service';

@Injectable({ providedIn: 'root' })
export class AttachToOverlayService {
  constructor(private injector: Injector, private modalGalleryService: ModalGalleryService) {}

  /**
   * To be called by a provider with the APP_INITIALIZER token.
   */
  public initialize(): void {
    this.modalGalleryService.triggerAttachToOverlay.subscribe(payload => this.attachToOverlay(payload));
  }

  /**
   * Private method to attach ModalGalleryComponent to the overlay.
   * @param payload {@link AttachToOverlayPayload} with all necessary information
   * @private
   */
  private attachToOverlay(payload: AttachToOverlayPayload): void {
    const injector: Injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ModalGalleryRef, useValue: payload.dialogRef },
        { provide: DIALOG_DATA, useValue: payload.config }
      ]
    });

    const containerPortal = new ComponentPortal(ModalGalleryComponent, null, injector);
    payload.overlayRef.attach(containerPortal);
  }
}
