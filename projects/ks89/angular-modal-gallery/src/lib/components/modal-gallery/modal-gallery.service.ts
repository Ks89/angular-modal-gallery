import {EventEmitter, Injectable} from '@angular/core';

import {GlobalPositionStrategy, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';

import {Subject} from 'rxjs';
import {ModalGalleryComponent} from './modal-gallery.component';
import {ModalGalleryRef} from './modal-gallery-ref';
import {Image, ImageModalEvent} from '../../model/image.class';
import {ConfigService} from '../../services/config.service';
import {ButtonEvent} from '../../model/buttons-config.interface';
import {ModalGalleryConfig} from '../../model/modal-gallery-config.interface';
import {LibConfig} from '../../model/lib-config.interface';

// private interface used only in this file
interface ModalDialogConfig {
  panelClass: string;
  hasBackdrop: boolean;
  backdropClass: string;
}

/**
 * Payload to be emitted via {@link triggerAttachToOverlay} to enable {@link AttachToOverlayService}
 * to attach the {@link ModalGalleryComponent} to the overlay
 */
export interface AttachToOverlayPayload {
  /**
   * Overlay object created using Angular CDK APIs
   */
  overlayRef: OverlayRef;
  /**
   * Dialog data to be injected into the {@link ModalGalleryComponent}
   * contains: id, array of images, current image and optionally the configuration object
   */
  config: ModalGalleryConfig;
  /**
   * Object to control the dialog instance
   */
  dialogRef: ModalGalleryRef;
}

const DEFAULT_DIALOG_CONFIG: ModalDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'ks-modal-gallery-backdrop',
  panelClass: 'ks-modal-gallery-panel'
};

@Injectable({ providedIn: 'root' })
export class ModalGalleryService {
  private updateImages = new Subject<Image[]>();
  updateImages$ = this.updateImages.asObservable();

  private dialogRef: ModalGalleryRef | undefined;

  public triggerAttachToOverlay = new EventEmitter<AttachToOverlayPayload>();

  constructor(private overlay: Overlay, private configService: ConfigService) {}

  /**
   * Method to open modal gallery passing the configuration
   * @param config ModalGalleryConfig that contains: id, array of images, current image and optionally the configuration object
   * @return ModalGalleryRef | undefined is the object used to listen for events.
   */
  open(config: ModalGalleryConfig): ModalGalleryRef | undefined {
    // Returns an OverlayRef which is a PortalHost
    const overlayRef: OverlayRef = this.createOverlay();
    // Instantiate a reference to the dialog
    this.dialogRef = new ModalGalleryRef(overlayRef);
    // Attach dialog container
    this.triggerAttachToOverlay.emit({
      overlayRef,
      config,
      dialogRef: this.dialogRef
    });
    overlayRef.backdropClick().subscribe(() => {
      if (this.dialogRef) {
        this.dialogRef.closeModal();
      }
    });
    return this.dialogRef;
  }

  /**
   * Method to close a modal gallery previously opened.
   * @param id Unique identifier of the modal gallery
   * @param clickOutside boolean is true if closed clicking on the modal backdrop, false otherwise.
   */
  close(id: number, clickOutside: boolean): void {
    const libConfig: LibConfig | undefined = this.configService.getConfig(id);
    if (clickOutside) {
      if (this.dialogRef && libConfig && libConfig.enableCloseOutside) {
        this.dialogRef.closeModal();
      }
    } else {
      if (this.dialogRef) {
        this.dialogRef.closeModal();
      }
    }
  }

  /**
   * Method to update images array.
   * @param images Image[] updated array of images
   */
  updateModalImages(images: Image[]): void {
    this.updateImages.next(images);
  }

  /**
   * Method to emit close event.
   * @param event ImageModalEvent is the event payload
   */
  emitClose(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitClose(event);
  }

  /**
   * Method to emit show event.
   * @param event ImageModalEvent is the event payload
   */
  emitShow(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitShow(event);
  }

  /**
   * Method to emit firstImage event.
   * @param event ImageModalEvent is the event payload
   */
  emitFirstImage(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitFirstImage(event);
  }

  /**
   * Method to emit lastImage event.
   * @param event ImageModalEvent is the event payload
   */
  emitLastImage(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitLastImage(event);
  }

  /**
   * Method to emit hasData event.
   * @param event ImageModalEvent is the event payload
   */
  emitHasData(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitHasData(event);
  }

  /**
   * Method to emit buttonBeforeHook event.
   * @param event ButtonEvent is the event payload
   */
  emitButtonBeforeHook(event: ButtonEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitButtonBeforeHook(event);
  }

  /**
   * Method to emit buttonAfterHook event.
   * @param event ButtonEvent is the event payload
   */
  emitButtonAfterHook(event: ButtonEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitButtonAfterHook(event);
  }

  /**
   * Private method to create an Overlay using Angular CDK APIs
   * @private
   */
  private createOverlay(): OverlayRef {
    const overlayConfig = this.getOverlayConfig();
    return this.overlay.create(overlayConfig);
  }

  /**
   * Private method to create an OverlayConfig instance
   * @private
   */
  private getOverlayConfig(): OverlayConfig {
    const positionStrategy: GlobalPositionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayConfig: OverlayConfig = new OverlayConfig({
      hasBackdrop: DEFAULT_DIALOG_CONFIG.hasBackdrop,
      backdropClass: DEFAULT_DIALOG_CONFIG.backdropClass,
      panelClass: DEFAULT_DIALOG_CONFIG.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
